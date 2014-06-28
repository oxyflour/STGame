function newStg3BgAnim(bg) {
	var e = $e('bg_stg3'),
		gnd = $e('stg3cv'),
		mask = $e('bg_stg3_mask');
	e.width = parseFloat($style(e, 'width'));
	e.height = parseFloat($style(e, 'height'));
	e.val = {
		persp: 600,
		rotate: [50, 30],
	}
	e.val2 = {
		persp: 600,
		rotate: [30, 60],
	}
	updateBgImg(e, 0);
	bg.anim(50, function(d) {
		var age = d.age,
			begin  =  50000, end  =  70000,
			begin2 = 130000, end2 = 140000;
		if (age < begin) {
		}
		else if (age <= end) {
			var f = ease_in_out((age - begin) / (end - begin));
			updateBgImg(e, f);
			mask.style.opacity = 1 - f;
		}
		else if (age < begin2) {
		}
		else if (age <= end2) {
			if (gnd.speedY > 0)
				gnd.speedY = decrease_to_zero(gnd.speedY, 0.1/1000*50);
			if (e.val !== e.val2)
				e.val = e.val2;
			var f = ease_in_out((age - begin2) / (end2 - begin2));
			updateBgImg(e, f);
			mask.style.opacity = f;
		}
	}, bg.data);

	var cv = $e('bg_stg3_dot'),
		dc = cv.getContext('2d');
	cv.width = parseFloat($style(cv, 'width'));
	cv.height = parseFloat($style(cv, 'height'));
	bg.anim(50, function(d) {
		dc.clearRect(0, 0, cv.width, cv.height);
		ieach(gnd.towers, function(i, v) {
			var py = v.py + gnd.offsetY - e.oriy,
				t = e.rotate/180*PI + Math.atan2(v.pz, py),
				r = sqrt_sum(v.pz, py),
				sin = Math.sin(t) * r,
				cos = Math.cos(t) * r,
				x = e.width / 2 - v.px,
				y = cos,
				z = e.persp - sin;
			v.x = e.width/2 - x / z * e.persp;
			v.y = e.oriy + y / z * e.persp;
			if (v.x > GAME.rect.l - v.r &&
				v.x < GAME.rect.r + v.r &&
				v.y > GAME.rect.t - v.r &&
				v.y < GAME.rect.b + v.r) {
				var f = RES.stg3_gnd_dot,
					r = v.r * 500/Math.sqrt(x*x + y*y + z*z);
				dc.drawImage(f, 0, 0, f.width, f.height, v.x-r, v.y-r, r*2, r*2);
			}
		})
	}, bg.data)

	bg.anim(1000, function(d) {
		if (random(1) > 0.5) {
			var obj = SPRITE.newObj('Circle', {
				r: 80,
				x: random(GAME.rect.l, GAME.rect.r),
				y: GAME.rect.t,
				vx: 0,
				vy: random(0.05, 0.12),
				frames: randin([RES.frames.Cloud1, RES.frames.Cloud2]),
			})
			obj.drawFrame = function(dc, d) {
				var f = d.frame,
					w = f.w * d.scale,
					h = f.h * d.scale;
				dc.drawImage(RES[f.res],
					f.sx, f.sy, f.sw, f.sh,
					d.x-w/2, d.y-h/2, w, h);
			}
			obj.anim(50, function(d) {
				d.scale += 0.015;
			}, obj.data)
		}
		if (d.age > 50000)
			return true;
	}, bg.data)
}

