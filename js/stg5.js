function newStg5BgAnim(bg) {
	// do nothing :)
}

function stg5Sec1(fx, color) {
	ieach([fx, 1-fx], function(i, fx) {
		var obj = SPRITE.newObj('Enemy', {
			life: 20,
			x: UTIL.getGamePosX(fx),
			y: GAME.rect.t,
			vx: 0,
			vy: 0.1,
			frames: RES.frames.Enemy3B,
		})
		STORY.timeout(function(d) {
			d.vx = d.vy = 0;
			stg5Fire1(obj, color);
		}, 500, obj.data)
		STORY.timeout(function(d) {
			d.vy = 0.1;
		}, 2500, obj.data)
	})
}
function stg5Sec2(pth) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
			life: 20,
			pathnodes: RES.path[pth],
			frames: RES.frames.Enemy3A,
		})
		stg5Fire2(obj);
	}, 600, null, 5)
}
function stg5Sec3(fx) {
	var obj = SPRITE.newObj('Enemy', {
		life: 20,
		frames: RES.frames.Enemy3B,
		x: UTIL.getGamePosX(fx),
		y: GAME.rect.t,
		vx: 0,
		vy: 0.1,
	})
	STORY.timeout(function(d) {
		d.vx = d.vy = 0;
		stg5Fire3(obj);
	}, 500, obj.data)
	STORY.timeout(function(d) {
		d.vy = 0.1;
	}, 4000, obj.data)
}

function stg5Fire1(from, color, count) {
	var to = UTIL.getOneAlive('Player'),
		n = count || 8;
	from.anim(100, function(d) {
		if (n-- < 0)
			return true;
		range(1, 0, 1/40, function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.2-n*0.015, 0, {
				color: color || 'b',
				tama: 'TamaB',
			})
		})
	}, from.data)
	RES.se_tan00.replay();
}
function stg5Fire2(from) {
	from.anim(400, function(d) {
		array(10, function() {
			newDannmaku(from, null, 0, random(-PI/2, PI/2), random(0.05, 0.15), 0, {
				color: 'b',
				tama: 'LongA',
			})
		})
	}, from.data)
	RES.se_tan00.replay();
}
function stg5Fire3(from) {
	var to = UTIL.getOneAlive('Player');
	from.anim(100, function(d) {
		if (d.vx || d.vy)
			return true;
		var f0 = random(-PI/2, PI/2),
			t = random(0.05, 0.30),
			v = random(0.10, 0.20);
		range(1, 0, 1/4, function(f) {
			ieach(f ? [-t*f, t*f] : [0], function(i, f) {
				newDannmaku(from, to, 0, f0+f, v/Math.cos(f), 0, {
					color: 'b',
					tama: 'TamaA',
				})
			})
		})
		RES.se_tan00.replay();
	}, from.data)
}

