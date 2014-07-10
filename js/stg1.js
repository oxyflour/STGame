function newStg1BgAnim(bg) {
	var imgs = $('#bg_stg1_top, #bg_stg1_bottom');
	ieach(imgs, function(i, e, d) {
		e.val = d[e.id];
		updateBgImg(e, 0);
	}, {
		bg_stg1_bottom: {
			persp: [900, 500],
			rotate: [50, 70],
			oriy: -50,
		},
		bg_stg1_top: {
			persp: [700, 500],
			rotate: [30, 80],
			opacity: [1, 0],
			oriy: -100,
		}
	});
	bg.anim(50, function(d) {
		var age = d.age,
			begin = 25000,
			end = 30000;
		if (age >= begin && age <= end) {
			var f = ease_in_out((age - begin) / (end - begin));
			ieach(imgs, function(i, e) {
				updateBgImg(e, f);
			});
		}
	}, bg.data);
}

function newSec1(pth, count, offset, interval, speed, rand, life) {
	STORY.timeout(function (d, n) {
		ieach(offset || [[0, 0]], function(i, v) {
			var obj = SPRITE.newObj('Enemy', {
				life: life || 2,
				frames: RES.frames.Enemy00,
				pathnodes: UTIL.pathOffset(RES.path[pth], v[0], v[1]),
			});
			STORY.timeout(function() {
				obj.anim(interval || 1500, function() {
					newDanns1(obj, speed, rand);
				});
			}, random(1500));
		});
	}, 250, null, count);
}
function newSec2(ylim, count, speed) {
	STORY.timeout(function (d, n) {
		ieach([-1, 1], function(i, x) {
			var f = 0.5 + (n+0.5)/(count+0.5)*0.5 * x,
				dvx = 0.005 * x, dvy = -0.003;
			var obj = SPRITE.newObj('Enemy', {
				life: 2,
				frames: RES.frames.Enemy00,
				x: UTIL.getGamePosX(f),
				y: 0,
				vy: 0.1,
				vx: 0,
				dvx: dvx,
				dvy: dvy,
			});
			obj.anim(50, function(d) {
				if (d.y > UTIL.getGamePosY(ylim)) {
					d.vx += d.dvx;
					d.vy += d.dvy;
				}
				if (d.age > 200 && !this.is_firing && (this.is_firing = true))
					newDanns1(this, speed);
			}, obj.data);
		});
	}, 350, null, count);
}
function newSec3(tick, count, layers, life) {
	STORY.timeout(function (d, n) {
		var enm = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy01,
			life: life || 5,
			x: UTIL.getGamePosX(random(0, 1)),
			y: 0,
			vy: 0.1,
			vx: 0,
			dvy: -0.005,
			vx0: random(-0.1, 0.1),
		});
		enm.anim(50, function(d) {
			if (d.age > 600 && !this.is_firing && (this.is_firing = true)) {
				d.vy = 0;
				STORY.timeout(newDanns2, 300, this, layers || 2);
				UTIL.addFrameAnim(enm, RES.frames.Enemy11);
			}
			else if (d.age > 2000) {
				d.vy += d.dvy;
				d.vx = d.vx0;
			}
		}, enm.data);
	}, tick, null, count);
}
function newSec4(fn, life) {
	STORY.timeout(function (d, n) {
		var pth = RES.path[randin(['s0A1', 's0A2'])],
			ps = UTIL.pathOffset(pth, random(-200, 200), random(0, 200));
			px = ps[0].x;
		ps[0].x = ps[0].y = undefined;
		var obj = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy00,
			life: life || 2,
			x: px,
			y: GAME.rect.t,
			pathnodes: ps,
		});
		STORY.timeout(function() {
			obj.anim(1500, fn || newDanns1, obj);
		}, random(1500));
	}, 200, null, 20);
}
function newSecEx1(rad) {
	var obj = SPRITE.newObj('Enemy', {
		frames: RES.frames.EnemyX,
		life: 30,
		x: UTIL.getGamePosX(random(0.5, rad > 0 ? 1 : 0)),
		y: 0,
		vy: 0.1,
		vx: 0,
		rt: 0,
		ri: 0,
		duration: 10000,
	});
	obj.anim(60, function(d) {
		if (d.age > 500 && !this.is_dying)
			newDannsEx1(this, Math.sin(d.rt += rad || 0.2), d.ri++ % 2 ? 0.2 : 0.15);
		if (d.age > 1000)
			d.vy = 0;
	}, obj.data);
}
function newSecEx2(fx, fy, vx, vy) {
	var obj = SPRITE.newObj('Enemy', {
		frames: RES.frames.EnemyX,
		life: 30,
		x: UTIL.getGamePosX(fx),
		y: UTIL.getGamePosX(fy),
		vx: vx,
		vy: vy,
		idx: 0,
	});
	obj.anim(60, function(d) {
		d.vy -= 0.004;
		newDannsEx2(this, vx < 0 ? 0.2 : -0.2);
	}, obj.data);
}

