function newStg2Sec1(interval, count, color) {
	STORY.timeout(function(d, n) {
		var fx = random(1);
		var obj = SPRITE.newObj('Enemy', {
			life: 3,
			frames: RES.frames.Enemy2A,
			x: UTIL.getGamePosX(fx),
			y: GAME.rect.t,
			vx: random(0.1) * (fx > 0.5 ? -1 : 1),
			vy: random(0.1, 0.15),
			duration: random(5000),
		});
		obj.anim(100, function(d) {
			d.vy -= (d.y - GAME.rect.t) / (GAME.rect.b - GAME.rect.t) * 0.01;
			if (this.is_dying)
				return newStg2Danns1(obj, d.damage >= d.life ? 'r' : (color || 'g')) || true;
		}, obj.data)
	}, interval || 300, null, count || 30);
}
function newStg2Sec2(direction, count) {
	count = count || 16;
	STORY.timeout(function(d, j) {
		var f = j / count;
		var obj = SPRITE.newObj('Enemy', {
			life: 6,
			x: UTIL.getGamePosX(direction > 0 ? 1-f : f),
			y: GAME.rect.t,
			vx: direction > 0 ? 0.03 : -0.03,
			vy: 0.1,
			frames: RES.frames.Enemy00,
		});
		obj.anim(100, function(d) {
			d.vx += random(-0.005, 0.005);
		}, obj.data);
		STORY.timeout(function() {
			obj.anim(1500, function() {
				newStg2Danns2(obj);
			});
		}, random(1500));
	}, 300, null, count);
}
function newStg2Sec3(enm, interval, count) {
	STORY.timeout(function(d, n) {
		var fx = random(1);
		var obj = SPRITE.newObj('Enemy', {
			life: 3,
			frames: enm == 'Enemy2C' ? fill({ rotate:random(PI2) }, randin(RES.frames.Enemy2C)) : RES.frames[enm],
			x: UTIL.getGamePosX(fx),
			y: GAME.rect.t,
			vx: random(0.15) * (fx > 0.5 ? -1 : 1),
			vy: random(0.1, 0.2),
			blend: 'lighter',
		});
	}, interval || 300, null, count || 30);
}
function newStg2SecEx1() {
	STORY.timeout(function(d, j) {
		var obj = SPRITE.newObj('Enemy', {
			life: 10,
			frames: RES.frames.EnemyX,
			x: UTIL.getGamePosX(random(1)),
			y: GAME.rect.t,
			vx: 0,
			vy: 0.2,
			rt: 0,
			color: randin('rgb'),
		});
		obj.anim(100, function(d) {
			d.vy -= 0.01;
			newStg2DannsEx1(this, d.color, Math.sin(d.rt += 0.5) * 0.5, 4000 - d.age);
			return d.age < 3000 ? undefined : true;
		}, obj.data);
		STORY.timeout(function() {
			RES.se_tan00.play();
		}, 3000);
	}, 1000, null, 1000);
}

function newStg2Danns1(from, color) {
	var frames = {
		r: RES.frames.LongA[2],
		g: RES.frames.LongB[9],
		w: RES.frames.LongB[15],
	}[color];
	var rt = random(PI);
	range(1.001, 0, 1/10, function(f) {
		array({
			r: 1,
			g: 2,
			w: 3,
		}[color], function(i) {
			newDannmaku(from, null, 0, f*PI2+rt, 0.07+i*0.03, 0, {
				r: 3,
				color: color,
				frames: frames,
			})
		})
	})
}
function newStg2Danns2(from) {
	var to = UTIL.getNearestAlive(from, 'Player'),
		rt = random(-0.1, 0.1);
	if (!from.is_dying) ieach([-0.1, 0, 0.1], function(i, x) {
		newDannmaku(from, to, 0, rt+x, 0.2, 0, {
			color: 'b',
			tama: 'TamaMini',
		});
	})
}
function newStg2DannsEx1(from, color, rt, freeze) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) {
		var obj = newDannmaku(from, to, 0, rt, 0.2, 0, {
			color: color,
			frames: RES.frames.TamaB[{ r:2, g:10, b:6, }[color]],
		});
		obj.anim(100, function(d) {
			if (d.age < freeze)
				decrease_object_speed(d, 0.96);
			else if (d.age < freeze + 4000) {
				if (d.color != 'w' && (d.color = 'w')) {
					UTIL.addFrameAnim(this, RES.frames.TamaB[15]);
					d.vx = d.vy = 0;
				}
			}
			else if (d.age < freeze + 5000)
				redirect_object(d, to ? to.data : {
					x: UTIL.getGamePosX(0.5),
					y: GAME.rect.b,
				}, 0.15, 0.2);
			else
				return true;
		}, obj.data);
	}
}

