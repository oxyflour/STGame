function stg4Sec1(range) {
	STORY.timeout(function(d, n) {
		var x = range.shift();
		ieach([x, 1 - x], function(i, fx) {
			var t = 500 + x*1000;
			var obj = SPRITE.newObj('Enemy', {
				x: UTIL.getGamePosX(fx),
				y: GAME.rect.t,
				vx: 0,
				vy: 0.1,
				frames: RES.frames.Enemy3B,
			})
			obj.anim(t, function(d) {
				if (d.age)
					return (d.vy = 0) || true;
			}, obj.data)
			obj.anim(t + 500, function(d) {
				if (d.age) {
					SPRITE.newObj('Basic', {
						x: d.x,
						y: d.y,
						frames: RES.stg4frs.Circle,
						duration: 1000,
					})
					d.vx = random(-0.05, 0.05);
					d.vy = random(0.15);
					stg4Fire1(this);
					return true;
				}
			}, obj.data)
		})
	}, 500, null, range.length)
}

function stg4Fire1(from) {
	var px = from.data.x,
		py = from.data.y;
	STORY.timeout(function(d, n) {
		var rt = random(PI2);
		var pos = {
			data: {
				x:px+random(-100, 100),
				y:py+random(-100, 100)
			}
		}
		range(1, 0, 1/16, function(f) {
			newDannmaku(pos, null, 0, PI2*f+rt, 0.08, 0, {
				color: 'b',
				tama: 'LongB',
			})
		})
		RES.se_tan00.replay()
	}, 100, null, 10)
}

function newStage4(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg4'),
		title: 'STAGE 4',
		text: RES.st_stg4_title,
	});
	newStgSecsFromList(stage, [
		{ duration:2000, init:stg4Sec1, args:[[0.1, 0.2, 0.4]], },
	], newStgSecNormal, 'sec');
	return stage;
}