function stg3Sec1(pth, count, offset, speed, rand, life) {
	STORY.timeout(function (d, n) {
		ieach(offset || [[0, 0]], function(i, v) {
			var obj = SPRITE.newObj('Enemy', {
				life: life || 1,
				frames: RES.frames.Enemy2A,
				pathnodes: UTIL.pathOffset(RES.path[pth], v[0], v[1]),
			});
			STORY.timeout(function() {
				stg3Danns1(obj, speed, rand);
			}, random(3000));
		});
	}, 250, null, count);
}
function stg3Sec2(range, interval, danns) {
	STORY.timeout(function (d, n) {
		var x = range.pop();
		ieach([1, -1], function(i, k) {
			var obj = SPRITE.newObj('Enemy', {
				x: UTIL.getGamePosX(0.5 + k*x),
				y: GAME.rect.t,
				vx: 0,
				vy: 0.1,
				frames: RES.frames.Enemy3A,
			})
			obj.anim(50, function(d) {
				if (d.age < 500)
					;
				else if (d.age < 2000) {
					decrease_object_speed(d, 0.9);
					if (d.age > 1000 && !d.is_firing && (d.is_firing = true))
						(danns || stg3Danns2)(this);
				}
				else {
					d.vx = random(-0.1, 0.1);
					d.vy = random(0.05, 0.15);
					return true;
				}
			}, obj.data)
		})
	}, interval || 1000, null, range.length)
}
function stg3Sec3(interval, count) {
	STORY.timeout(function (d, n) {
		var obj = SPRITE.newObj('Enemy', {
			x: UTIL.getGamePosX(random(1)),
			y: GAME.rect.t,
			vx: 0,
			vy: 0.1,
			frames: RES.frames.Enemy3B,
		})
		obj.anim(50, function(d) {
			if (d.age < 500)
				;
			else if (d.age < 2000) {
				decrease_object_speed(d, 0.9);
				if (d.age > 1000 && !d.is_firing && (d.is_firing = true))
					stg3Danns3(this);
			}
			else {
				d.vy -= 0.01;
			}
		}, obj.data)
	}, interval || 1000, null, count || 99)
}
function stg3Sec4(pth, count, offset, interval, speed, rand, life) {
	STORY.timeout(function (d, n) {
		ieach(offset || [[0, 0]], function(i, v) {
			var obj = SPRITE.newObj('Enemy', {
				life: life || 1,
				frames: RES.frames.Enemy00,
				pathnodes: UTIL.pathOffset(RES.path[pth], v[0], v[1]),
			});
			STORY.timeout(function() {
				obj.anim(interval || 1500, function() {
					stg3Danns4(obj, speed, rand);
				});
			}, random(1500));
		});
	}, 250, null, count);
}

function stg3Danns1(from, speed, rand) {
	var to = UTIL.getOneAlive('Player');
	array(2, function(j) {
		var f0 = random(PI2);
		range(1, 0, 1/10, function(f) {
			newDannmaku(from, null, 10*j, f*PI2+f0+random(0.1), 0.1+0.02*j, 0, {
				r: 3,
				color: 'b',
				frames: RES.frames.LongB[6],
			})
		})
	})
}
function stg3Danns2A(from, to, rads) {
	to = to && { data:{ x:to.data.x, y:to.data.y, } };
	STORY.timeout(function(d, n) {
		range(0.5001, -0.5, 1/(rads || 4), function(f) {
			newDannmaku(from, to, 0, f, 0.3-n*0.015, 0, {
				r: 3,
				color: 'b',
				frames: RES.frames.LongB[6],
			})
		})
	}, 50, null, 15)
}
function stg3Danns2(from) {
	var f0 = random(PI2);
	range(1, 0, 1/16, function(f) {
		newDannmaku(from, null, 0, f0+f*PI2, 0.1, 0, {
			color: 'b',
			frames: RES.frames.TamaB[6],
		})
	})
	stg3Danns2A(from, UTIL.getOneAlive('Player'), 4);
}
function stg3Danns3(from) {
	var to = UTIL.getOneAlive('Player');
	ieach([0.10, 0.12, 0.14], function(i, v) {
		range(1, 0, 1/30, function(f) {
			newDannmaku(from, to, 0, f*PI2, v, 0, {
				color: 'r',
				frames: RES.frames.TamaA[2],
			})
		})
	})
}
function stg3Danns4(from) {
	var to = UTIL.getOneAlive('Player');
	range(0.5001, -0.5, 1/6, function(f) {
		newDannmaku(from, to, 0, f*0.2, 0.15, 0, {
			color: 'r',
			frames: RES.frames.TamaSmallX[2],
		})
	})
}