function daiyouseiMove(from, fx, fy, t) {
	from.data.ds = -1/500;
	STORY.timeout(function() {
		from.data.ds = 1/500;
		from.data.x = UTIL.getGamePosX(fx);
		from.data.y = UTIL.getGamePosX(fy);
	}, t || 800);
}
function daiyouseiFire1(from, color, direction) {
	var count = 48;
	var frames = {
		g: RES.frames.LongB[9],
		r: RES.frames.LongB[2],
	}[color];
	var to = UTIL.getOneAlive('Player');
	if (to) to = { data: { x:to.data.x, y:to.data.y, }, };
	var r0 = direction > 0 ? 1 : 0,
		dr = direction > 0 ? -1/count : 1/count;
	STORY.timeout(function(d, j) {
		r0 += dr;
		if (!from.is_dying) ieach([0, 0.5, 1, 1.5], function(i, rt) {
			array(2, function(k) {
				var obj = newDannmaku(from, to, 0, (rt+r0*2)*PI, 0.2 + k*0.03, 0, {
					r: 3,
					color: color,
					frames: frames,
				});
				obj.anim(100, function(d) {
					return d.age < 1000 ? decrease_object_speed(d, 0.95) : true;
				}, obj.data);
			})
		});
	}, 10, null, count);
	RES.se_power1.play();
}
function daiyouseiFire2(from) {
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, j) {
		if (!from.is_dying) range(0.5001, -0.5, 1/8, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI*0.5, 0.2, 0, j % 2 ? {
				r: 3,
				color: 'w',
				frames: RES.frames.LongC[15],
			} : {
				r: 3,
				color: 'b',
				frames: RES.frames.LongC[5],
			})
			if (j % 2) obj.anim(100, function(d) {
				if (d.age < 1000)
					decrease_object_speed(d, 0.9);
				else if (d.age < 1500 && to)
					redirect_object(d, to.data, 0.2);
			}, obj.data);
		})
		RES.se_tan01.play();
	}, 100, null, 30);
}