function sakuyaFire1A(from, rads, count, interval) {
	var to = UTIL.getPlayerPos();
	count = count || 7;
	STORY.timeout(function(d, n) {
		var f0 = (n - 3.5) / count * (rads || 1);
		range(0.501, -0.5, 1 / count, function(f) {
			newDannmaku(from, to, 0, f*2.4+f0*2, 0.2, 0, {
				color: 'b',
				tama: 'Knife',
			})
		})
		RES.se_tan00.replay();
	}, interval || 150, null, count + 1)
}
function sakuyaFire1B(from, rads) {
	STORY.timeout(function(d, n) {
		var f0 = (n - 4.5) / 9 * (rads || 1);
		array(3, function(i) {
			range(0.501, -0.5, 1/4, function(f) {
				newDannmaku(from, null, 0, f0*3+f*0.18, 0.1+i*0.02, 0, {
					color: 'r',
					tama: 'LongB',
				})
			})
		})
	}, 50, null, 10)
	RES.se_power0.replay();
}
function sakuyaMove(from, fx, fy) {
	var ph = 1,
		dh = -1/500;
	from.anim(80, function(d) {
		d.opacity = ph;
		if (dh > 0 && (ph += dh*80) < 0) {
			dh = -dh;
			d.x = UTIL.getGamePosX(fx);
			d.y = UTIL.getGamePosX(fy);
		}
		if (dh < 0 && (ph += dh*80) > 1) {
			ph = 1;
			return true;
		}
	}, from.data)
}
function sakuyaSC0A(from) {
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, n) {
		array(2, function(i) {
			range(1, 0, 1/14, function(f) {
				var obj = newDannmaku(from, to, 0, f*PI2, 0.1+i*0.02, 0, {
					color: 'r',
					tama: 'LongB',
				})
				obj.runCircle = (function(run) {
					return function(dt, d) {
						if (d.x < GAME.rect.l || d.x > GAME.rect.r)
							d.vx = -d.vx;
						if (d.y < GAME.rect.t)
							d.vy = -d.vy;
					}
				})(obj.runCircle)
			})
		})
		RES.se_tan00.replay();
	}, 50, null, 15);
}
function sakuyaSC0B(from) {
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, n) {
		array(2, function(i) {
			range(0.5001, -0.5, 1/10, function(f) {
				newDannmaku(from, to, 0, f*PI, 0.15+i*0.05, 0, {
					color: 'b',
					tama: 'Knife',
				})
			})
		})
	}, 150, null, 5)
	RES.se_tan00.play();
}

function stg5Sec4() {
	STORY.timeout(function(d, n) {
		var to = UTIL.getOneAlive('Player');
		var obj = SPRITE.newObj('Enemy', {
			life: 20,
			x: UTIL.getGamePosX(n % 2 ? 0 : 1),
			y: UTIL.getGamePosY(random(0.1, 0.15)),
			vx: (n % 2 ? 1 : -1) * 0.2,
			vy: random(-0.02, 0.02),
			frames: RES.frames['Enemy3'+randin('AB')],
		})
		randin([
			stg5Fire4BL,
			stg5Fire4BC,
			stg5Fire4RL,
			stg5Fire4RC,
		])(obj)
		RES.se_tan00.replay();
	}, 250, null, 1000)
}
function stg5Fire4BL(from, to) {
	from.anim(400, function(d) {
		array(8, function() {
			newDannmaku(from, to, 0, random(-1, 1), random(0.05, 0.15), 0, {
				color: 'b',
				tama: 'LongA',
			})
		})
	}, from.data)
}
function stg5Fire4BC(from, to) {
	from.anim(500, function(d) {
		range(0.5001, -0.5, 1/5, function(f) {
			newDannmaku(from, to, 0, f*1.0, 0.1, 0, {
				color: 'b',
				tama: 'TamaMini',
			})
		})
	}, from.data)
}
function stg5Fire4RL(from, to) {
	from.anim(400, function(d) {
		range(0.5001, -0.5, 1/3, function(f) {
			newDannmaku(from, to, 0, f*0.6, 0.1, 0, {
				color: 'r',
				tama: 'LongB',
			})
		})
	}, from.data)
}
function stg5Fire4RC(from, to) {
	from.anim(100, function(d) {
		array(4, function(i) {
			newDannmaku(from, {
				data: { x:from.data.x0, y:from.data.y0 }
			}, 0, random(-PI/2, PI/2), random(0.05, 0.15), 0, {
				color: 'r',
				tama: 'TamaSmall',
			})
		})
	}, from.data)
}