function meilingFire1B(from) {
	var x = from.data.x,
		y = from.data.y;
	STORY.timeout(function(d, n) {
		range(1, 0, 1/30, function(f) {
			newDannmaku({
				data: {
					x: x+random(-10, 10),
					y: y+random(-10, 10),
				},
			}, null, 0, f*PI2+random(0.5), random(0.05, 0.15), 0, {
				color: 'b',
				frames: RES.frames.TamaB[6],
			})
		})
		y += 10;
	}, 8000/60, null, 7)
}
function meilingFire2R(from) {
	var to = UTIL.getOneAlive('Player');
	array(2, function(i) {
		range(1, 0, 1/40, function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.1+i*0.02, 0, {
				r: 3,
				color: 'r',
				frames: RES.frames.LongA[2],
			})
		})
	})
}
function meilingFire3R(from) {
	var to = UTIL.getOneAlive('Player');
	range(1, 0, 1/100, function(f) {
		newDannmaku(from, to, 0, f*PI2, 0.06, 0, {
			color: 'r',
			frames: RES.frames.TamaA[2],
		})
	})
	meilingFire2R(from);
}

function stg3Danns5(from) {
	var to = { data:{ x:from.data.x, y:GAME.rect.b, } };
	stg3Danns2A(from, to, 2);
}
function stg3Danns6(from) {
	array(20, function() {
		var obj = newDannmaku(from, null, 0, 0, 0, 0, {
			vx: random(-0.2, 0.2),
			vy: random(-0.1, -0.3),
			color: 'w',
			frames: RES.frames.TamaB[15],
		})
		obj.anim(50, function(d) {
			decrease_object_speed(d, 0.98);
			d.vy += 0.012;
		}, obj.data)
	})
}

function meilingFire4(from) {
	STORY.timeout(function(d, n) {
		range(1, 0, (n < 20 ? 1/20 : 1/10), function(f) {
			var t = (n < 20 ? random(0.5)-n*0.15 : -n*0.1) + f*PI2,
				v = (n < 20 ? 0 : (20 - n)/30*0.05) + 0.2;
			newDannmaku(from, null, 0, t, v, 0, {
				color: 'r',
				tama: 'LongC',
			})
		})
	}, 50, null, 50)
}
function meilingSC1(from) {
	STORY.timeout(function(d, n) {
		range(1, 0, 1/8, function(f) {
			newDannmaku(from, null, 0, f*PI2-n*0.1, 0.1, 0, {
				r: 3,
				color: 'c',
				tama: 'LongC',
			})
		})
		var r = Math.sin(n*0.04)+Math.cos(n*0.043);
		ieach('roygcbm', function(i, c) {
			range(1, 0, 1.5/(i+1), function(f) {
				newDannmaku(from, null, 0, i*0.1-PI*r+f*PI2, 0.18, 0, {
					color: c,
					tama: 'LongC',
				})
			})
		})
		ieach([
			[0.031, 0.043],
			[0.028, 0.033],
			[0.030,-0.039],
			[0.040,-0.029],
			[0.025, 0.033],
			[0.035,-0.026],
		], function(i, v) {
			var r = Math.sin(n*v[0]) + Math.cos(n*v[1]);
			newDannmaku(from, null, 0, PI*r, 0.18, 0, {
				color: 'c',
				tama: 'LongC',
			})
		})
	}, 150, null, 1000)
}
function meilingFire6(from) {
	var xs = [1/12, 3/12, 5/12];
	STORY.timeout(function (d, n) {
		var x = xs[n];
		ieach([1, -1], function(i, k) {
			var obj = SPRITE.newObj('Enemy', {
				x: UTIL.getGamePosX(0.5 + k*x),
				y: GAME.rect.t,
				vx: 0,
				vy: 0.1,
				frames: RES.frames.Enemy3A,
			})
			obj.anim(50, function(d) {
				if (d.age < 500)
					;
				else if (d.age < 10000) {
					this.is_firing = true;
					decrease_object_speed(d, 0.9);
				}
				else {
					this.is_firing = false;
					d.vx = random(-0.1, 0.1);
					d.vy = random(0.05, 0.15);
					return true;
				}
			}, obj.data)
			obj.anim(2000, function(d) {
				if (this.is_firing)
					stg3Danns2A(this, UTIL.getOneAlive('Player'), 2);
			}, obj.data)
		})
	}, 1000, null, xs.length)
}
function meilingFire6A(from) {
}