function chirunoFire1(from, count) {
	count = count || 7;
	var to = UTIL.getOneAlive('Player');
	if (to) to = { data: { x:to.data.x, y:to.data.y, }, };
	STORY.timeout(function(d, j) {
		var n = count - j;
		range(0.5001, -0.5, 1/n, function(f) {
			newDannmaku(from, to, 0, f*n*0.1, 0.22+j*0.01, 0, {
				r: 3,
				color: 'b',
				frames: RES.frames.LongC[6],
			})
		})
	}, 50, null, count);
	RES.se_tan01.play();
}
function chirunoFire2(from, interval, count, layers, speed, rand, type) {
	count = count || 40;
	type = type || 'b';
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, j) {
		var dr = rand ? random(rand) : 0;
		range(1, 0, 1/count, function(f) {
			newDannmaku(from, to, 0, f*PI2+dr, (speed || 0.15)+j*0.02, 0, {
				r: {
					b: 5,
					a: 5,
					s: 3,
				}[type],
				color: 'b',
				frames: {
					b: RES.frames.TamaB[6],
					a: RES.frames.TamaA[6],
					s: RES.frames.TamaMini[7],
				}[type],
			})
		})
	}, interval || 50, null, layers || 2);
	RES.se_tan01.play();
}
function chirunoFire3(from) {
	var to = UTIL.getOneAlive('Player');
	if (!from.is_dying) range(1, 0, 1/40, function(f) {
		var obj = newDannmaku(from, to, 0, f*PI2, 0.2, 0, {
			r: 3,
			color: 'w',
			frames: RES.frames.LongC[15],
		})
		obj.anim(100, function(d) {
			if (d.age < 1200)
				decrease_object_speed(d, 0.95);
			else
				return to && redirect_object(d, to.data, 0.2) || true;
		}, obj.data);
	});
	RES.se_tan01.play();
}
function chirunoFireSc1(from) {
	var to = UTIL.getOneAlive('Player');
	var dr = random(0.1),
		dv = random(0.2, 0.3),
		dx = random(-1, 1),
		dy = random(1);
	STORY.timeout(function(d, j) {
		from.is_firing = true;
		if (!from.is_dying) range(1, 0, 1/18, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2+dr, dv+j*0.1, 0, {
				r: 3,
				color: 'b',
				frames: RES.frames.LongC[6],
			})
			obj.anim(100, function(d) {
				if (d.age < 1200)
					decrease_object_speed(d, 0.85);
				else
					return redirect_object(d, { x:d.x+dx+f-0.5, y:d.y+dy }, 0.08) || true;
			}, obj.data);
		});
		RES.se_tan02.play();
	}, 100, null, 3);
}
function chirunoFireSc1A(from) {
	STORY.timeout(function() {
		chirunoFireSc1(from);
	}, 300, null, 8);
}
function chirunoFire4(from, count, speed, layers) {
	STORY.timeout(function() {
		chirunoFire2(from, 50, 30, layers || 2, speed || 0.15, 0.1, 'a');
	}, 500, null, count || 20);
}
function chirunoFire5(from, rads, speed) {
	STORY.timeout(function() {
		chirunoFire2(from, 50, rads || 8, 1, speed || 0.1, 0.1, 's');
	}, 200, null, 5);
}
function chirunoFire6(from, rads) {
	var to = UTIL.getOneAlive('Player') || {
		data: UTIL.getGamePosXY(0.5, 0.9)
	};
	var dx = to.data.x - from.data.x,
		dy = to.data.y - from.data.y,
		r0 = Math.atan2(dy, dx);
	range(0.501, -0.5, 1/(rads || 2), function(f) {
		var rt = r0 + f * 0.2 * PI,
			cos = Math.cos(rt),
			sin = Math.sin(rt),
			sx = from.data.x,
			sy = from.data.y,
			v = 0.2;
		var obj = newLaser(from, sx, sy, 0, 0, 4, {
			sx: sx,
			sy: sy,
			vx: v * cos,
			vy: v * sin,
			frame: RES.frames.LaserLong[15],
		});
		obj.anim(30, function(d) {
			var dx = d.sx - d.x,
				dy = d.sy - d.y;
			if (sqrt_sum(dx, dy) < 200) {
				d.dx = dx;
				d.dy = dy;
			}
			else
				return true;
		}, obj.data);
	})
}
function chirunoFireSc2(from, interval, count, speed) {
	STORY.timeout(function(d, j) {
		from.is_firing = true;
		var color = randin('rgbo'),
			frames = RES.frames.TamaA[('k r m b c g y ow').indexOf(color)];
		range(1, 0, 1/10, function(f) {
			var obj = newDannmaku(from, null, 0, random(PI2), random(0.1, speed || 0.2), 0, {
				color: color,
				frames: frames,
				freeze: 800 + j*60,
			})
			obj.anim(100, function(d) {
				if (d.age > d.freeze && !this.is_freezed && (this.is_freezed = true)) {
					d.vx = d.vy = 0;
					var rt = random(PI2);
					d.dvx = Math.cos(rt) * 0.01;
					d.dvy = Math.sin(rt) * 0.01;
					d.color = 'w';
					UTIL.addFrameAnim(obj, RES.frames.TamaA[15]);
				}
				if (d.age > d.freeze + 4000) {
					d.vx += d.dvx;
					d.vy += d.dvy;
				}
			}, obj.data);
		})
		if (j % 2 == 0) RES.se_tan02.replay();
	}, interval || 60, null, count || 50);
}
function chirunoFireSc2A(from, rads) {
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, j) {
		range(0.5001, -0.5, 1/(rads || 2), function(f) {
			array(2, function(i) {
				newDannmaku(from, to, 0, f*PI*0.2+random(0.1), 0.15+i*0.05, 0, {
					color: 'b',
					frames: RES.frames.TamaB[6],
				})
			})
		})
		if (j % 2 == 0) RES.se_tan02.replay();
	}, 80, null, 20);
}
function chirunoFireSc3(from, freq) {
	STORY.timeout(function(d, j) {
		from.is_firing = true;
		var pos = {};
		pos.data = {
			x: from.data.x + random(-100, 100),
			y: from.data.y + random(-100, 100),
		}
		var to = j % freq == 0 ? UTIL.getOneAlive('Player') : null;
		array(15, function(i) {
			var obj = newDannmaku(pos, null, 0, random(PI2), random(0.1, 0.4), 0, {
				r: 3,
				to: to,
				color: to ? 'r' : 'b',
				frames: RES.frames.LongC[to ? 2 : 6],
			})
			obj.anim(100, function(d) {
				if (d.age < 1000)
					decrease_object_speed(d, 0.85);
				else if (d.to)
					redirect_object(d, d.to.data, sqrt_sum(d.vx, d.vy)+0.005, 0.06);
				else
					return true;
			}, obj.data)
		})
		if (j % 2 == 0) RES.se_tan02.replay();
	}, 100, null, 1000);
}
function chirunoFireEx1(from, dr, dist, xr) {
	var to = UTIL.getOneAlive('Player') || {
		data: UTIL.getGamePosXY(0.5, 0.9)
	};
	var r0 = Math.atan2(to.data.y - from.data.y, to.data.x - from.data.x),
		rt = r0 + (dr || 0),
		cos = Math.cos(rt),
		sin = Math.sin(rt),
		sx = from.data.x - (dist || 150) * Math.cos(r0 + (xr || 0)),
		sy = from.data.y - (dist || 150) * Math.sin(r0 + (xr || 0));
	var obj = newLaser(from, sx, sy, 0, 0, 20, {
		sx: sx,
		sy: sy,
		vx: 0.5 * cos,
		vy: 0.5 * sin,
	});
	obj.space = { l:300, r:300, t:300, b:300, };
	obj.anim(30, function(d) {
			var dx = d.sx - d.x,
				dy = d.sy - d.y;
			if (sqrt_sum(dx, dy) < 600) {
				d.dx = dx;
				d.dy = dy;
			}
			else if (d.age < 3000) {
				d.vx = d.vy = 0;
			}
			else if (d.age < 4000) {
				if (!d.is_firing && (d.is_firing = true))
					chirunoFireEx2(from, d.sx, d.sy, d.x, d.y);
			}
			else {
				this.die();
				return true;
			}
	}, obj.data);
}
function chirunoFireEx1A(from, dr, dist, xr) {
	chirunoFireEx1(from,  dr, dist,  xr);
	chirunoFireEx1(from, -dr, dist, -xr);
}
function chirunoFireEx2(from, sx, sy, tx, ty) {
	var count = 30;
	STORY.timeout(function(d, j) {
		var f = j / count,
			x = interp(tx, sx, f),
			y = interp(ty, sy, f);
		ieach([0.6, -1, -0.6], function(i, rt) {
			newDannmaku({
				data: { x:x, y:y, },
			}, {
				data: UTIL.getGamePosXY(0.5, 1),
			}, 0, rt*PI, 0.2, 0, {
				r: 3,
				color: 'b',
				frames: RES.frames.LongC[6],
			});
		})
	}, 30, null, count);
	RES.se_tan00.play();
}
function chirunoFireEx3(from) {
	STORY.timeout(function() {
		var fd = 0.15,
			fx = random(0.3, 0.7);
		newLaser(from, GAME.rect.l, GAME.rect.t-20,  UTIL.getGamePosY(fx-fd),     0, 30, { vy: 0.15, })
		newLaser(from, GAME.rect.r, GAME.rect.t-20, -UTIL.getGamePosY(1-(fx+fd)), 0, 30, { vy: 0.15, })
	}, 1000, null, 1000);
	STORY.timeout(function(d, j) {
		var x = j % 2,
			f = (j % 6 + 1) / 6;
		newDannmaku({
			data: UTIL.getGamePosXY(x ? 1 : 0, f),
		}, {
			data: UTIL.getGamePosXY(x ? 0 : 1, ease_out(f)),
		}, 0, random(-0.2, 0.2), 0.15, 0, {
			color: 'w',
			frames: RES.frames.TamaB[15],
		});
	}, 50, null, 5000);
}

