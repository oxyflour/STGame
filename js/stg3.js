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
function stg3Sec2(range, interval) {
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
						stg3Danns2(this);
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
				color: 'b',
				frames: RES.frames.LongB[6],
			})
		})
	})
}
function stg3Danns2(from) {
	var f0 = random(PI2);
	range(1, 0, 1/16, function(f) {
		newDannmaku(from, null, 0, f0+f*PI2, 0.1, 0, {
			color: 'b',
			frames: RES.frames.TamaB[6],
		})
	})
	var pl = UTIL.getOneAlive('Player'),
		to = pl && { data:{ x:pl.data.x, y:pl.data.y, } };
	STORY.timeout(function(d, n) {
		range(0.5001, -0.5, 1/4, function(f) {
			newDannmaku(from, to, 0, f, 0.3-n*0.015, 0, {
				color: 'b',
				frames: RES.frames.LongB[6],
			})
		})
	}, 50, null, 15)
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

function newStage3(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
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
		], duration: 8000 },
	], newStgSecNormal, 'sec');
	return stage;
}