function newStage3(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('boss6', {
		bgelem: $('.bg-stg3'),
		bganim: newStg3BgAnim,
		title: 'STAGE 3',
		text: RES.st_stg3_title,
	});
	newStgSecsFromList(stage, [
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A1', 16], ],
			[stg3Sec1, ['s3A2', 16], 2000, ],
			[stg3Sec1, ['s3A3', 12], 6000, ],
			[stg3Sec1, ['s3A4', 12], 7000, ],
		], duration: 15000 },
		{ init:stg3Sec2, args:[[0.4, 0.3, 0.2, 0.1], 1000], duration:6000, },
		{ init:stg3Sec2, args:[[0.1, 0.2, 0.3], 500], duration:6000, },
		{ init:newSecList, args:[
			[stg3Sec3],
			[stg3Sec4, ['s0A2', 7, [[0, 0], [30, 0]]]],
			[stg3Sec4, ['s0A1', 7, [[0, 0], [-30, 0]]], 2000],
		], duration: 8000 },
		{ init:newSecList, args:[
			[stg3Sec3],
			[stg3Sec4, ['s0A2', 7, [[0, 0], [30, 0]]]],
			[stg3Sec4, ['s0A1', 7, [[0, 0], [-30, 0]]], 2000],
		], duration: 8000 },
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A1', 16], ],
			[stg3Sec1, ['s3A2', 16], 2000, ],
			[stg3Sec3, [500, 4], 3000],
			[stg3Sec2, [[0.1, 0.2, 0.3], 300], 6000, ],
		], duration: 8000 },
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A3', 12], ],
			[stg3Sec1, ['s3A4', 12], 2000, ],
			[stg3Sec3, [500, 4], 3000],
			[stg3Sec2, [[0.1, 0.2, 0.3], 300], 6000, ],
		], duration: 8000, },
		{ next:'bossIn' },
		{ name:'secIn', },
		{ init:newSecList, args:[
			[stg3Sec2, [[0.0, 0.16, 0.33], 1000, stg3Danns5], ],
			[stg3Sec1, ['s3A3', 12], 2000, ],
			[stg3Sec1, ['s3A4', 12], 2000, ],
		], duration: 4000 },
		{ init:stg3Sec2, args:[[1/12, 3/12, 5/12], 1000, stg3Danns5], duration:3000, },
		{ init:newSecList, args:[
			[stg3Sec2, [[0.0, 0.16, 0.33], 1000, stg3Danns6], ],
			[stg3Sec1, ['s3A3', 12], 2000, ],
			[stg3Sec1, ['s3A4', 12], 2000, ],
		], duration: 4000, },
		{ init:stg3Sec2, args:[[1/12, 3/12, 5/12], 1000, stg3Danns6], duration:3000, },
		{ init:stg3Sec2, args:[[1/12, 3/12, 5/12], 1000, stg3Danns5], duration:3000, },
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A3', 12], ],
			[stg3Sec1, ['s3A4', 12], ],
		], duration: 2000, },
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A3', 12], ],
			[stg3Sec1, ['s3A4', 12], ],
		], duration: 2000, },
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A3', 12], ],
			[stg3Sec1, ['s3A4', 12], ],
		], duration: 2000, },
		{ init:newSecList, args:[
			[stg3Sec1, ['s3A3', 12], ],
			[stg3Sec1, ['s3A4', 12], ],
		], duration: 2000, },
		{ init:stg3Sec2, args:[[0.25], 1000, stg3Danns6], duration:3000, },
		{ init:stg3Sec2, args:[[0.05, 0.15, 0.25, 0.35, 0.45], 200, stg3Danns5], duration:5000, next:'bossIn2', },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg3_diag1,  pos:'.fr.dg', face:'.f6a', name:'diag0', next:'bossQuit', clear:true, },
		{ text:RES.st_stg3_diag2,  pos:'.fl.dg', face:'.f0a.f2', next:'secIn', ended:true, },
		{ text:RES.st_stg3_diag3,  pos:'.fr.dg', face:'.f6a', name:'diagIn', clear:true, },
		{ text:RES.st_stg3_diag4,  pos:'.fl.dg', face:'.f0a', },
		{ text:RES.st_stg3_diag5,  pos:'.fr.dg', face:'.f6a', },
		{ text:RES.st_stg3_diag6,  pos:'.fl.dg', face:'.f0b.f2', },
		{ text:RES.st_stg3_diag7,  pos:'.fr.dg', face:'.f6a.f2', },
		{ text:RES.st_stg3_diag8,  pos:'.fr.dg', face:'.f6a.f2', },
		{ text:RES.st_stg3_diag9,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg3_diag10, pos:'.fr.dg', face:'.f6b', },
		{ text:RES.st_stg3_diag11, pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg3_diag12, pos:'.fr.dg', face:'.f6b', },
		{ text:RES.st_stg3_diag13, pos:'.fl.dg', face:'.f0a', },
		{ text:RES.st_stg3_diag14, pos:'.fr.dg', face:'.f6a', },
		{ text:RES.st_stg3_diag15, pos:'.fr.dg', face:'.f6a', },
		{ text:RES.st_stg3_diag16, pos:'.fl.dg', face:'.f0c.f2', next:'bossIn3', ended:true, },
	], newStgSecDiag, 'diag');
	newStgSecsFromList(stage, [
		{
			name: 'bossIn',
			boss: 'meiling',
			pathnodes: [
				{ fx:0.8, fy:0, v:0.2, },
				{ fx:0.5, fy:0.3, }
			],
			duration: 2000,
			no_countdown: true,
			no_lifebar: true,
			invinc: true,
		},
		{
			pathnodes: [
				{ v:0.2 },
				{ t: 500, fn:meilingFire1B, fx:0.3, fy:0.1 },
				{ t:2500, fn:meilingFire2R, },
				{ t: 500, fn:meilingFire3R, fx:0.6, fy:0.2, },
				{ t:2500, fn:meilingFire2R, },
				{ t: 500, fn:meilingFire1B, },
				{ t: 500, fn:meilingFire2R, fx:0.5, fy:0.3, },
				{ t:2500, },
				{ t: 500, fn:meilingFire3R, fx:0.8, fy:0.3, },
				{ t:2500, fn:meilingFire1B, },
				{ t: 500, fn:meilingFire2R, fx:0.5, fy:0.2, },
				{ t:2500, },
				{ t: 500, fn:meilingFire3R, fx:0.8, fy:0.1, },
				{ t:2500, fn:meilingFire1B, },
				{ t: 500, fn:meilingFire2R, fx:0.5, fy:0.2, },
				{ t:2500, },
				{ t: 500, fn:meilingFire3R, fx:0.8, fy:0.1, },
				{ t:2500, fn:meilingFire1B, },
				{ t: 500, fn:meilingFire2R, fx:0.5, fy:0.2, },
				{ t:2500, },
				{ t: 500, fn:meilingFire3R, fx:0.8, fy:0.1, },
			],
			duration: 30000,
			next: 'diag0',
		},
		{
			pathnodes: [
				{ v:0.3 },
				{ fx:0.5, fy:0.0 },
				{ fy:-1, v:0.3 },
			],
			name: 'bossQuit',
			next: 'diag1',
			duration: 500,
			no_countdown: true,
			invinc: true,
			disable_fire: true,
		},
		{
			pathnodes: [
				{ fx:0.9, fy:0.0, v:0.2, },
				{ fx:0.5, fy:0.3, },
			],
			duration: 500,
			name: 'bossIn2',
			next: 'diagIn',
			no_countdown: true,
			invinc: true,
			disable_fire: true,
		},
		{
			pathnodes: [
				{ v:0.2, },
				{ t:2000, fn:meilingFire4, },
				{ t:2000, fx:0.6, fy:0.1, },
				{ t:2000, fn:meilingFire4, },
				{ t:2000, fx:0.4, fy:0.2, },
				{ t:2000, fn:meilingFire4, },
				{ t:2000, fx:0.3, fy:0.1, },
				{ t:2000, fn:meilingFire4, },
				{ t:2000, fx:0.5, fy:0.3, },
				{ t:2000, fn:meilingFire4, },
				{ t:2000, fx:0.5, fy:0.1, },
				{ t:2000, fn:meilingFire4, },
				{ t:2000, fx:0.3, fy:0.2, },
				{ t:2000, fn:meilingFire4, },
			],
			name: 'bossIn3',
			duration: 30000,
		},
		{
			pathnodes: [
				{ v:0.2, },
				{ t:NaN,  fx:0.5, fy:0.2, },
				{ t:1000, fn:meilingSC1, },
			],
			duration: 30000,
			scname: RES.st_stg3_sc1,
		},
		{
			pathnodes: [
				{ v:0.2, },
				{ t:200, fn:meilingFire6, },
				{ t:10000, },
				{ t:200, fn:meilingFire6, },
				{ t:10000, },
			],
			duration: 30000,
		},
	], newStgSecBoss, 'boss');
	return stage;
}