function sakuyaFire2AC(from, rt, color, tama, interval) {
	var obj = SPRITE.newObj('Circle', {
		x: from.data.x,
		y: from.data.y,
		vx: 0.1 * Math.sin(rt),
		vy: 0.1 * Math.cos(rt),
		frames: RES.stg4frs.Circle,
		duration: 3000,
	})
	obj.anim(80, function(d) {
		decrease_object_speed(d, 0.94)
	}, obj.data)
	sakuyaFire2A1(obj, color, tama, interval);
}
function sakuyaFire2A1(from, color, tama, interval) {
	var f0 = random(PI2), df = randin([1, -1])*0.5;
	from.anim(interval || 100, function(d) {
		if (!this.is_dying) range(0.5001, -0.5, 1/4, function(f) {
			var t = f * 0.08;
			var obj = newDannmaku(from, null, 0, f0+t, 0.15/Math.cos(t), 0, {
				no_frame: true,
				color: color || 'g',
				tama: tama || 'LongC',
			})
			if (tama == 'LongB') obj.runCircle = function(dt, d) {
				if (d.x < GAME.rect.l || d.x > GAME.rect.r)
					d.vx = -d.vx;
				if (d.y < GAME.rect.t)
					d.vy = -d.vy;
			}
		})
		f0 += df;
	}, from.data)
	RES.se_tan00.replay();
}
function sakuyaFire2A(from) {
	ieach([
		[ 0.3, 'g'],
		[ 0.7, 'g'],
		[ 1.1, 'b'],
		[ 1.5, 'b'],
		[-0.3, 'b'],
		[-0.7, 'b'],
		[-1.1, 'g'],
		[-1.5, 'g'],
	], function(i, v) {
		sakuyaFire2AC(from, v[0], v[1])
	})
}
function sakuyaFire2B(from) {
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, n) {
		array(2, function(i) {
			range(1, 0, 1/15, function(f) {
				newDannmaku(from, to, 0, f*PI2+i*PI2/30, 0.15+i*0.05, 0, {
					color: 'b',
					tama: 'Knife',
				})
			})
		})
	}, 500, null, 4)
}
function sakuyaFire2C1(from, rt, speed) {
	array(8, function(i) {
		i = 8 - i;
		var v = speed*(1+0.15*i);
		newDannmaku(from, null, 0, rt, v, 0, {
			vx: v * Math.sin(rt),
			vy: v * Math.cos(rt),
			color: 'm',
			tama: 'Knife',
		})
	})
}
function sakuyaFire2C(from) {
	var f0 = 0.05;
	STORY.timeout(function(d, n) {
		ieach([1, -1], function(i, x) {
			sakuyaFire2C1(from, f0*0.5*x, 0.12)
			sakuyaFire2C1(from, f0*1.5*x, 0.12-f0*0.01)
		})
		f0 += 0.3;
		RES.se_tan00.replay();
	}, 150, null, 12)
}
function sakuyaSC1A(from) {
	array(20, function() {
		newDannmaku(from, null, 0, random(-PI/2, PI/2), random(0.06, 0.3), 0, {
			no_frame: true,
			color: 'r',
			tama: 'TamaMax',
			blend: 'lighter',
		})
	})
}
function sakuyaSC1(from, freeze, release) {
	STORY.timeout(function(d, n) {
		SPRITE.eachObj(function(i, v) {
			v.disabled = true;
		}, 'Dannmaku')
		SPRITE.eachObj(function(i, v) {
			if (!v.is_creating && !this.is_dying)
				v.disabled = true;
		}, 'Player')
		var to = UTIL.getOneAlive('Player') ||
			{ data:UTIL.getGamePosXY(0.5, 0.9) };
		STORY.timeout(function(d, n) {
			var r = sqrt_sum(from.data.x - to.data.x, from.data.y - to.data.y);
			range(0.5001, -0.5, 1/8, function(f) {
				var fact = n*0.07+0.1,
					dist = n % 2 ? r*fact : r*(1-fact),
					rads = n % 2 ? (1.5-n*0.05) : (1+n*0.08);
				range(0.5001, -0.5, 1/2, function(g) {
					var obj = newDannmaku(n%2?from:to, n%2?to:from, dist, f*rads, 0.1, 0, {
						no_frame: true,
						color: 'b',
						tama: 'Knife',
						ph: 1,
					})
					obj.disabled = true;
					var d = obj.data;
					redirect_object(d, to.data, 0.1);
					rotate_object_speed(d, g*2);
				})
			})
			RES.se_tan00.replay();
		}, 150, null, 10)
	}, freeze || 1000)
	STORY.timeout(function(d, n) {
		SPRITE.eachObj(function(i, v) {
			v.disabled = false;
		}, 'Dannmaku')
		SPRITE.eachObj(function(i, v) {
			v.disabled = false;
		}, 'Player')
	}, release || 3000)
}
function sakuyaFire3A(from) {
	ieach([
		[ 0.7, 'r'],
		[ 1.5, 'b'],
		[-0.7, 'b'],
		[-1.5, 'r'],
	], function(i, v) {
		sakuyaFire2AC(from, v[0], v[1], 'LongB', 200)
	})
}
function sakuyaSC2A(from) {
	array(4, function(i) {
		ieach([16, 18], function(j, n) {
			range(1, 0, 1/n, function(f) {
				newDannmaku(from, null, 0, f*PI2+PI/2, 0.08+i*0.02, 0, {
					no_frame: true,
					tama: 'Fire',
				})
			})
		})
	})
	RES.se_tan00.play();
}
function sakuyaSC2C(from) {
	SPRITE.eachObj(function(i, v) {
		var d = v.data;
		if (d.tama == 'Fire')
			rotate_object_speed(d, random(-2, 2))
		else if (d.tama == 'Knife' && random(1) > 0.2) STORY.timeout(function() {
			UTIL.addFrameAnim(v, RES.frames.Knife[5]);
			rotate_object_speed(d, random(-2, 2));
		}, random(50, 500))
	}, 'Dannmaku')
}
function sakuyaFire4(from, color) {
	var pl = UTIL.getOneAlive('Player'),
		to = pl && { data:{ x:pl.data.x, y:pl.data.y } };
	STORY.timeout(function(d, n) {
		array(2, function(i) {
			range(1, 0, 1/5, function(f) {
				var obj = newDannmaku(from, to, 0, f*PI2+n*0.1, 0.1+i*0.02, 0, {
					color: color || 'b',
					tama: 'Knife',
				})
				obj.runCircle = (function(run) {
					return function(dt, d) {
						if (d.x < GAME.rect.l || d.x > GAME.rect.r)
							d.vx = -d.vx;
						if (d.y < GAME.rect.t)
							d.vy = -d.vy;
						run.call(this, dt, d);
					}
				})(obj.runCircle)
			})
		})
		RES.se_tan00.replay();
	}, 100, null, 8)
}
function sakuyaSC3A(from) {
	var to = UTIL.getPlayerPos();
	STORY.timeout(function(d, n) {
		array(3, function(i) {
			i = 3 - i;
			range(1, 0, 1/15, function(f) {
				newDannmaku(from, to, 0, f*PI2+n*0.06, 0.1+i*0.02, 0, {
					color: 'b',
					tama: 'Knife',
				})
			})
		})
		RES.se_tan00.replay();
	}, 100, null, 8)
}
function sakuyaSC3B(from) {
	var to = UTIL.getPlayerPos();
	STORY.timeout(function(d, n) {
		var f0 = (7 - n) / 8 * PI2;
		array(4, function(i) {
			i = 4 - i;
			range(0.5001, -0.5, 1/7, function(f) {
				newDannmaku(from, to, 0, f0+f*0.25, 0.12+i*0.02, 0, {
					color: 'r',
					tama: 'Knife',
				})
			})
		})
		RES.se_tan00.replay();
	}, 50, null, 8)
}
function sakuyaSC3C(from) {
	SPRITE.eachObj(function(i, v) {
		v.disabled = true;
		if (v.data.tama == 'Knife' && random(1) > 0.3) STORY.timeout(function() {
			UTIL.addFrameAnim(v, RES.frames.Knife[5]);
			rotate_object_speed(v.data, random(-2, 2));
		}, random(500, 1500));
	}, 'Dannmaku')
	SPRITE.eachObj(function(i, v) {
		v.disabled = true;
	}, 'Player')
	STORY.timeout(function() {
		SPRITE.eachObj(function(i, v) {
			v.disabled = false;
		}, 'Dannmaku')
		SPRITE.eachObj(function(i, v) {
			v.disabled = false;
		}, 'Player')
	}, 2000)
}

