function stg4Sec1() {
	var range = [].slice.call(arguments, 0);
	STORY.timeout(function(d, n) {
		var v = range.shift();
		ieach([1, -1], function(i, x) {
			var obj = SPRITE.newObj('Enemy', {
				x: UTIL.getGamePosX(x > 0 ? v.fx : 1-v.fx),
				y: UTIL.getGamePosY(v.fy),
				vx: v.fx ? 0 : 0.1*x,
				vy: v.fy ? 0 : 0.1,
				frames: RES.frames.Enemy3B,
			})
			obj.anim(v.t, function(d) {
				if (d.age) {
					d.vx = d.vy = 0;
					(v.fn || stg4Fire1)(this);
					return true;
				}
			}, obj.data)
			obj.anim(v.t + (v.s || 500), function(d) {
				if (d.age) {
					SPRITE.newObj('Basic', {
						x: d.x,
						y: d.y,
						frames: RES.stg4frs.Circle,
						duration: 1000,
					})
					if (v.q == '-y') {
						d.vy = -0.1;
					}
					else {
						d.vx = random(-0.05, 0.05);
						d.vy = random(0.03, 0.15);
					}
					return true;
				}
			}, obj.data)
		})
	}, 500, null, range.length)
}
function stg4Sec2(pth, times) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy2A,
			pathnodes: UTIL.pathOffset(RES.path[pth], 0, 0),
			times: times || 2,
		})
		STORY.timeout(function(d, n) {
			obj.anim(500, function(d) {
				stg4Fire2(this);
				if (d.times -- < 0)
					return true;
			}, obj.data)
		}, random(200, 500));
	}, 350, null, 7)
}
function stg4Sec3(duration) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
			x: UTIL.getGamePosX(random(0.1, 0.9)),
			y: UTIL.getGamePosY(random(0.1, 0.4)),
			frames: RES.stg4frs.EnemySq,
			duration: duration + (n - 6)*600,
		})
		obj.anim(50, function(d) {
			d.y += Math.cos(d.age * 0.005);
		}, obj.data)
		STORY.timeout(function(d, n) {
			stg4Fire4(obj, n*0.1);
		}, 800, null, 1000)
		SPRITE.newObj('Basic', {
			parent: obj,
			x: obj.data.x,
			y: obj.data.y,
			frames: RES.stg4frs.Circle,
		})
	}, 600, null, 6)
}

function stg4Fire1(from) {
	var px = from.data.x,
		py = from.data.y;
	STORY.timeout(function(d, n) {
		var rt = random(PI2);
		var pos = {
			data: {
				x:px+random(-80, 80),
				y:py+random(-80, 80)
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
function stg4Fire2(from) {
	var to = UTIL.getOneAlive('Player');
	array(2, function(i) {
		range(0.5001, -0.5, 1/8, function(f) {
			newDannmaku(from, to, 0, f*2, 0.08+i*0.02, 0, {
				color: 'b',
				tama: 'LongA',
			})
		})
	})
	RES.se_tan00.play();
}
function stg4Fire3(from) {
	var f0 = 0;
	from.anim(200, function(d) {
		f0 += PI2/30;
		array(3, function(i) {
			range(1, 0, 1/9, function(f) {
				newDannmaku(from, null, 0, f*PI2+f0, 0.15+i*0.02, 0, {
					color: 'b',
					tama: 'LongA',
				})
			})
		})
		if (d.vx || d.vy)
			return true;
	}, from.data);
}
function stg4Fire4(from, f0) {
	array(2, function(i) {
		range(1, 0, 1/16, function(f) {
			ieach([
				{ f:0.0, t:'TamaB', },
				{ f:0.1, t:'TamaSmallY', },
			], function(j, v) {
				var obj = newDannmaku(from, null, 0, f*PI2+f0+v.f, 0.3+i*0.1, 0, {
					color: 'g',
					tama: v.t,
				})
				obj.anim(100, function(d) {
					if (d.age < 800)
						decrease_object_speed(d, 0.92)
					else
						return true;
				}, obj.data)
			})
		})
	})
}

function koakumaFire1(from) {
}

function newStage4(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('boss0', {
		bgelem: $('.bg-stg4'),
		title: 'STAGE 4',
		text: RES.st_stg4_title,
	});
	newStgSecsFromList(stage, [
		{ duration:8000, init:stg4Sec1, args:[
			{ t:600, fx:0.1, fy:0, },
			{ t:800, fx:0.2, fy:0, },
			{ t:1000, fx:0.4, fy:0, },
		], },
		{ duration:4000, init:newSecList, args:[
			[stg4Sec2, ['s4A1']],
			[stg4Sec2, ['s4A2'], 500],
		]},
		{ duration:5000, init:newSecList, args:[
			[stg4Sec2, ['s4A3']],
			[stg4Sec2, ['s4A4'], 500],
		]},
		{ duration:5000, init:stg4Sec1, args:[
			{ t:600, fx:0, fy:0.1, },
			{ t:500, fx:0, fy:0.2, },
			{ t:400, fx:0, fy:0.3, },
		], },
		{ duration:5000, init:newSecList, args:[
			[stg4Sec2, ['s4A3']],
			[stg4Sec2, ['s4A4'], 500],
		]},
		{ duration:4000, init:newSecList, args:[
			[stg4Sec2, ['s4A1']],
			[stg4Sec2, ['s4A2'], 500],
		]},
		{ duration:5000, init:stg4Sec1, args:[
			{ t:1000, s:10000, fx:0.2, fy:0, fn:stg4Fire3, q:'-y'},
			{ t:1000, s:10000, fx:0, fy:0.2, fn:stg4Fire3, q:'-y'},
		], },
		{ duration:5000, init:newSecList, args:[
			[stg4Sec2, ['s4A3']],
			[stg4Sec2, ['s4A4'], 500],
		]},
		{ duration:4000, init:newSecList, args:[
			[stg4Sec2, ['s4A1']],
			[stg4Sec2, ['s4A2'], 500],
		]},
		{ duration:5000, init:newSecList, args:[
			[stg4Sec2, ['s4A3']],
			[stg4Sec2, ['s4A4'], 500],
		]},
		{ duration:10000, init:stg4Sec3, args:[10000], next:'boss0', },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{
			boss: 'koakuma',
			pathnodes: [
				{ v:0.1, fx:0.5, fy:0.3, },
				{ t:NaN, }
			],
			duration: 2000,
			no_countdown: true,
			no_lifebar: true,
			invinc: true,
		},
	], newStgSecBoss, 'boss');
	return stage;
}