function newStage2(difficulty, next) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg2'),
		title: 'STAGE 2',
		text: RES.st_stg2_title,
	});
	newStgSecsFromList(stage, [
		{ init:newStg2Sec1, args:[150, 70], duration:12000, bgm:RES.bgm_stg2a, },
		{ init:newSecList, args:[
			[newStg2Sec1, [500, 12]],
			[newStg2Sec2, [ 1]],
		], duration:6000 },
		{ init:newSecList, args:[
			[newStg2Sec1, [500, 12]],
			[newStg2Sec2, [-1]],
		], duration:6000 },
		{ init:newSecList, args:[
			[newStg2Sec1, [500, 12]],
			[newStg2Sec2, [ 1]],
		], duration:6000 },
		{ init:newSecList, args:[
			[newStg2Sec1, [500, 12]],
			[newStg2Sec2, [-1]],
		], duration:8000, next:'bossA', },
		{ init:newStg2Sec3, args:['Enemy2B', 100, 80], duration:8000, name:'secH', },
		{ init:newStg2Sec3, args:['Enemy2C', 100, 30], duration:3000, },
		{ init:newSecList, args:[
			[newStg2Sec3, ['Enemy2C', 500, 20]],
			[newSec3, [500, 20, 5]],
		], duration:7000, },
		{ init:newStg2Sec3, args:['Enemy2C', 100, 30], duration:3000, },
		{ init:newSecList, args:[
			[newStg2Sec3, ['Enemy2C', 500, 20]],
			[newSec3, [500, 20, 5]],
		], duration:10000, },
		{ duration:2000, next: 'diagA', },
		{ init:newStg2Sec1, args:[120, 100, 'w'], duration:12000, name:'secX', bgm:RES.bgm_stg2a, },
		{ init:newSecList, args:[
			[newStg2Sec1, [300, 20, 'w']],
			[newStg2Sec2, [ 1]],
			[newStg2Sec2, [-1]],
		], duration:8000 },
		{ init:newStg2SecEx1, duration:12000, },
		{ duration:6000, },
		{ init:newSecList, args:[
			[newStg2Sec3, ['Enemy2C', 500, 20]],
			[newStg2Sec2, [ 1]],
			[newStg2Sec2, [-1]],
		], duration:8000, next:'diagD' },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg2_diag1,  pos:'.fl.dg', face:'.f0c.f2', name:'diagA', clear:true, },
		{ text:RES.st_stg2_diag2,  pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg2_diag3,  pos:'.fl.dg', face:'.f0c.f2', next:'bossB', },
		{ text:RES.st_stg2_diag4,  pos:'.fr.dg', face:'.f5a', name:'diagB', },
		{ text:RES.st_stg2_diag5,  pos:'.fl.dg', face:'.f0b', },
		{ text:RES.st_stg2_diag6,  pos:'.fr.dg', face:'.f5a.f2', },
		{ text:RES.st_stg2_diag7,  pos:'.fl.dg', face:'.f0b.f2', },
		{ text:RES.st_stg2_diag8,  pos:'.fr.dg', face:'.f5a.f2', },
		{ text:RES.st_stg2_diag9,  pos:'.fr.dg', face:'.f5a.f2', next:'bossC', ended:true, },
		{ text:RES.st_stg2_diag10, pos:'.fl.dg', face:'.f0b.f2', name:'diagC', next:'score', clear:true, ended:true, },
		{ text:RES.st_stg2_diag11, pos:'.fl.dg', face:'.f0b.f2', name:'diagD', next:'bossX', clear:true, },
		{ text:RES.st_stg2_diag12, pos:'.fr.dg', face:'.f5a.f2', name:'diagX', },
		{ text:RES.st_stg2_diag13, pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg2_diag14, pos:'.fr.dg', face:'.f5a', },
		{ text:RES.st_stg2_diag15, pos:'.fr.dg', face:'.f5a.f2', },
		{ text:RES.st_stg2_diag16, pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg2_diag17, pos:'.fl.dg', face:'.f0a', },
		{ text:RES.st_stg2_diag18, pos:'.fr.dg', face:'.f5a', },
		{ text:RES.st_stg2_diag19, pos:'.fr.dg', face:'.f5a.f2', },
		{ text:RES.st_stg2_diag20, pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg2_diag21, pos:'.fl.dg', face:'.f0a', },
		{ text:RES.st_stg2_diag22, pos:'.fr.dg', face:'.f5a.f2', },
		{ text:RES.st_stg2_diag23, pos:'.fl.dg', face:'.f0b', },
		{ text:RES.st_stg2_diag24, pos:'.fl.dg', face:'.f0a.f2', next:'bossY', ended:true, },
	], newStgSecDiag, 'diag');
	newStgSecsFromList(stage, [
		{
			name: 'bossA',
			boss: 'daiyousei',
			pathnodes: [
				{ v:0.1, },
				{ t:NaN, fx:0.5, fy:0.3, }
			],
			duration: 2000,
			no_countdown: true,
			no_lifebar: true,
			invinc: true,
		},
		{
			pathnodes: [
				{ },
				{ t:3000, fn:daiyouseiFire1, args:['r', 1], },
				{ t:2000, fn:daiyouseiMove,  args:[0.7, 0.3]},
				{ t:3000, fn:daiyouseiFire1, args:['g', -1], },
				{ t:2000, fn:daiyouseiMove,  args:[0.5, 0.3]},
				{ t:4000, fn:daiyouseiFire2, },
				{ t:2000, fn:daiyouseiMove,  args:[0.3, 0.3]},
				{ t:3000, fn:daiyouseiFire1, args:['r', 1], },
				{ t:2000, fn:daiyouseiMove,  args:[0.5, 0.3]},
				{ t:3000, fn:daiyouseiFire1, args:['g', -1], },
				{ t:2000, fn:daiyouseiMove,  args:[0.7, 0.3]},
				{ t:4000, fn:daiyouseiFire2, },
			],
			bomb_pt: 1,
			duration: 30000,
		},
		{
			pathnodes: [
				{ v:0.3 },
				{ fx:0.5, fy:0.0 },
				{ fy:-1 },
			],
			next: 'secH',
			duration: 500,
			invinc: true,
		},
		{
			boss: 'chiruno',
			pathnodes: [
				{ fx:0.5, fy:0.2 },
			],
			duration: 1000,
			invinc: true,
			no_countdown: true,
			no_lifebar: true,
			disable_fire: true,
			name: 'bossB',
			next: 'diagB',
		},
		{
			pathnodes: [
				{ },
				{ t:1000 },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fx:0.8, fy:0.2, v:0.1, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 100, fx:0.5, fy:0.2, v:0.05, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: NaN, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: NaN, fx:0.2, fy:0.2, v:0.1, },
				{ t: 100, fx:0.5, fy:0.2, v:0.05, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: NaN, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: 100, fn:chirunoFire1, },
				{ t: 800, fn:chirunoFire2, },
				{ t: NaN, fx:0.8, fy:0.2, v:0.1, },
				{ t: 100, fx:0.5, fy:0.2, v:0.05, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
				{ t: 400, fn:chirunoFire3, },
				{ t: 400, fn:chirunoFire2, },
			],
			duration: 25000,
			name: 'bossC',
			bgm: RES.bgm_stg2b,
		},
		{
			pathnodes: [
				{ v:0.05 },
				{ t:NaN, fx:0.5, fy:0.2, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.6, fy:0.1, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.4, fy:0.2, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.5, fy:0.3, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.6, fy:0.2, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.7, fy:0.3, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.5, fy:0.3, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
				{ t:200, fx:0.6, fy:0.2, },
				{ t:300, fn:chirunoFireSc1A, },
				{ t:3000, },
			],
			duration: 35000,
			scname: RES.st_stg2_sc1,
		},
		{
			pathnodes: [
				{ v:0.06 },
				{ t: 100, fx:0.5, fy:0.2, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
				{ t: 100, fx:0.4, fy:0.3, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
				{ t: 100, fx:0.3, fy:0.1, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
				{ fx:0.5, fy:0.1, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
				{ fx:0.4, fy:0.3, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
				{ fx:0.5, fy:0.2, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
				{ fx:0.6, fy:0.1, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2], },
				{ t: 100, fn:chirunoFire5, },
				{ t: 100, fn:chirunoFire4, args:[6, 0.1], },
				{ t: 800, fn:chirunoFire6, },
				{ t: 800, fn:chirunoFire6, },
				{ t:1000, fn:chirunoFire6, },
			],
			duration: 50000,
		},
		{
			pathnodes: [
				{ v:0.05, },
				{ fx:0.5, fy:0.2, },
				{ t: 100, fx:0.3, fy:0.1, },
				{ t:4000, fn:chirunoFireSc2, },
				{ t: 500, fx:0.5, fy:0.2, },
				{ t:6000, fn:chirunoFireSc2A, },
				{ t: 100, fx:0.5, fy:0.1, },
				{ t:4000, fn:chirunoFireSc2, },
				{ t: 500, fx:0.6, fy:0.3, },
				{ t:6000, fn:chirunoFireSc2A, },
				{ t: 100, fx:0.5, fy:0.1, },
				{ t:4000, fn:chirunoFireSc2, },
				{ t: 500, fx:0.3, fy:0.1, },
				{ t:6000, fn:chirunoFireSc2A, },
				{ t: 100, fx:0.5, fy:0.1, },
				{ t:4000, fn:chirunoFireSc2, },
			],
			duration: 40000,
			scname: RES.st_stg2_sc2,
		},
		{
			pathnodes: [
				{ v:0.05, },
				{ t: NaN, fx:0.5, fy:0.2, },
				{ t: 500, fn:chirunoFireSc3, },
				{ t: NaN, fx:0.3, fy:0.1, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: NaN, fx:0.8, fy:0.3, },
				{ t: NaN, fx:0.7, fy:0.2, },
				{ t: NaN, fx:0.6, fy:0.3, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: NaN, fx:0.5, fy:0.2, },
				{ t: NaN, fx:0.3, fy:0.1, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: NaN, fx:0.8, fy:0.3, },
				{ t: NaN, fx:0.7, fy:0.2, },
				{ t: NaN, fx:0.6, fy:0.3, },
			],
			duration: 40000,
			scname: RES.st_stg2_sc3,
			next: 'bossKill',
		},
		{
			boss: 'chiruno',
			pathnodes: [
				{ fx:0.5, fy:0.2 },
			],
			duration: 1000,
			invinc: true,
			no_countdown: true,
			no_lifebar: true,
			disable_fire: true,
			name: 'bossX',
			next: 'diagX',
		},
		{
			pathnodes: [
				{ v:0.06 },
				{ t: 100, fx:0.5, fy:0.2, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
				{ t: 100, fx:0.4, fy:0.3, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
				{ t: 100, fx:0.3, fy:0.1, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
				{ fx:0.5, fy:0.1, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
				{ fx:0.4, fy:0.3, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
				{ fx:0.5, fy:0.2, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
				{ fx:0.6, fy:0.1, },
				{ t:3000, fn:chirunoFire4, args:[6, 0.2, 4], },
				{ t: 100, fn:chirunoFire5, args:[20, 0.2], },
				{ t: 100, fn:chirunoFire4, args:[8, 0.1, 4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t: 800, fn:chirunoFire6, args:[4], },
				{ t:1000, fn:chirunoFire6, args:[4], },
			],
			duration: 40000,
			name: 'bossY',
			bgm: RES.bgm_stg2b,
		},
		{
			pathnodes: [
				{ v:0.05, },
				{ fx:0.5, fy:0.2, },
				{ t: 100, fx:0.3, fy:0.1, },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t: 500, fx:0.5, fy:0.2, },
				{ t:5000, fn:chirunoFireSc2A, args:[3], },
				{ t: 100, fx:0.5, fy:0.1, },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t: 500, fx:0.6, fy:0.3, },
				{ t:5000, fn:chirunoFireSc2A, args:[3], },
				{ t: 100, fx:0.5, fy:0.1, },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t: 500, fx:0.3, fy:0.1, },
				{ t:5000, fn:chirunoFireSc2A, args:[3], },
				{ t: 100, fx:0.5, fy:0.1, },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
				{ t:1000, fn:chirunoFireSc2, args:[150, 30, 0.3], },
			],
			duration: 40000,
			scname: RES.st_stg2_sc_ex1,
		},
		{
			pathnodes: [
				{ v:0.05, },
				{ t: NaN, fx:0.5, fy:0.2, },
				{ t: 500, fn:chirunoFireSc3, args:[4], },
				{ t: NaN, fx:0.3, fy:0.1, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: NaN, fx:0.8, fy:0.3, },
				{ t: NaN, fx:0.7, fy:0.2, },
				{ t: NaN, fx:0.6, fy:0.3, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: NaN, fx:0.5, fy:0.2, },
				{ t: NaN, fx:0.3, fy:0.1, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: NaN, fx:0.8, fy:0.3, },
				{ t: NaN, fx:0.7, fy:0.2, },
				{ t: NaN, fx:0.6, fy:0.3, },
			],
			duration: 30000,
		},
		{
			pathnodes: [
				{ v:0.1, },
				{ fx:0.5, fy:0.2, },
				{ t:1000, fn:chirunoFireEx1A, args:[0.38, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.60, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.05, 150, 0], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.20, 150, 0], },
				{ t:1000, fn:chirunoFire2, args:[50, 30, 5, 0.15, 0.5], },
				{ t:2000, },
				{ fx:0.3, fy:0.2, },
				{ t:1000, fn:chirunoFireEx1A, args:[0.38, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.60, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.05, 150, 0], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.20, 150, 0], },
				{ t:1000, fn:chirunoFire2, args:[50, 30, 5, 0.15, 0.5], },
				{ t:2000, },
				{ fx:0.5, fy:0.2, },
				{ t:1000, fn:chirunoFireEx1A, args:[0.38, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.60, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.05, 150, 0], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.20, 150, 0], },
				{ t:1000, fn:chirunoFire2, args:[50, 30, 5, 0.15, 0.5], },
				{ t:2000, },
				{ fx:0.7, fy:0.2, },
				{ t:1000, fn:chirunoFireEx1A, args:[0.38, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.60, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.05, 150, 0], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.20, 150, 0], },
				{ t:1000, fn:chirunoFire2, args:[50, 30, 5, 0.15, 0.5], },
				{ t:2000, },
				{ fx:0.7, fy:0.2, },
				{ t:1000, fn:chirunoFireEx1A, args:[0.38, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.60, 200, 1], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.05, 150, 0], },
				{ t:1000, fn:chirunoFireEx1A, args:[0.20, 150, 0], },
				{ t:1000, fn:chirunoFire2, args:[50, 30, 5, 0.15, 0.5], },
			],
			duration: 40000,
			scname: RES.st_stg2_sc_ex2,
		},
		{
			pathnodes: [
				{ v:0.1, },
				{ fx:0.5, fy:0.2, },
				{ t:1000, fn:chirunoFireEx3, },
				{ t:2000, fx:0.3, fy:0.1, },
				{ t:2000, fx:0.4, fy:0.3, },
				{ t:2000, fx:0.8, fy:0.3, },
				{ t:2000, fx:0.7, fy:0.2, },
				{ t:2000, fx:0.6, fy:0.3, },
				{ t:2000, fx:0.4, fy:0.3, },
				{ t:2000, fx:0.5, fy:0.2, },
				{ t:2000, fx:0.3, fy:0.1, },
				{ t:2000, fx:0.4, fy:0.3, },
				{ t:2000, fx:0.8, fy:0.3, },
				{ t:2000, fx:0.7, fy:0.2, },
				{ t:2000, fx:0.6, fy:0.3, },
			],
			duration: 40000,
			scname: RES.st_stg2_sc_ex3,
			next: 'bossKill2',
		},
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'diagC', },
		{ name:'bossKill2', next:'score', },
	], newStgSecBossKill, 'bossKill');
	stage.askContinue = newStgSecAskContinue('secX');
	stage.score = newStgSecScore('ended');
	stage.ended = next ? newStgSecLoadNew(newStage3, difficulty, next) : newStgSecOver();
	return stage;
}