function newStage5(difficulty, next) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg5'),
		bganim: newStg5BgAnim,
		title: 'STAGE 5',
		text: RES.st_stg5_title,
	});
	newStgSecsFromList(stage, [
		{ duration:4000, init:stg5Sec1, args:[0.4], },
		{ duration:3000, init:stg5Sec2, args:['s5A1'], },
		{ duration:4000, init:stg5Sec1, args:[0.1], },
		{ duration:3000, init:stg5Sec2, args:['s5A2'], },
		{ duration:1000, },
		{ duration:10000, init:newSecList, args:[
			[stg5Sec1, [0.35]],
			[stg5Sec1, [0.15], 3000],
			[stg5Sec2, ['s5A1'], 2000],
			[stg5Sec2, ['s5A2'], 5000],
			[stg5Sec2, ['s5A3'], 8000],
			[stg5Sec2, ['s5A4'], 11000],
		], },
		{ duration:10000, init:newSecList, args:[
			[stg5Sec1, [0.1, 'b'], 0],
			[stg5Sec1, [0.3, 'r'], 1000],
			[stg5Sec1, [0.4, 'g'], 2000],
		], },
		{ duration:10000, init:newSecList, args:[
			[stg5Sec3, [0.5], 0],
			[stg5Sec3, [0.1], 1000],
			[stg5Sec3, [0.9], 2000],
		], next:'sakuyaEnter1', },
		{ duration:18000, init:stg5Sec4, name:'secRestart', },
		{ duration:10000, init:newSecList, args:[
			[stg5Sec1, [0.1, 'b', 5], 0],
			[stg5Sec1, [0.2, 'b', 5], 1500],
			[stg5Sec1, [0.3, 'b', 5], 3000],
		], },
		{ duration:10000, init:newSecList, args:[
			[stg5Sec1, [0.1, 'b', 5], 0],
			[stg5Sec1, [0.2, 'b', 5], 500],
			[stg5Sec1, [0.3, 'b', 5], 1000],
			[stg5Sec1, [0.4, 'b', 5], 1500],
		], next:'sakuyaEnter2' },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg5_diag1,  pos:'.fr.dg', face:'.f9a', clear:true, },
		{ text:RES.st_stg5_diag2,  pos:'.fr.dg', face:'.f9a.f2', next:'sakuyaFire1', ended:true, },
		{ text:RES.st_stg5_diag3,  pos:'.fr.dg', face:'.f9a.f2', name:'sakuyaSpeak', },
		{ text:RES.st_stg5_diag4,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg5_diag5,  pos:'.fr.dg', face:'.f9a.f2', },
		{ text:RES.st_stg5_diag6,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg5_diag7,  pos:'.fr.dg', face:'.f9a.f2', },
		{ text:RES.st_stg5_diag8,  pos:'.fr.dg', face:'.f9a.f2', },
		{ text:RES.st_stg5_diag9,  pos:'.fl.dg', face:'.f0a', },
		{ text:RES.st_stg5_diag10, pos:'.fr.dg', face:'.f9a', },
		{ text:RES.st_stg5_diag11, pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg5_diag12, pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg5_diag13, pos:'.fl.dg', face:'.f0a.f2', },
		{ text:RES.st_stg5_diag14, pos:'.fr.dg', face:'.f9a.f2', },
		{ text:RES.st_stg5_diag15, pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg5_diag16, pos:'.fr.dg', face:'.f9a.f2', },
		{ text:RES.st_stg5_diag17, pos:'.fl.dg', face:'.f0a.f2', },
		{ text:RES.st_stg5_diag18, pos:'.fr.dg', face:'.f9a', },
		{ text:RES.st_stg5_diag19, pos:'.fl.dg', face:'.f0b', },
		{ text:RES.st_stg5_diag20, pos:'.fr.dg', face:'.f9a.f2', },
		{ text:RES.st_stg5_diag21, pos:'.fr.dg', face:'.f9a', next:'sakuyaFire2', ended:true, },
		{ text:RES.st_stg5_diag22, pos:'.fl.dg', face:'.f0b.f2', name:'sakuyaSpeak2', },
		{ text:RES.st_stg5_diag23, pos:'.fr.dg', face:'.f9b.f2', next:'score', ended:true, },
	], newStgSecDiag, 'diag');
	newStgSecsFromList(stage, [
		{
			boss: 'sakuya',
			name: 'sakuyaEnter1',
			pathnodes: [
				{ fx:0.1, fy:0.0, v:0.2, },
				{ fx:0.5, fy:0.3, },
			],
			duration: 500,
			next: 'diag0',
			no_countdown: true,
			invinc: true,
			disable_fire: true,
		},
		{
			name: 'sakuyaFire1',
			duration: 40000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:1500, fn:sakuyaFire1A, args:[ 1], });
				d.push({ t:500,  fn:sakuyaFire1B, args:[ 1], });
				d.push({ t:1500, fn:sakuyaFire1A, args:[-1], });
				d.push({ t:500,  fn:sakuyaFire1B, args:[-1], });
			}, [
				{ v:0.2, },
			]),
			fail_next: 'boss3',
		},
		{
			scname: RES.st_stg5_sc0,
			duration: 40000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fn:sakuyaMove, args:[random(0.1, 0.9), random(0.05, 0.4)], });
				d.push({ t:100, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:1500, fn:sakuyaSC0A, });
				d.push({ t:500, fn:sakuyaMove, args:[random(0.1, 0.9), random(0.05, 0.4)], });
				d.push({ t:1000, fn:sakuyaSC0B, });
			}, [
				{ v:0.15, },
			]),
			life_pt: 1,
		},
		{
			duration: 500,
			pathnodes: [
				{ v:0.2 },
				{ t:1000 },
				{ fx:0.5, fy:-1 },
			],
			invinc: true,
			disable_fire: true,
			next: 'secRestart',
		},
		{
			name: 'sakuyaEnter2',
			pathnodes: [
				{ fx:0.0, fy:0.2, v:0.2, },
				{ fx:0.5, fy:0.3, },
			],
			duration: 500,
			next: 'sakuyaSpeak',
			no_countdown: true,
			invinc: true,
			disable_fire: true,
		},
		{
			name: 'sakuyaFire2',
			duration: 45000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:500, fn:sakuyaFire2A, });
				d.push({ t:4000, fn:sakuyaFire2B, });
				d.push({ t:4000, fn:sakuyaFire2C, });
			}, [
				{ v:0.2, },
			]),
		},
		{
			duration: 30000,
			scname: RES.st_stg5_sc1,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:3000, fn:newBossCloud })
				d.push({ t:500,  fn:sakuyaSC1A });
				d.push({ t:500,  fn:sakuyaSC1 });
				d.push({ t:500,  fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:1000 });
			}, [
				{ v:0.2, },
			]),
		},
		{
			duration: 45000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:500, fn:sakuyaFire3A, });
				d.push({ t:4000, fn:sakuyaFire2B, });
			}, [
				{ v:0.1, },
			]),
		},
		{
			duration: 30000,
			scname: RES.st_stg5_sc2,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:3000, fn:newBossCloud });
				d.push({ t:500,  fn:sakuyaSC2A });
				d.push({ t:500,  fn:sakuyaSC1, args:[1000, 3500] });
				d.push({ t:2000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:500,  fn:sakuyaSC2C });
			}, [
				{ v:0.2, },
			]),
		},
		{
			duration: 45000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:1000, fn:sakuyaFire4, args:['b'] });
				d.push({ t:NaN,  fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:200,  fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:1000, fn:sakuyaFire4, args:['r'] });
				d.push({ t:1000 });
			}, [
				{ v:0.2, },
			]),
		},
		{
			duration: 30000,
			scname: RES.st_stg5_sc3,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:900, fn:sakuyaSC3A });
				d.push({ t:500, fn:sakuyaSC3B });
				d.push({ t:300,  fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:3000, fn:sakuyaSC3C });
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3 },
			]),
			next:'bossKill',
		},
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'sakuyaSpeak2', },
	], newStgSecBossKill, 'bossKill');
	stage.score = newStgSecScore('ended');
	stage.ended = next ? newStgSecLoadNew(newStage6, difficulty, next) : newStgSecOver();
	return stage;
}