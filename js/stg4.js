function stg4Sec1() {
	var range = [].slice.call(arguments, 0);
	STORY.timeout(function(d, n) {
		var v = range.shift();
		ieach(v.mirror ? [1, -1] : [1], function(i, x) {
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
function stg4Sec2(pth, times, interval) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy2A,
			pathnodes: UTIL.pathOffset(RES.path[pth], 0, 0),
			times: times >= 0 ? times : 2,
		})
		STORY.timeout(function(d, n) {
			obj.anim(interval || 500, function(d) {
				if (d.times -- > 0)
					stg4Fire2(this);
				else
					return true;
			}, obj.data)
		}, random(200, 500));
	}, 350, null, 7)
}
function stg4Sec3A(fx, fy, duration) {
	var obj = SPRITE.newObj('Enemy', {
		x: UTIL.getGamePosX(fx),
		y: UTIL.getGamePosY(fy),
		frames: RES.stg4frs.EnemySq,
		duration: duration,
		f0: random(PI2),
	})
	obj.anim(50, function(d) {
		d.y += Math.cos(d.age * 0.005);
	}, obj.data)
	obj.anim(800, function(d) {
		if (d.age) stg4Fire4(obj, d.f0 += 0.1);
	}, obj.data)
	SPRITE.newObj('Basic', {
		parent: obj,
		x: obj.data.x,
		y: obj.data.y,
		frames: RES.stg4frs.Circle,
	})
}
function stg4Sec3(duration) {
	STORY.timeout(function(d, n) {
		stg4Sec3A(random(0.1, 0.9), random(0.1, 0.4), duration + (n - 6)*600)
	}, 600, null, 6)
}