function newDanns1(from, speed, rand) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) {
		newDannmaku(from, to, 0, rand ? random(rand) : 0, speed || 0.2, 0, {
			color: 'b',
			tama: 'TamaMini',
		});
	}
}
function newDanns2(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) range(0.501, -0.5, 1/8, function(f) {
		var obj = newDannmaku(from, to, 0, f*PI*0.6, 0.4, 0, {
			dh: 1/200,
			color: 'r',
			frames: RES.frames.TamaA[2],
		});
		obj.anim(50, function(d) {
			return d.age < 800 ? decrease_object_speed(d, 0.9) : true;
		}, obj.data);
	})
}
function newDannsEx1(from, rt, v) {
	var to = UTIL.getNearestAlive(from, 'Player');
	return newDannmaku(from, to, 0, rt, v, 0, {
		color: 'r',
		tama: 'TamaMini',
	})
}
function newDannsEx2(from, vt, f) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var dmk = newDannmaku(from, to, 0, 0, 0.2, 0, {
		sx: from.data.x,
		sy: from.data.y,
		color: 'w',
		frames: RES.frames.TamaB,
		vr: 0,
		vt: vt,
	});
	dmk.anim(100, function(d) {
		if (d.age < 500) {
			decrease_object_speed(d, 0.9);
		}
		else if (d.age < 2000) {
			var r = sqrt_sum(d.x - d.sx, d.y - d.sy),
				cos = (d.x - d.sx) / r,
				sin = (d.y - d.sy) / r;
			d.vx = d.vr * cos + d.vt * sin;
			d.vy = d.vr * sin - d.vt * cos;
		}
		else if (d.age < 4000) {
			to && redirect_object(d, to.data, Math.abs(vt), f || 0.2);
		}
		else {
			return true;
		}
	}, dmk.data);
	return dmk;
}

