function stg4Sec1() {
	var range = [].slice.call(arguments, 0);
	STORY.timeout(function(d, n) {
		var v = range.shift();
		ieach(v.mirror ? [1, -1] : [1], function(i, x) {
			var obj = SPRITE.newObj('Enemy', {
				life: v.clear ? 80 : 20,
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
			if (v.clear) obj.anim(100, function(d) {
				if (this.is_dying) {
					SPRITE.eachObj(function(i, v) {
						STORY.on(STORY.events.DANNMAKU_HIT, v);
					}, 'Dannmaku')
					return true;
				}
			}, obj.data)
		})
	}, 500, null, range.length)
}
function stg4Sec2(pth, times, interval) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
			life: 2,
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
		life: 1000,
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
		RES.se_tan00.replay();
	}, from.data);
}
function stg4Fire4(from, f0) {
	array(2, function(i) {
		range(1, 0, 1/16, function(f) {
			ieach([
				{ f:0.0, t:'TamaB', },
				{ f:0.1, t:'TamaMini', },
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
	RES.se_tan02.replay();
}

function koakumaFire1(from, direction) {
	STORY.timeout(function(d, n) {
		range(1, 0, 1/8, function(f) {
			newDannmaku(from, null, 0, f*PI2-n*(direction || 1)*0.2, 0.15, 0, {
				color: 'b',
				tama: 'TamaMax',
				no_frame: true,
				blend: 'lighter',
			})
		})
		RES.se_tan00.play()
	}, 280, null, 8)
	RES.se_power0.play();
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
			life: 1000,
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
function patchouliFire1B(from, to, rads, layers, speed) {
	var f0 = to ? 0 : random(PI2);
	array(layers || 4, function(i) {
		range(1, 0, 1/(rads || 24), function(f) {
			newDannmaku(from, to, 0, f*PI2+f0, (speed||0.15)*(1+i*0.15), 0, {
				color: speed > 0.15 ? 'b' : 'r',
				tama: 'TamaB',
			})
		})
	})
	RES.se_tan00.play();
}
function patchouliFire1C(from) {
	var pos = [
		{ x:from.data.x-20, y:from.data.y+30, },
		{ x:from.data.x-20, y:from.data.y-30, },
		{ x:from.data.x+20, y:from.data.y-30, },
		{ x:from.data.x+20, y:from.data.y+30, },
	]
	STORY.timeout(function(d, n) {
		ieach(pos, function(i, v) {
			patchouliFire1B({ data:v }, UTIL.getOneAlive('Player'), 10, 2)
		})
	}, 800, null, 4)
	RES.se_tan00.play();
}
function patchouliFire1D(from) {
	var pos = [
		{ x:from.data.x-20, y:from.data.y+30, },
		{ x:from.data.x-20, y:from.data.y-30, },
		{ x:from.data.x+20, y:from.data.y-30, },
		{ x:from.data.x+20, y:from.data.y+30, },
	]
	var to = UTIL.getOneAlive('Player')
	STORY.timeout(function(d, n) {
		ieach(pos, function(i, v) {
			array(2, function(i) {
				ieach([-0.05, 0.05], function(j, f) {
					newDannmaku({ data:v }, to, 0, f*PI2, 0.1+i*0.02, 0, {
						color: 'r',
						tama: 'TamaB',
					})
				})
			})
		})
	}, 500, null, 4)
	RES.se_tan00.play();
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
function patchouliSC1(from) {
	STORY.timeout(function(d, n) {
		array(2, function(i) {
			array(2, function(k) {
				range(10, 0, 1, function(j) {
					var f = j / 10;
					var obj = newDannmaku(from, null, 0, f*PI2+n, 0.15+i*0.05, 0, {
						sx: from.data.x,
						sy: from.data.y,
						sd: k % 2 ? 1 : -1,
						sc: 0.97 + (j % 3)*0.01,
						no_frame: true,
						frames: RES.frames.Fire,
					})
					obj.anim(80, function(d) {
						if (d.age < 500)
							return;
						else if (d.age < 1800) {
							var dx = d.sx - d.x,
								dy = d.sy - d.y,
								x = d.x - dy*d.sd,
								y = d.y + dx*d.sd,
								v = sqrt_sum(d.vx, d.vy)*d.sc;
							redirect_object(d, { x:x, y:y }, v, 0.25);
						}
						else {
							rotate_object_speed(d, random(d.sd*0.2), random(0.03, 0.15));
							return true;
						}
					}, obj.data)
				})
			})
		})
		RES.se_tan02.replay();
	}, 120, null, 5)
}
function patchouliFire2A(from) {
	patchouliFire1B(from, UTIL.getOneAlive('Player'), 24, 1, 0.18);
}
function patchouliFire2(from) {
	var i = randin([1, -1]);
	STORY.timeout(function(d, n) {
		patchouliFire1A(from, 'r', PI2/8/1200*(i *= -1));
	}, 800, null, 1, true)
	STORY.timeout(function(d, n) {
		var to = UTIL.getOneAlive('Player');
		STORY.timeout(function() {
			patchouliFire1B(from, to, 8, 5, 0.25);
		}, 150, null, 20)
	}, 3000)
}
function patchouliSC2(from) {
	STORY.timeout(function(d, n) {
		array(10, function(i) {
			var obj = newDannmaku(from, null, 0, random(-1, 1), random(0.02, 0.05), 0, {
				color: 'y',
				tama: 'TamaA',
			})
			obj.anim(random(1000, 4000), function(d) {
				if (d.age)
					return rotate_object_speed(d, random(-1, 1), random(0.05, 0.15)) || true;
			}, obj.data)
		})
		RES.se_tan01.replay();
	}, 200, null, 1000)
	STORY.timeout(function(d, n) {
		var to = UTIL.getOneAlive('Player')
		range(1, 0, 1/7, function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.2, 0, {
				color: 'y',
				tama: 'TamaMax',
				no_frame: true,
				blend: 'lighter',
			})
		})
	}, 800, null, 1000)
}
function patchouliSC3A(from) {
	STORY.timeout(function(d, n) {
		var f0 = random(PI2);
		array(2, function(i) {
			var fi = random(0.1);
			range(1, 0, 1/24, function(f) {
				newDannmaku(from, null, 0, f*PI2+f0+fi, 0.12+i*0.04, 0, {
					frames: RES.frames.Fire,
					no_frame: true,
				})
			})
		})
		RES.se_tan02.replay();
	}, 160, null, 8)
}
function patchouliSC3B(from) {
	STORY.timeout(function(d, n) {
		array(30, function(i) {
			var obj = newDannmaku(from, null, 0, random(-1, 1), random(0.08, 0.12), 0, {
				color: 'y',
				tama: 'TamaA',
			})
			obj.anim(80, function(d) {
				if (d.age < 2000)
					decrease_object_speed(d, 0.98)
				else
					return rotate_object_speed(d, (i % 3 - 1)*0.8, random(0.08, 0.2)) || true;
			}, obj.data)
		})
		RES.se_tan01.replay();
	}, 200, null, 3)
}
function patchouliSC4(from, color) {
	array(2, function(i) {
		range(1, 0, 1/40, function(f) {
			var obj = newDannmaku(from, null, 0, (f+i/80)*PI2, 0.2+0.05*i, 0, {
				color: color,
				tama: 'TamaB',
				vt: 0.025 * (color=='o' ? 1 : -1) * (1+0.4*i),
			})
			obj.anim(80, function(d) {
				decrease_object_speed(d, d.age < 1000 ? 0.95 : 0.998)
				rotate_object_speed(d, d.vt)
			}, obj.data)
		})
	})
	RES.se_tan00.replay();
}
function patchouliSC5A(from) {
	STORY.timeout(function(d, n) {
		array(20, function(i) {
			var obj = newDannmaku(from, null, 0, random(PI2), random(0.1, 0.3), 0, {
				dvx: random(0.005),
				color: 'r',
				frames: RES.frames.Fire,
			})
			obj.anim(80, function(d) {
				if (d.age < 1000)
					decrease_object_speed(d, 0.95)
				d.vx -= d.dvx;
			}, obj.data)
		})
		RES.se_tan02.replay();
	}, 800, null, 1000)
}
function patchouliSC5B(from) {
	STORY.timeout(function(d, n) {
		var from = { data:UTIL.getGamePosXY(1, random(0.1, 1)) };
		array(2, function(i) {
			var v = random(0.1, 0.3)*(1+0.3*i),
				t = PI/6+0.1*i;
			var obj = newDannmaku(from, null, 0, 0.1+i, v, 0, {
				vx: -v*Math.cos(t),
				vy:  v*Math.sin(t),
				color: 'r',
				tama: 'LongC',
			})
			obj.anim(80, function(d) {
				if (d.age < 1000)
					decrease_object_speed(d, 0.95)
			}, obj.data)
		})
	}, 200, null, 1000)
	RES.se_kira01.play();
}

function newStage4(difficulty, next) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
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
			{ t:1000, s:10000, fx:0.2, fy:0, fn:stg4Fire3, q:'-y', clear:true, mirror:true, },
			{ t:1000, s:10000, fx:0, fy:0.2, fn:stg4Fire3, q:'-y', clear:true, mirror:true, },
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
				{ t:1000, s:8000, fx:0.2, fy:0, fn:stg4Fire3, q:'-y', clear:true },
			]],
			[stg4Sec2, ['s4A4'], 3000],
		]},
		{ duration:8000, init:newSecList, args:[
			[stg4Sec3A, [0.40, 0.1, 6000]],
			[stg4Sec3A, [0.35, 0.1, 6000]],
			[stg4Sec1, [
				{ t:1000, s:8000, fx:0.8, fy:0, fn:stg4Fire3, q:'-y', clear:true },
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
		{ text:RES.st_stg4_diag17, pos:'.fr.dg', face:'.f8a.f2', next:'muqFight', ended:true, },
		{ text:RES.st_stg4_diag18, pos:'.fl.dg', face:'.f0b.f2', name:'muqSad', },
		{ text:RES.st_stg4_diag19, pos:'.fr.dg', face:'.f8b.f2', next:'score', ended:true, },
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
			bomb_pt: 1,
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
				{ fx:0.5, fy:0.3, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.8, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.5, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1D, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.2, fy:0.3, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.8, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1D, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.2, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire1, },
				{ t:NaN,  fx:0.3, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1D, },
				{ t:4000, fn:patchouliFire1, },
			],
			duration: 40000,
		},
		{
			scname: RES.st_stg4_sc1,
			pathnodes: [
				{ v:0.1 },
				{ t:200,  fx:0.2, fy:0.2, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.5, fy:0.2, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.5, fy:0.1, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.5, fy:0.3, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.3, fy:0.1, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.2, fy:0.2, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.3, fy:0.1, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.2, fy:0.2, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.5, fy:0.1, },
				{ t:2800, fn:patchouliSC1, },
				{ t:200,  fx:0.5, fy:0.3, },
				{ t:2800, fn:patchouliSC1, },
			],
			duration: 30000,
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ t:4000, fn:patchouliFire2, },
				{ t:NaN,  fx:0.8, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:4000, fn:patchouliFire2, },
				{ t:NaN,  fx:0.5, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1D, },
				{ t:100,  fn:patchouliFire2A, },
				{ t:4000, fn:patchouliFire2, },
				{ t:NaN,  fx:0.2, fy:0.3, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:100,  fn:patchouliFire2A, },
				{ t:4000, fn:patchouliFire2, },
				{ t:NaN,  fx:0.8, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1D, },
				{ t:100,  fn:patchouliFire2A, },
				{ t:4000, fn:patchouliFire2, },
				{ t:NaN,  fx:0.2, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1C, },
				{ t:100,  fn:patchouliFire2A, },
				{ t:4000, fn:patchouliFire2, },
				{ t:NaN,  fx:0.3, fy:0.1, },
				{ t:NaN,  fx:0.5, fy:0.3, },
				{ t:100,  fn:patchouliFire1D, },
				{ t:100,  fn:patchouliFire2A, },
				{ t:4000, fn:patchouliFire2, },
			],
			duration: 40000,
		},
		{
			scname: RES.st_stg4_sc2,
			pathnodes: [
				{ v:0.1 },
				{ t:200,  fx:0.5, fy:0.2, },
				{ t:200,  fn:patchouliSC2, },
			],
			duration: 35000,
		},
		{
			scname: RES.st_stg4_sc3,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:200,  fx:random(0.05, 0.95), fy:random(0.05, 0.25), });
				d.push({ t:2000, fn:patchouliSC3A, });
				d.push({ t:1000, fn:patchouliSC3B, });
			}, [
				{ v:0.1 },
			]),
			duration: 40000,
		},
		{
			scname: RES.st_stg4_sc4,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:NaN,  fx:random(0.05, 0.95), fy:random(0.05, 0.25), });
				array(8, function() {
					d.push({ t:300, fn:patchouliSC4, args:['o'], });
					d.push({ t:300, fn:patchouliSC4, args:['c'], });
				})
			}, [
				{ v:0.1 },
			]),
			duration: 40000,
		},
		{
			scname: RES.st_stg4_sc5,
			pathnodes: [
				{ v:0.1 },
				{ fx:0.5, fy:0.2, },
				{ t:100, fn:patchouliSC5A, },
				{ t:100, fn:patchouliSC5B, },
			],
			duration: 40000,
			next: 'bossKill',
		},
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'muqSad', },
	], newStgSecBossKill, 'bossKill');
	stage.score = newStgSecScore('ended');
	stage.ended = next ? newStgSecLoadNew(newStage5, difficulty, next) : newStgSecOver();
	return stage;
}