function stg4Fire1(from, duration) {
	SPRITE.newObj('Basic', {
		x: from.data.x,
		y: from.data.y,
		frames: RES.stg4frs.Circle,
		duration: 1000,
	})
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
	}, 100, null, (duration || 1000)/100)
}
function stg4Fire2(from) {
	var to = UTIL.getOneAlive('Player');
	array(2, function(i) {
		range(0.5001, -0.5, 1/8, function(f) {
			newDannmaku(from, to, 0, f*2, 0.12+i*0.02, 0, {
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

function koakumaFire1(from, direction) {
	STORY.timeout(function(d, n) {
		range(1, 0, 1/8, function(f) {
			newDannmaku(from, null, 0, f*PI2-n*(direction || 1)*0.2, 0.15, 0, {
				no_frame: true,
				blend: 'lighter',
				color: 'b',
				tama: 'TamaMax',
			})
		})
		RES.se_tan00.play()
	}, 280, null, 8)
}
function koakumaFire(from) {
	STORY.timeout(function(d, n) {
		koakumaFire1(from, n % 2 ? 1 : -1)
	}, 3500, null, 1000, true)
	STORY.timeout(function(d, n) {
		stg4Fire1(from, 2000)
	}, 4000, null, 1000, true)
}

function stg4Sec4() {
	ieach([0.1, 0.9], function(i, fx) {
		var obj = SPRITE.newObj('Enemy', {
			x: UTIL.getGamePosX(fx),
			y: UTIL.getGamePosX(0.2),
			frames: RES.stg4frs.EnemySr,
			times: 9,
			duration: 9000,
		})
		SPRITE.newObj('Basic', {
			x: obj.data.x,
			y: obj.data.y,
			parent: obj,
			frames: RES.stg4frs.Circle,
		})
		obj.anim(50, function(d) {
			d.y += Math.cos(d.age * 0.005);
		}, obj.data)
		STORY.timeout(function(d, n) {
			stg4Fire5(obj)
		}, 1000, null, 9)
	})
}
function stg4Sec5() {
	var range = [].slice.call(arguments, 0);
	STORY.timeout(function(d, n) {
		var x = range.shift();
		ieach([x, 1-x], function(i, fx) {
			var from = {
				data: UTIL.getGamePosXY(fx, 0.1+x/4),
			}
			var obj = newLaserWithDot(from, from.data.x, from.data.y, 0, GAME.rect.b, 30, {
				dh: 1/3000,
				duration: 5000,
				dot_color: 'b',
			})
			SPRITE.newObj('Basic', {
				x: obj.data.x,
				y: obj.data.y,
				parent: obj.data.dot,
				frames: RES.stg4frs.Circle,
			})
			STORY.timeout(function(d) {
				stg4Fire6(from);
			}, 1000)
		})
	}, 500, null, range.length)
}
function stg4Sec6() {
	var i = 0;
	stg4Sec2('s4AL' + (i ++), 4, 300);
	STORY.timeout(function(d, n) {
		stg4Sec2('s4AL' + (i ++), 4, 300);
	}, 3000, null, RES.path.s4AL.length - 1)
}

function stg4Fire5(from) {
	var to = UTIL.getOneAlive('Player');
	array(3, function(i) {
		range(1, 0, 1/30, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2, 0.3+i*0.05, 0, {
				color: 'b',
				tama: 'TamaB',
			})
			obj.anim(80, function(d) {
				if (d.age < 800)
					decrease_object_speed(d, 0.92)
				else
					return true;
			}, obj.data)
		})
	})
}
function stg4Fire6(from) {
	array(2, function(i) {
		range(1, 0, 1/20, function(f) {
			newDannmaku(from, null, 0, f*PI2, 0.1+0.02*i, 0, {
				color: 'b',
				tama: 'LongB',
			})
		})
	})
}

function patchouliFire1A(from, color, vt) {
	range(1, 0, 1/4, function(f) {
		var obj = newLaserWithDot(from, from.data.x, from.data.y, 0, 0, 25, {
			dot_color: color,
			frames: RES.frames.TamaB['k r m b c g y ow'.indexOf(color || 'b')],
			expand: 0,
			opacity: 0.9,
			parent: from,
			duration: 1200,
			theta: f*PI2 + (vt > 0 ? -1/8 : 1/8)*PI2,
			vt: vt || 0.001,
		})
		obj.runCircle = (function(run) {
			return function(dt, d) {
				var p = d.parent;
				d.theta += d.vt*dt;
				d.x = p.data.x + 50*Math.cos(d.theta);
				d.y = p.data.y + 50*Math.sin(d.theta);
				d.dx = 600*Math.cos(d.theta);
				d.dy = 600*Math.sin(d.theta);
				run.call(this, dt, d)
			}
		})(obj.runCircle)
	})
}
function patchouliFire1B(from, to, rads, layers) {
	var f0 = to ? 0 : random(PI2);
	array(layers || 4, function(i) {
		range(1, 0, 1/(rads || 24), function(f) {
			newDannmaku(from, to, 0, f*PI2+f0, 0.1+i*0.015, 0, {
				color: 'r',
				tama: 'TamaB',
			})
		})
	})
}
function patchouliFire1C(from) {
	ieach([
		{ x:from.data.x-20, y:from.data.y+30, },
		{ x:from.data.x-20, y:from.data.y-30, },
		{ x:from.data.x+20, y:from.data.y-30, },
		{ x:from.data.x+20, y:from.data.y+30, },
	], function(i, v) {
		patchouliFire1B({ data:v }, UTIL.getOneAlive('Player'), 10, 2)
	})
}
function patchouliFire1(from) {
	var i = randin([1, -1]);
	STORY.timeout(function(d, n) {
		patchouliFire1A(from, 'b', PI2/8/1200*(i *= -1));
	}, 800, null, 1, true)
	STORY.timeout(function(d, n) {
		STORY.timeout(function() {
			patchouliFire1B(from);
		}, 500, null, 5)
	}, 3000)
}

function newStage4(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('muqFight', {
		bgelem: $('.bg-stg4'),
		title: 'STAGE 4',
		text: RES.st_stg4_title,
	});
	newStgSecsFromList(stage, [
		{ duration:8000, init:stg4Sec1, args:[
			{ t: 600, fx:0.1, fy:0, mirror:true, },
			{ t: 800, fx:0.2, fy:0, mirror:true, },
			{ t:1000, fx:0.4, fy:0, mirror:true, },
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
			{ t:600, fx:0, fy:0.1, mirror:true, },
			{ t:500, fx:0, fy:0.2, mirror:true, },
			{ t:400, fx:0, fy:0.3, mirror:true, },
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
			{ t:1000, s:10000, fx:0.2, fy:0, fn:stg4Fire3, q:'-y', mirror:true, },
			{ t:1000, s:10000, fx:0, fy:0.2, fn:stg4Fire3, q:'-y', mirror:true, },
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
		{ duration:15000, init:newSecList, args:[
			[stg4Sec4],
			[stg4Sec1, [
				{ t: 600, fx:0.1, fy:0, mirror:true, },
				{ t: 800, fx:0.2, fy:0, mirror:true, },
				{ t:1000, fx:0.4, fy:0, mirror:true, },
			], 2000],
			[stg4Sec2, ['s4A3', 0], 4000],
			[stg4Sec2, ['s4A4', 0], 4000],
			[stg4Sec5, [0.10, 0.30, 0.40], 5000],
			[stg4Sec5, [0.05, 0.25, 0.35], 9000],
		], name:'secA' },
		{ duration:8000, init:newSecList, args:[
			[stg4Sec3A, [0.60, 0.1, 6000]],
			[stg4Sec3A, [0.65, 0.1, 6000]],
			[stg4Sec1, [
				{ t:1000, s:8000, fx:0.2, fy:0, fn:stg4Fire3, q:'-y'},
			]],
			[stg4Sec2, ['s4A4'], 3000],
		]},
		{ duration:8000, init:newSecList, args:[
			[stg4Sec3A, [0.40, 0.1, 6000]],
			[stg4Sec3A, [0.35, 0.1, 6000]],
			[stg4Sec1, [
				{ t:1000, s:8000, fx:0.8, fy:0, fn:stg4Fire3, q:'-y'},
			]],
			[stg4Sec2, ['s4A3'], 3000],
		]},
		{ duration:24000, init:stg4Sec6, next:'diag0', },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg4_diag1,  pos:'.fl.dg', face:'.f0a', clear:true, },
		{ text:RES.st_stg4_diag2,  pos:'.fl.dg', face:'.f0a.f2', next:'muqIn', },
		{ text:RES.st_stg4_diag3,  pos:'.fr.dg', face:'.f8a', name:'diagMuqIn', },
		{ text:RES.st_stg4_diag4,  pos:'.fr.dg', face:'.f8a.f2', },
		{ text:RES.st_stg4_diag5,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg4_diag6,  pos:'.fr.dg', face:'.f8b', },
		{ text:RES.st_stg4_diag7,  pos:'.fl.dg', face:'.f0a.f2', },
		{ text:RES.st_stg4_diag8,  pos:'.fr.dg', face:'.f8a.f2', },
		{ text:RES.st_stg4_diag9,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg4_diag10, pos:'.fr.dg', face:'.f8a.f2', },
		{ text:RES.st_stg4_diag11, pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg4_diag12, pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg4_diag13, pos:'.fr.dg', face:'.f8a', },
		{ text:RES.st_stg4_diag14, pos:'.fl.dg', face:'.f0a.f2', },
		{ text:RES.st_stg4_diag15, pos:'.fr.dg', face:'.f8a', },
		{ text:RES.st_stg4_diag16, pos:'.fl.dg', face:'.f0a.f2', },
		{ text:RES.st_stg4_diag17, pos:'.fr.dg', face:'.f8a.f2', ended:true, next:'muqFight', },
	], newStgSecDiag, 'diag');
	newStgSecsFromList(stage, [
		{
			boss: 'koakuma',
			pathnodes: [
				{ v:0.1, fx:0.5, fy:0.3, },
				{ t:NaN, }
			],
			duration: 200,
			no_countdown: true,
			no_lifebar: true,
			invinc: true,
		},
		{
			pathnodes: [
				{ v:0.2 },
				{ t:3000, fn:koakumaFire, },
				{ t:12000, fx:0.3, fy:0.2, },
				{ t:4000, fx:0.4, fy:0.3, },
				{ t:8000, fx:0.3, fy:0.3, },
				{ t:7000, fx:0.4, fy:0.3, },
				{ t:7000, fx:0.5, fy:0.4, },
			],
			duration: 40000,
		},
		{
			pathnodes: [
				{ v:0.2, fx:0.5, fy:-1, },
			],
			duration: 200,
			next: 'secA',
		},
		{
			boss: 'patchouli',
			pathnodes: [
				{ fx:0.1, fy:0.0, v:0.2, },
				{ fx:0.5, fy:0.3, },
			],
			duration: 500,
			name: 'muqIn',
			next: 'diagMuqIn',
			no_countdown: true,
			invinc: true,
			disable_fire: true,
		},
		{
			name: 'muqFight',
			pathnodes: [
				{ v:0.1 },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.8, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.5, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.2, fy:0.3, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.8, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.2, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.3, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
			],
			duration: 40000,
		},
		{
			scname: RES.st_stg4_sc1,
			pathnodes: [
				{ v:0.1 },
			],
			duration: 30000,
		}
	], newStgSecBoss, 'boss');
	return stage;
}