function newBossDanns1NoSound(from, color, count, angular, dv) {
	from.is_firing = true;
	var to = UTIL.getNearestAlive(from, 'Player'),
		frame = RES.frames.TamaA[('k rm b c g  y  w').indexOf(color)];
	if (!from.is_dying) array(count || 7, function(j) {
		range(1, 0.001, 1/(angular || 15), function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.1+j*(dv || 0.01), 0, {
				color: color,
				frames: frame,
			})
		})
	})
}
function newBossDanns1(from) {
	newBossDanns1NoSound.apply(null, arguments);
	RES.se_power1.play()
}
function newBossDanns0(from) {
	var n = STORY.state.n,
		to = UTIL.getNearestAlive(from, 'Player'),
		fs = RES.frames.ta;
	STORY.timeout(function() {
		var r = random(-0.05, 0.05);
		if (!from.is_dying) range(1, 0.001, 1/50, function(f) {
			newDannmaku(from, to, 0, f*PI2+r, 0.15, 0, {
				color: 'b',
				tama: 'TamaMini',
			});
		});
	}, 500, null, Inf);
}
function newBossDanns0A(from) {
	if (!from.is_dying) ieach([1350, -1350], function(i, x) {
		var obj = newLaserWithDot(from, from.data.x, from.data.y, x, 500, 32, {
			opacity: 0.9,
			duration: 3000,
			dh: 1/500,
		});
		obj.anim(20, function(d) {
			if (!this.is_creating && !this.is_dying)
				d.dx += d.dx > 0 ? -10: 10;
		}, obj.data);
	});
}
function newBossDanns2(from) {
	from.is_firing = true;
	var to = UTIL.getNearestAlive(from, 'Player');
	var ds = 'krrmmbb';
	if (!from.is_dying) STORY.timeout(function(d, j) {
		range(1, 0.001, 1/15, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2+j*0.1, 0.1, 0, {
				color: d[j],
				tama: 'TamaMini',
			});
			obj.anim(50, function(d) {
				if (d.age < 2000) {
					decrease_object_speed(d, 0.95);
				}
				else if (d.age > 2500) {
					var v = sqrt_sum(d.vx, d.vy);
					if (v < 0.2) {
						d.vx += d.vx / v * 0.01;
						d.vy += d.vy / v * 0.01;
					}
				}
			}, obj.data);
		});
	}, 150, ds, ds.length);
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, 5);
}
function newBossDanns3(from, colors) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var df = {
		'b': { color:'b', frames1:RES.frames.TamaMini[5], frames2:RES.frames.LongA[6], },
		'r': { color:'r', frames1:RES.frames.TamaMini[1], frames2:RES.frames.LongA[2], },
		'g': { color:'g', frames1:RES.frames.TamaMini[2], frames2:RES.frames.LongA[9], },
		'y': { color:'y', frames1:RES.frames.TamaMini[4], frames2:RES.frames.LongA[12], },
		'Y': { color:'y', frames1:RES.frames.TamaMini[5], frames2:RES.frames.LongA[14], },
		'B': { color:'b', frames1:RES.frames.TamaMini[5], frames2:RES.frames.TamaA[5], },
	};
	var ds = ieach(colors, function(i, c, d) {
		if (df[c]) d.push(df[c]);
	}, []);
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var para = d[j],
			dt1 = random(0.1),
			dt2 = random(0.1),
			v1 = random(0.06, 0.15),
			v2 = random(0.06, 0.15);
		range(1, 0.001, 1/20, function(f) {
			para.frames1 && newDannmaku(from, to, 0, f*PI2+dt1, v1, 0, {
				r: 3,
				color: para.color,
				frames: para.frames1,
			});
			para.frames2 && newDannmaku(from, to, 0, f*PI2+dt2, v2, 0, {
				r: 3,
				color: para.color,
				frames: para.frames2,
			});
		});
	}, 150, ds, ds.length);
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, colors.length);
}
function newBossDanns4(from, count, color) {
	var to = UTIL.getNearestAlive(from, 'Player');
	color = color || 'r';
	var frame = RES.frames.TamaA[('k r m b c g y ow').indexOf(color = color || 'r')];
	if (!from.is_dying) STORY.timeout(function(d, k) {
		c = count - k;
		array(10, function(j) {
			array(c, function(i) {
				var f = (i - (c-1) / 2)*0.015;
				newDannmaku(from, to, 0, f*PI2, 0.1+j*0.03, 0, {
					color: color,
					frames: frame,
				});
			});
		});
	}, 200, null, count);
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, 5);
}
function newBossDanns5(from, color, direction, count) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = RES.frames.TamaA[('k r m b c g y ow').indexOf(color = color || 'r')];
	var n = 15;
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var k = 1 - j/(n-1),
			f = direction > 0 ? k - 0.2 : 0.2 - k;
		array(count || 3, function(i) {
			var obj = newDannmaku(from, to, 0, f*0.3*PI2+i*0.04-k*0.01, 0.20+(i+0.2)*k*0.15, 0, {
				color: color,
				frames: frame,
			})
			obj.anim(50, function(d) {
				return d.age < 600 ? decrease_object_speed(d, 0.9) : true;
			}, obj.data);
		});
	}, 30, null, n);
	STORY.timeout(function() {
		RES.se_tan00.replay();
	}, 100, null, 5);
}
function newBossDanns6(from, color, count, angular, rad, v0, dr) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = {
		'g': RES.frames.TamaA[10],
		'r': RES.frames.LongA[2],
		'y': RES.frames.LongA[13],
	}[color || 'r'];
	if (!from.is_dying) array(count || 10, function(j) {
		range(0.501, -0.5, 1/((angular || 5) - 1), function(f) {
			newDannmaku(from, to, 0, f*(rad || 0.03)*PI2 + (dr || 0)*j, (v0 || 0.1)+j*0.03, 0, {
				r: 3,
				color: color,
				frames: frame,
			});
		});
	});
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, 5);
}
function newBossDanns7(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!to || !to.data) to = {
		data: { x: UTIL.getGamePosX(0.5), y: UTIL.getGamePosY(0.9), },
	};
	if (!from.is_dying) {
		var px = from.data.x + random(-50, 50),
			py = from.data.y + random(-50, 50),
			dy = (GAME.rect.b - GAME.rect.t),
			dx = dy * (to.data.x - px) / (to.data.y - py);
		var obj = newLaserWithDot(from, px, py, dx, dy, 16, {
			duration: 4500,
			dh: 1/3000,
		});
		obj.anim(100, function() {
			if (this.data.ph > 0.8) {
				RES.se_lazer00.replay();
				return true;
			}
		})
	}
}
function newBossDanns8(from, color, count, delay, dec, dv) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = {
		'g': RES.frames.LongA[10],
		'r': RES.frames.LongA[2],
		'b': RES.frames.LongA[6],
	}[color || 'r'];
	if (!from.is_dying) array(count || 2, function(j) {
		var i = j % 2 ? -1 : 1;
		range(1, 0.001, 1/60, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2, 0.3+0.1*j, 0, {
				r: 3,
				color: color,
				frames: frame,
				sx: from.data.x,
				sy: from.data.y,
				dv: (dv || 0.002) - j*0.00015,
				vr: 0,
				vt: 0,
				vi: i *= -1,
				delay: delay || 1000,
			});
			obj.space = { l:50, r:50, t:50, b:80, };
			obj.anim(80, function(d) {
				if (d.age < d.delay) {
					decrease_object_speed(d, dec || 0.8);
				}
				else {
					var r = sqrt_sum(d.x - d.sx, d.y - d.sy),
						cos = (d.x - d.sx) / r,
						sin = (d.y - d.sy) / r;
					d.vr += d.dv;
					d.vt = d.vt ? d.vt*0.98 : r/d.delay*d.vi*2;
					d.vx = d.vr * cos + d.vt * sin;
					d.vy = d.vr * sin - d.vt * cos;
					if (r < 20)
						return true;
				}
			}, obj.data);
		})
	});
	RES.se_tan02.replay();
}
function newBossDanns9(from, direction, interval) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var n = 30;
	var tick = interval || 30;
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var k = 1 - j/(n-1),
			f = direction > 0 ? k - 0.2 : 0.2 - k;
		var obj = newDannmaku(from, to, 0, f*0.10*PI2, 0.1+k*0.2, 0, {
			color: 'b',
			frames: RES.frames.TamaA[6],
		});
		obj.anim(90, function(d) {
			if (d.age < 2000 + j*tick) {
				decrease_object_speed(d, 0.9);
			}
			else if (d.age < 4000) {
				var e = to && to.data || { x:UTIL.getGamePosX(0.5), y:UTIL.getGamePosY(0.9) };
				d.vx += (e.x - d.x) * 2e-4;
				d.vy += (e.y - d.y) * 2e-4;
			}
			else
				return true;
		}, obj.data);
	}, tick, null, n);
	STORY.timeout(function() {
		RES.se_tan00.replay();
	}, 80, null, 10);
}
function newBossDannsEx0(from) {
	var rt = 0;
	STORY.timeout(function() {
		rt += 0.1;
		var ext = { color:'k', frames:RES.frames.TamaB[0], };
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)+0,    random(0.1, 0.15), 0, extend({}, ext));
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)+PI/2, random(0.1, 0.15), 0, extend({}, ext));
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)-PI/2, random(0.1, 0.15), 0, extend({}, ext));
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)+PI,   random(0.1, 0.15), 0, extend({}, ext));
	}, 100, null, Inf);
}
function newBossDannsEx1(from) {
	var obj = SPRITE.newObj('Enemy', {
		frames: RES.frames.EnemyX,
		life: 10,
		x: randin([GAME.rect.l, GAME.rect.r]),
		y: UTIL.getGamePosY(random(0, 0.7)),
		vy: 0.2,
		vx: 0,
		keep: random(500, 1000),
		story: STORY.state.n,
	});
	obj.anim(300, function(d) {
		if (d.story !== STORY.state.n)
			return this.die() || true;
		if (!d.to || d.to.finished)
			d.to = UTIL.getNearestAlive(from, 'Player');
		if (d.to && !this.is_dying) {
			if (d.age > d.keep || sqrt_sum(d.x - d.to.data.x, d.y - d.to.data.y) < 20) {
				var ext = { color:'y', frames:RES.frames.TamaB[12], };
				newDannmaku(this, d.to, 0, 0,     random(0.05, 0.2), 0, extend({}, ext));
				newDannmaku(this, d.to, 0, PI/2,  random(0.05, 0.2), 0, extend({}, ext));
				newDannmaku(this, d.to, 0, -PI/2, random(0.05, 0.2), 0, extend({}, ext));
				newDannmaku(this, d.to, 0, PI,    random(0.05, 0.2), 0, extend({}, ext));
			}
			redirect_object(d, d.to.data, 0.15, 0.1);
		}
	}, obj.data);
}
function newBossDannsEx2(from, count, num, speed) {
	STORY.timeout(function(x, j) {
		var to = UTIL.getNearestAlive(from, 'Player');
		var i = 0;
		range(0.5001, -0.5, 1/(num || 10), function(f) {
			var ext = i++ % 2 == 0 ?
				{ color:'y', frames:RES.frames.TamaB[12], v:speed || 0.10, }:
				{ color:'r', frames:RES.frames.LongA[2],  v:0.20, dx:randin([35, 25, -25, -35]), redirect:true, };
			var obj = newDannmaku(from, to, 0, f*PI*0.5, ext.v, 0, ext);
			if (ext.redirect) obj.anim(100, function(d) {
				if (d.age < 1000) {
					decrease_object_speed(d, 0.9);
				}
				else if (d.age < 5000) {
					to && redirect_object(d, {
						x: to.data.x + d.dx,
						y: to.data.y,
					}, sqrt_sum(d.vx, d.vy)+0.01, 0.25);
				}
				else {
					return true;
				}
			}, obj.data);
		})
	}, 200, null, count || 25);
}
function newBossDannsEx3(from) {
	function newDmk() {
		var obj = SPRITE.newObj('Dannmaku', {
			r: 20,
			x: UTIL.getGamePosX(random(1)),
			y: GAME.rect.t,
			blend: 'lighter',
			opacity: 0.8,
			story: STORY.state.n,
			frame: randin(RES.frames.TamaMax),
			dir: randin([1, -1]),
		});
		obj.anim(20, function(d) {
			if (d.story !== STORY.state.n)
				return this.die() || true;
			if (!d.to || d.to.finished)
				d.to = UTIL.getNearestAlive(this, 'Player');
			if (d.to) {
				var to = d.to.data,
					dx = d.x - to.x,
					dy = d.y - to.y,
					r = sqrt_sum(dx, dy);
				d.vx -= (1/30 - 1/r)*dx/r*2 + d.dir*dy/r*random(0.06);
				d.vy -= (1/30 - 1/r)*dy/r*2 - d.dir*dx/r*random(0.06);
				decrease_object_speed(d, 0.8);
			}
		}, obj.data);
		return obj;
	}
	if (!from.dmks_ex3)
		from.dmks_ex3 = [0, 0, 0, 0, 0];
	STORY.timeout(function() {
		ieach(from.dmks_ex3, function(i, v) {
			if (!v || v.finished)
				this[i] = newDmk();
		});
	}, 200, null, Inf);
}
function newBossDannsEx4(from) {
	STORY.timeout(function(d, j) {
		if (!from.is_dying)
			newDannsEx2(from, [-0.24, -0.08, 0.08, 0.24][j % 4], [0.3, 0.2][j % 2]);
		else
			return true;
	}, 50, null, 100);
}

