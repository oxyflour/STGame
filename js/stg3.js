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
			}, random(1500));
		});
	}, 250, null, count);
}
function stg3Danns1(from, speed, rand) {
	var to = UTIL.getOneAlive('Player');
	array(2, function(j) {
		range(1, 0, 1/10, function(f) {
			newDannmaku(from, null, 10*j, f+random(0.1), 0.1+0.02*j, 0, {
				color: 'b',
				frames: RES.frames.LongB[6],
			})
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
	], newStgSecNormal, 'sec');
	return stage;
}