function newStage1(difficulty, next) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg1'),
		bganim: newStg1BgAnim,
		title: 'STAGE 1',
		text: RES.st_stg1_title,
	});
	newStgSecsFromList(stage, [
		{ init:newSec1, args:['s0A2', 5], duration:3000, bgm:RES.bgm_stg1a, },
		{ init:newSec1, args:['s0A1', 8], duration:2000, },
		{ init:newSec2, args:[0.4, 10], duration:4000, },
		{ init:newSec3, args:[1000, 5], duration:5000, },
		{ init:newSec3, args:[500, 10], duration:5000, },
		{ init:newSec4, args:[], duration:6000 },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]]], duration:2000 },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]]], duration:4000, next:'bossA' },
		// ...
		{ init:newSec3, args:[1000, 20], duration:16000, name:'secH' },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]]], duration:2000 },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]]], duration:2000 },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]]], duration:7000, next:'diagA' },
		// ...
		{ init:newSec3, args:[500, 30, 3, 10], duration:10000, bgm:RES.bgm_stg1a, name:'secX' },
		{ init:newSecList, args:[
			[newSec3, [500, 300, 3, 10]],
			[newSec1, ['s0A2', 8, [[0, 0]], 1000, 0.2, 0.04, 10]],
			[newSec1, ['s0A1', 8, [[0, 0]], 1000, 0.2, 0.04, 10], 2000],
			[newSec1, ['s0A2', 8, [[-40, 0], [+40, 0]], 1000, 0.2, 0.04, 10], 8000],
			[newSec1, ['s0A1', 8, [[+40, 0], [-40, 0]], 1000, 0.2, 0.04, 10], 10000],
			[newSec1, ['s0A2', 8, [[0, 0]], 1000, 0.2, 0.04, 10], 16000],
			[newSec1, ['s0A1', 8, [[0, 0]], 1000, 0.2, 0.04, 10], 18000],
		], duration:20000, },
		{ init:newSecEx1, args:[0.2], duration:100, },
		{ init:newSecEx1, args:[-0.2], duration:100, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSecEx1, args:[0.2], duration:100, },
		{ init:newSecEx1, args:[-0.2], duration:100, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec4, args:[newDanns2, 10], duration:10000, },
		{ init:newSecEx2, args:[0, 0, 0.1, 0.2], duration:100, },
		{ init:newSecEx2, args:[1, 0, -0.1, 0.2], duration:1000, },
		{ init:newSecEx2, args:[0, 0.3, 0.1, 0.12], duration:100, },
		{ init:newSecEx2, args:[1, 0.3, -0.1, 0.12], duration:1000, },
		{ init:newSecEx2, args:[0, 0.3, 0.1, 0.12], duration:100, },
		{ init:newSecEx2, args:[1, 0.3, -0.1, 0.12], duration:1000, },
		{ duration:5000, },
		{ init:newSec4, args:[newDanns2, 10], duration:10000, },
		{ duration:3000, },
		{ init:killCls, args:['Enemy', 'Dannmaku'], duration:1000, next:'diagD', },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg1_diag1,  pos:'.fl.dg', face:'.f0a', name:'diagA', clear:true, },
		{ text:RES.st_stg1_diag2,  pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag3,  pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag4,  pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag5,  pos:'.fl.dg', face:'.f0b.f2', next:'bossB', },
		{ text:RES.st_stg1_diag6,  pos:'.fr.dg', face:'.f3a.f2', name:'diagB', },
		{ text:RES.st_stg1_diag7,  pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag8,  pos:'.fr.dg', face:'.f3a' },
		{ text:RES.st_stg1_diag9,  pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag10, pos:'.fr.dg', face:'.f3b.f2' },
		{ text:RES.st_stg1_diag11, pos:'.fl.dg', face:'.f0b.f2' },
		{ text:RES.st_stg1_diag12, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag13, pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag14, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag15, pos:'.fl.dg', face:'.f0b.f2', next:'bossC', ended:true, },
		{ text:RES.st_stg1_diag16, pos:'.fl.dg', face:'.f0b.f2', name:'diagC', next:'score', clear:true, ended:true, },
		{ text:RES.st_stg1_diag17, pos:'.fr.dg', face:'.f3a.f2', name:'diagD', clear:true, },
		{ text:RES.st_stg1_diag18, pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag19, pos:'.fr.dg', face:'.f3a' },
		{ text:RES.st_stg1_diag20, pos:'.fl.dg', face:'.f0b.f2' },
		{ text:RES.st_stg1_diag21, pos:'.fr.dg', face:'.f3a.f2' },
		{ text:RES.st_stg1_diag22, pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag23, pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag24, pos:'.fr.dg', face:'.f3a.f2' },
		{ text:RES.st_stg1_diag25, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag26, pos:'.fl.dg', face:'.f0b.f2' },
		{ text:RES.st_stg1_diag27, pos:'.fl.dg', face:'.f0b' },
		{ text:RES.st_stg1_diag28, pos:'.fr.dg', face:'.f3b.f2' },
		{ text:RES.st_stg1_diag29, pos:'.fl.dg', face:'.f0c' },
		{ text:RES.st_stg1_diag30, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag31, pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag32, pos:'.fl.dg', face:'.f0a.f2' },
		{ text:RES.st_stg1_diag33, pos:'.fr.dg', face:'.f3a', next:'bossY', ended:true },
	], newStgSecDiag, 'diag');
	newStgSecsFromList(stage, [
		{
			boss: 'rumia',
			pathnodes: [
				{ fx:0.50, fy:0.00, v:0.2, },
				{ t:1000, fx:0.83, fy:0.28, v:0.2, },
				{ t:1000, fn:newBossDanns1, args:['b'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:1000, fn:newBossDanns2, },
				{ t:1000, fx:0.17, fy:0.28, v:0.2, },
				{ t:1000, fn:newBossDanns1, args:['g'], },
				{ t:1000, fn:newBossDanns1, args:['y'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:2000, fn:newBossDanns3, args:['brgyY'], },
				{ t:1000, fx:0.83, fy:0.28, v:0.2, },
				{ t: 500, fn:newBossDanns1, args:['b'], },
				{ t:2000, fn:newBossDanns1, args:['r'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:1500, fn:newBossDanns2, },
				{ t: 500, fx:0.17, fy:0.28, v:0.2, },
				{ t: 500, fn:newBossDanns1, args:['g'], },
				{ t:2000, fn:newBossDanns1, args:['y'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:2000, fn:newBossDanns3, args:['brgyY'], },
				{ t: 500, fx:0.83, fy:0.28, v:0.2, },
				{ t: 500, fn:newBossDanns1, args:['b'], },
			],
			damage: 300,
			duration: 25000,
			name: 'bossA',
			fail_next: 'boss2',
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ fx:0.5, fy:0.2, },
				{ t:100, fn:newBossDanns0, },
				{ t:4000, fn:newBossDanns0A, },
				{ fx:0.7, fy:0.1, },
				{ t:4000, fn:newBossDanns0A, },
				{ fx:0.3, fy:0.1, },
				{ t:4000, fn:newBossDanns0A, },
				{ fx:0.1, fy:0.2, },
				{ t:4000, fn:newBossDanns0A, },
			],
			duration: 20000,
			scname: RES.st_stg1_sc0,
		},
		{
			pathnodes: [
				{ v:0.3 },
				{ fx:0.5, fy:0.0 },
				{ fy:-1, v:0.3 },
			],
			next: 'secH',
			duration: 500,
			no_countdown: true,
			invinc: true,
		},
		{
			boss: 'rumia',
			pathnodes: [
				{ fx:0.00, fy:0.00, v:0.2 },
				{ fx:0.10, fy:0.10 },
				{ fx:0.50, fy:0.18 },
			],
			duration: 2000,
			invinc: true,
			no_countdown: true,
			no_lifebar: true,
			disable_fire: true,
			name: 'bossB',
			next: 'diagB',
		},
		{
			pathnodes: [
				{ t:2000, v:0.2 },
				{ t:2000, fx:0.50, fy:0.10, v:0.2, fn:newBossDanns4, args:[5], },
				{ t:1000, fx:0.40, fy:0.30, v:0.1, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t:2000, },
				{ t:2500, fx:0.60, fy:0.20, fn:newBossDanns4, args:[5], },
				{ t:1500, fx:0.60, fy:0.30, },
				{ t:1500, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t:1500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, },
				{ t:1500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.30, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t:2000, },
				{ t: 500, fx:0.50, fy:0.30, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t:2000, },
				{ t:2500, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
				{ t: 500, fx:0.20, fy:0.20, },
				{ t:2500, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t:1000, fx:0.40, fy:0.10, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t:1000, },
			],
			duration: 35000,
			name: 'bossC',
			bgm: RES.bgm_stg1b,
		},
		{
			pathnodes: [
				{ t:2000, v:0.1 },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 200, fx:0.30, fy:0.10, v:0.05, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 200, fx:0.40, fy:0.30, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 200, fx:0.60, fy:0.20, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
			],
			duration: 25000,
			scname: RES.st_stg1_sc1,
		},
		{
			pathnodes: [
				{ v:0.05 },
				{ t: 500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, args:['g', 8, 7, 0.1], },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t:1500, fn:newBossDanns7, },
				{ t: 200, fx:0.70, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t:2500, },
				{ t: 500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 15, 0.3, 0.05, 0.1], },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 20, 0.4, 0.08, 0.1], },
				{ t:2500, },
				{ t: 200, fx:0.70, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t:1200, fn:newBossDanns5, args:['g', -1], },
				{ t: 500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 15, 0.3, 0.05, 0.1], },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 20, 0.4, 0.08, 0.1], },
				{ t:2500, },
				{ t: 500, fx:0.60, fy:0.30, },
				{ t:1500, fn:newBossDanns3, args:['ggg'], },
				{ t: 500, fx:0.70, fy:0.20, },
				{ t: 100, fn:newBossDanns6, args:['g', 8, 7, 0.1], },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t: 200, fn:newBossDanns7, },
				{ t:2500, fx:0.60, fy:0.30, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
			],
			duration: 30000,
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ t: NaN, fx:0.50, fy:0.20, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.70, fy:0.30, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.30, fy:0.20, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.50, fy:0.30, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.60, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.50, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.60, fy:0.10, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
			],
			duration: 25000,
			scname: RES.st_stg1_sc2,
			next: 'bossKill',
		},
		{
			pathnodes: [
				{ fx:0.00, fy:0.00, v:0.2 },
				{ fx:0.10, fy:0.10 },
				{ fx:0.50, fy:0.18 },
			],
			duration: 2000,
			invinc: true,
			no_countdown: true,
			no_lifebar: true,
			disable_fire: true,
			name: 'bossX',
			next: 'diagD',
		},
		{
			pathnodes: [
				{ t: 800, v:0.2 },
				{ t: 800, fx:0.50, fy:0.10, v:0.2, fn:newBossDanns4, args:[5], },
				{ t: 800, fx:0.40, fy:0.30, v:0.1, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
				{ t: 800, fx:0.60, fy:0.20, fn:newBossDanns4, args:[5], },
				{ t: 800, fx:0.60, fy:0.30, },
				{ t: 800, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t: 800, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.30, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 800, },
				{ t: 500, fx:0.50, fy:0.30, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
				{ t: 800, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
				{ t: 500, fx:0.20, fy:0.20, },
				{ t: 800, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t: 800, fx:0.40, fy:0.10, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
				{ t: 800, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
				{ t: 500, fx:0.20, fy:0.20, },
				{ t: 800, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t: 800, fx:0.40, fy:0.10, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
			],
			duration: 25000,
			name: 'bossY',
			bgm: RES.bgm_stg1b,
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ t: NaN, fx:0.50, fy:0.20, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.70, fy:0.30, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.30, fy:0.20, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.50, fy:0.30, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.60, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.50, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.60, fy:0.10, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
			],
			duration: 25000,
			scname: RES.st_stg1_sc_ex1,
		},
		{
			pathnodes: [
				{ t:2000, v:0.05 },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 200, fx:0.30, fy:0.10, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 200, fx:0.40, fy:0.30, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 200, fx:0.60, fy:0.20, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
			],
			duration: 25000,
			damage: 200,
		},
		{
			pathnodes: [
				{ t:2000, v:0.05 },
				{ t: 100, fn:newBossDannsEx0, },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 200, fx:0.40, fy:0.30, },
				{ t: 600, fn:newBossDanns4, args:[3, 'o'], },
				{ t: 200, fx:0.30, fy:0.10, },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 200, fx:0.60, fy:0.20, },
				{ t: 600, fn:newBossDanns4, args:[3, 'o'], },
				{ t: 200, fx:0.50, fy:0.20, },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
			],
			duration: 15000,
			scname: RES.st_stg1_sc_ex2,
		},
		{
			pathnodes: [
				{ v: 0.05 },
				{ t: 100, fn:newBossDannsEx2, args:[30, 4, 0.1], },
				{ t: NaN, fx:0.5, fy:0.1, },
				{ t: NaN, fx:0.3, fy:0.2, },
				{ t: NaN, fx:0.7, fy:0.2, },
				{ t: 100, fn:newBossDannsEx2, args:[20, 8, 0.15], },
				{ t: NaN, fx:0.5, fy:0.1, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: 100, fn:newBossDannsEx2, args:[35, 15, 0.2], },
				{ t: NaN, fx:0.7, fy:0.4, },
			],
			duration: 20000,
		},
		{
			pathnodes: [
				{ t:2000, v:0.05 },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 100, fn:newBossDannsEx3, args:[-1], },
				{ t: 100, fx:0.50, fy:0.60, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.20, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.80, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.80, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.20, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.60, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.20, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.80, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.80, },
				{ t: 100, fn:newBossDannsEx4, },
			],
			life: 1000,
			duration: 40000,
			scname: RES.st_stg1_sc_ex3,
			next: 'bossKill2',
		},
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'diagC', },
		{ name:'bossKill2', next:'score', },
	], newStgSecBossKill, 'bossKill');
	stage.askContinue = newStgSecAskContinue('secX');
	stage.score = newStgSecScore('ended');
	stage.ended = next ? newStgSecLoadNew(newStage2, difficulty, next) : newStgSecOver();
	return stage;
}
