function newStg6BgAnim(bg) {
	var gnd = $i('#stg6gnd'),
		dvy = 0;
	bg.anim(100, function(d) {
		if (gnd.offsetY > -500 && gnd.speedY > 0) {
			if (!dvy)
				dvy = (gnd.speedY*gnd.speedY) / (-2*gnd.offsetY)
			if (gnd.speedY)
				gnd.speedY = decrease_to_zero(gnd.speedY, dvy*100);
			if (gnd.offsetY + gnd.speedY*100 > 0)
				gnd.speedY = 0;
			if (gnd.speedY == 0)
				return true;
		}
	}, bg.data)
}

function stg6Sec1(pth, color) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
			life: 2,
			pathnodes: RES.path[pth],
			frames: RES.frames.Enemy2A,
		})
		stg6Fire1(obj, color)
	}, 600, null, 8)
}
function stg6Sec2() {
	ieach(arguments, function(i, a) {
		var fx = a[0], fy = a[1];
		var obj = SPRITE.newObj('Enemy', {
			life: 20,
			x: UTIL.getGamePosX(fx),
			y: UTIL.getGamePosY(fy),
			vx: [0.1, -0.1][fx] || 0,
			vy: [0.1, -0.1][fy] || 0,
			frames: RES.frames.Enemy3B,
		})
		obj.anim(500, function(d) {
			if (d.age) {
				d.vx = random(-0.02, 0.02);
				d.vy = random(0.1, 0.2);
				stg6Fire2(this);
				return true;
			}
		}, obj.data)
	})
}

function stg6Fire1(from, color) {
	var to = UTIL.getOneAlive('Player'),
		n = 5;
	from.anim(500, function() {
		if (n-- > 0) array(10, function() {
			newDannmaku(from, to, 0, random(PI2), random(0.1, 0.2), 0, {
				color: color,
				tama: 'LongA',
			})
		})
	})
}
function stg6Fire2(from) {
	var to = UTIL.getOneAlive('Player');
	array(2, function(i) {
		range(1, 0, 1/50, function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.1+i*0.04, 0, {
				color: 'b',
				tama: 'LongA',
			})
		})
	})
	RES.se_tan00.replay();
}

function sakuyaFire1C(from, rads) {
	STORY.timeout(function(d, n) {
		var f0 = random(-0.8, 0.8) * (rads || 1),
			t0 = random(-PI, PI);
		range(0.501, -0.5, 1/8, function(f) {
			var obj = newDannmaku(from, null, 0, f0*3+f*0.18, 0.2, 0, {
				color: 'r',
				tama: 'LongB',
			})
			obj.anim(80, function(d) {
				if (d.age < 1000)
					decrease_object_speed(d, 0.95);
				else {
					rotate_object_speed(d, t0, 0.1);
					return true;
				}
			}, obj.data)
		})
	}, 50, null, 15)
}
function sakuya6SC0(from) {
	STORY.timeout(function(d, n) {
		array(10, function() {
			newDannmaku(from, null, 0, random(PI2), random(0.15, 0.35), 0, {
				color: 'b',
				tama: 'TamaB',
			})
		})
	}, 30, null, 1000)
	STORY.timeout(function() {
		RES.se_tan00.replay();
	}, 200, null, 1000);
}

function remiliaFire1(from) {
	STORY.timeout(function(d, n) {
		range(1, 0, 1/6, function(f) {
			newDannmaku(from, null, 0, f*PI2+n*0.3, 0.25, 0, {
				color: 'r',
				tama: 'TamaMax',
				blend: 'lighter',
				no_frame: true,
			})
		})
		range(1, 0, 1/8, function(f) {
			newDannmaku(from, null, 0, f*PI2+n*0.2, 0.15, 0, {
				color: 'b',
				tama: 'TamaLarge',
				no_frame: true,
			})
		})
		range(0.5001, -0.5, 1/4, function(f) {
			newDannmaku(from, null, 0, f*0.3+n*0.4, 0.12/Math.cos(f*0.1), 0, {
				color: 'b',
				tama: 'TamaB',
				no_frame: true,
			})
		})
		if (n % 2 == 0)
			RES.se_tan00.replay();
	}, 120, null, 40)
}
function remiliaSC1(from) {
	var f0 = random(PI2);
	STORY.timeout(function(d, n) {
		var i = 2 - n,
			r = 50 + 100 * i,
			s = [0, 0.8, -1.2][i];
		array(16, function(j) {
			var f = j / 16,
				t = f0 + f*PI2,
				x = from.data.x + r*Math.cos(t),
				y = from.data.y + r*Math.sin(t),
				d = 500,
				u = t + s*(j % 2 ? 1 : -1),
				dx = d*Math.cos(u),
				dy = d*Math.sin(u);
			newLaserWithDot(from, x, y, dx, dy, 20, {
				color: 'c',
				frames: RES.frames.TamaB[8],
				dh: 1/1500,
				duration: 3000,
			})
		})
	}, 50, null, 3)
	STORY.timeout(function(d, n) {
		range(1, 0, 1/12, function(f) {
			newDannmaku(from, null, 0, f*PI2-n*0.12+0.1, 0.18, 0, {
				color: 'y',
				tama: 'TamaMax',
				blend: 'lighter',
				no_frame: true,
			})
		})
		array(2, function(i) {
			range(1, 0, 1/14, function(f) {
				newDannmaku(from, null, 0, f*PI2+n*0.08, 0.18+i*0.04, 0, {
					color: 'b',
					tama: 'TamaLarge',
					no_frame: true,
				})
			})
		})
		RES.se_tan00.replay();
	}, 250, null, 4)
}
function remiliaFire2A(from, to, t) {
	newDannmaku(from, to, 0, t, 0.4, 0, {
		color: 'r',
		tama: 'TamaMax',
		blend: 'lighter',
	})
	array(8, function() {
		newDannmaku(from, to, 0, t+random(-0.5, 0.5), random(0.15, 0.35), 0, {
			color: 'r',
			tama: 'TamaLarge',
		})
	})
	array(16, function() {
		newDannmaku(from, to, 0, t+random(-1, 1), random(0.05, 0.25), 0, {
			color: 'r',
			tama: 'TamaA',
		})
	})
}
function remiliaFire2(from, rads, interval, count1, count2) {
	var to = rads ? null : UTIL.getOneAlive('Player');
	STORY.timeout(function(d, n) {
		var t = (3.5 - n) / 7 * rads;
		remiliaFire2A(from, to, t)
	}, interval || 160, null, 8)
	RES.se_tan00.play();
}
function remiliaSC2(from) {
	STORY.timeout(function(d, n) {
		array(30, function(j) {
			var f = j / 30;
			var obj = newDannmaku(from, null, 0, f*PI2, 0.12, 0, {
				color: 'r',
				tama: 'Knife',
				no_frame: true,
			})
			obj.anim(80, function(d) {
				if (d.age < 2100)
					rotate_object_speed(d, j % 2 ? 0.15 : -0.15);
				else
					return true;
			}, obj.data)
		})
		range(1, 0, 1/36, function(f) {
			var obj = newDannmaku(from, null, 0, f*PI2, 0.08, 0, {
				color: 'r',
				tama: 'LongA',
				no_frame: true,
				reflect: randin([0, 5, 5]),
			})
			obj.runCircle = function(dt, d) {
				if (d.x < GAME.rect.l || d.x > GAME.rect.r)
					if (d.reflect-- > 0) d.vx = -d.vx;
				if (d.y < GAME.rect.t)
					d.vy = -d.vy;
			}
		})
	}, 250, null, 5)
}
function remiliaFire3(from, direction) {
	STORY.timeout(function(d, n) {
		array(2, function(i) {
			range(1, 0, 1/4, function(f) {
				newDannmaku(from, null, 0, f*PI2+n*direction, 0.25+i*0.05, 0, {
					color: direction > 0 ? 'b' : 'r',
					tama: 'Knife',
				})
			})
		})
		if (n % 6 == 0)
			RES.se_tan01.replay();
	}, 50, null, 60)
}
function remiliaSC3A(from, ax, ay, delay) {
	var obj = newDannmaku(from, null, 0, 0, 0, 0, {
		dh: 1/500,
		color: 'r',
		tama: 'TamaB',
	})
	obj.anim(100, function(d) {
		if (d.age > delay) {
			d.vx += ax;
			d.vy += ay;
		}
		if (d.age > delay + 1000)
			return true;
	}, obj.data)
}
function remiliaSC3(from, rads, count, rot, f0) {
	var to = UTIL.getOneAlive('Player'),
		ph = random(PI2);
	range(0.5001, -0.5, 1/(count || 7), function(f) {
		var obj = newDannmaku(from, to, 0, (f0 || 0) + f*(rads || 2), 0.3, 0, {
			color: 'b',
			tama: 'TamaMax',
			no_frame: true,
		})
		var delay = 2000;
		obj.anim(70, function(d) {
			var t = d.age*0.005 + ph,
				v = 0.004;
			if (rot)
				rotate_object_speed(d, rot);
			if (d.age && !this.is_dying)
				remiliaSC3A(this, Math.cos(t)*v, Math.sin(t)*v, delay-=100);
		}, obj.data)
	})
	RES.se_tan00.play();
}
function remiliaShow(from, show) {
	var d = from.data;
	if (!from.frames_old)
		from.frames_old = from.frames;
	if (show) {
		from.is_invinc = false;
		UTIL.addFrameAnim(from, from.frames_old);
	}
	else {
		from.is_invinc = true;
		UTIL.addFrameAnim(from, RES.frames.Bat);
		STORY.timeout(function() {
			array(5, function() {
				SPRITE.newObj('Circle', {
					x: d.x,
					y: d.y,
					vx: random(-0.2, 0.2),
					vy: random(0.15, 0.3),
					frames: RES.frames.Bat,
				})
			})
		}, 50, null, 20)
	}
}
function remiliaFire4A(from) {
	STORY.timeout(function(d, n) {
		array(15, function() {
			var obj = newDannmaku(from, null, 0, random(PI2), random(0.05, 0.15), 0, {
				color: 'r',
				tama: 'LongA',
				no_frame: true,
			})
			obj.anim(80, function(d) {
				d.vy += 0.01;
			}, obj.data)
		})
		if (n % 3 == 0)
			RES.se_kira00.replay();
	}, 100, null, 30)
}
function remiliaFire4B(from) {
	var f0 = random(-1, 1);
	STORY.timeout(function(d, n) {
		f0 += random(-0.03, 0.03);
		range(0.5001, -0.5, 1/12, function(f) {
			newDannmaku(from, null, 0, f0+f*2.5, 0.4, 0, {
				color: 'r',
				tama: 'TamaMax',
				blend: 'lighter',
			})
		})
		if (n % 2 == 0)
			RES.se_kira01.replay();
	}, 200, null, 16)
}
function remiliaFire4C(from) {
	var f0 = random(PI2);
	STORY.timeout(function(d, n) {
		f0 += random(-0.03, 0.03);
		array(2, function(i) {
			range(1, 0, 1/30, function(f) {
				newDannmaku(from, null, 0, f0+f*PI2, 0.3+i*0.05, 0, {
					tama: 'Fire',
				})
			})
		})
		if (n % 3 == 0)
			RES.se_kira00.replay();
	}, 150, null, 20)
}
function remiliaSC4(from) {
	var to = UTIL.getOneAlive('Player');
	STORY.timeout(function(d, n) {
		remiliaFire2A(from, to, Math.min(n-20, 0)/20*PI2)
	}, 150, null, 28)
}

function newStage6(difficulty, next) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg6'),
		bganim: newStg6BgAnim,
		title: 'STAGE 6',
		text: RES.st_stg6_title,
	});
	newStgSecsFromList(stage, [
		{ duration:10000, init:newSecList, args:[
			[stg6Sec1, ['s3A1', 'b'], ],
			[stg6Sec1, ['s3A2', 'b'], 200],
			[stg6Sec1, ['s3A3', 'r'], 400],
			[stg6Sec1, ['s3A4', 'r'], 600],
		], },
		{ duration:2000, init:stg6Sec2, args:[[0, 0.2], [1, 0.2]] },
		{ duration:2000, init:stg6Sec2, args:[[0.4, 0], [0.6, 0]] },
		{ duration:2000, init:stg6Sec2, args:[[0, 0.4], [1, 0.4]] },
		{ duration:2000, },
		{ duration:500, init:stg6Sec2, args:[[0, 0.2], [1, 0.2]] },
		{ duration:500, init:stg6Sec2, args:[[0, 0.4], [1, 0.4]] },
		{ duration:500, init:stg6Sec2, args:[[0, 0.25], [1, 0.25]] },
		{ duration:500, init:stg6Sec2, args:[[0, 0.15], [1, 0.15]] },
		{ duration:500, init:stg6Sec2, args:[[0, 0.1], [1, 0.1]] },
		{ duration:5000, next:'sakuyaEnter1' },
		{ duration:5000, name:'secRestart', next:'reimuSpeak' },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg6_diag1,  pos:'.fr.dg', face:'.f9a.f2', clear:true },
		{ text:RES.st_stg6_diag2,  pos:'.fl.dg', face:'.f0a.f2', next:'sakuyaFire1', ended:true },
		{ text:RES.st_stg6_diag3,  pos:'.fl.dg', face:'.f0a.f2', name:'reimuSpeak', clear:true, },
		{ text:RES.st_stg6_diag4,  pos:'.fl.dg', face:'.f0a.f2', next:'remiliaEnter', },
		{ text:RES.st_stg6_diag5,  pos:'.fr.dg', face:'.f10a', name:'remiliaSpeak', },
		{ text:RES.st_stg6_diag6,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg6_diag7,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag8,  pos:'.fl.dg', face:'.f0b', },
		{ text:RES.st_stg6_diag9,  pos:'.fr.dg', face:'.f10a', },
		{ text:RES.st_stg6_diag10,  pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg6_diag11,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag12,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg6_diag13,  pos:'.fr.dg', face:'.f10a', },
		{ text:RES.st_stg6_diag14,  pos:'.fr.dg', face:'.f10a', },
		{ text:RES.st_stg6_diag15,  pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg6_diag16,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag17,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag18,  pos:'.fl.dg', face:'.f0b', },
		{ text:RES.st_stg6_diag19,  pos:'.fl.dg', face:'.f0b', },
		{ text:RES.st_stg6_diag20,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag21,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag22,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg6_diag23,  pos:'.fr.dg', face:'.f10a', },
		{ text:RES.st_stg6_diag24,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag25,  pos:'.fl.dg', face:'.f0c.f2', },
		{ text:RES.st_stg6_diag26,  pos:'.fr.dg', face:'.f10a', },
		{ text:RES.st_stg6_diag27,  pos:'.fl.dg', face:'.f0c', },
		{ text:RES.st_stg6_diag28,  pos:'.fr.dg', face:'.f10b', },
		{ text:RES.st_stg6_diag29,  pos:'.fl.dg', face:'.f0a.f2', next:'remiliaFire', ended:true, },
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
			duration: 20000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				d.push({ t:1500, fn:sakuyaFire1A, args:[ 0.06, 11, 75], });
				d.push({ t:500,  fn:sakuyaFire1C, args:[ 1], });
				d.push({ t:1500, fn:sakuyaFire1A, args:[-0.06, 11, 75], });
				d.push({ t:500,  fn:sakuyaFire1C, args:[-1], });
			}, [
				{ v:0.2, },
			]),
			fail_next: 'boss3',
		},
		{
			scname: RES.st_stg6_sc0,
			duration: 15000,
			pathnodes: [
				{ v:0.1, },
				{ fx:0.5, fy:0.2, },
				{ fn:sakuya6SC0, },
			],
			bomb_pt: 1,
		},
		{
			duration: 500,
			pathnodes: [
				{ v:0.2 },
				{ fn:function(from) { from.die() } },
			],
			invinc: true,
			disable_fire: true,
			next: 'secRestart',
		},
		{
			boss: 'remilia',
			name: 'remiliaEnter',
			pathnodes: [
				{ fx:0.0, fy:0.2, v:0.2, },
				{ fx:0.5, fy:0.3, },
			],
			duration: 500,
			next: 'remiliaSpeak',
			no_countdown: true,
			invinc: true,
			disable_fire: true,
		},
		{
			name: 'remiliaFire',
			duration: 45000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:2000, fn:remiliaFire1, });
				d.push({ t:3000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3, },
			]),
		},
		{
			scname: RES.st_stg6_sc1,
			duration: 40000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fn:newBossCloud, });
				d.push({ t:2000, fn:remiliaSC1, });
				d.push({ t:3000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3 },
			]),
		},
		{
			duration: 45000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:2000, fx:random(0.1, 0.9), fy:random(0.1, 0.3) });
				d.push({ t:1000, fn:remiliaFire2, args:[0], });
				d.push({ t:2000, fx:random(0.1, 0.9), fy:random(0.1, 0.3) });
				d.push({ t:1000, fn:remiliaFire2, args:[i % 2 ? -3 : 3], });
			}, [
				{ v:0.2, },
			]),
		},
		{
			scname: RES.st_stg6_sc2,
			duration: 40000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:3000, fn:remiliaSC2, });
				d.push({ t:1000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3 },
			]),
		},
		{
			duration: 45000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:3000, fn:remiliaFire3, args:[ 0.1], });
				d.push({ t:1000, fx:random(0.1, 0.9), fy:random(0.1, 0.3) });
				d.push({ t:3000, fn:remiliaFire3, args:[-0.1], });
				d.push({ t:1000, fx:random(0.1, 0.9), fy:random(0.1, 0.3) });
			}, [
				{ v:0.2, },
			]),
		},
		{
			scname: RES.st_stg6_sc3,
			duration: 40000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:500, fn:newBossCloud, });
				d.push({ t:3000, fn:remiliaSC3, });
				d.push({ t:1000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3 },
			]),
		},
		{
			duration: 60000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:800, fn:newBossCloud, });
				d.push({ t:200, fn:remiliaShow, args:[false], });
				d.push({ t:200, fn:[remiliaFire4A, remiliaFire4B, remiliaFire4C][i % 3], });
				array(5, function() {
					d.push({ t:500, fx:random(0.1, 0.9), fy:random(0.1, 0.3) });
				})
				d.push({ t:500 })
				d.push({ t:500, fn:remiliaShow, args:[true], });
			}, [
				{ v:0.3, },
			]),
		},
		{
			scname: RES.st_stg6_sc4,
			duration: 30000,
			pathnodes: ieach(range(15), function(i, j, d) {
				d.push({ t:800, fn:newBossCloud, });
				d.push({ t:2000, fn:remiliaSC4, });
				d.push({ t:3000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3, fn:remiliaShow, args:[true] },
			]),
		},
		{
			scname: RES.st_stg6_sc5,
			duration: 120000,
			life: 1000,
			pathnodes: ieach(range(30), function(i, j, d) {
				d.push({ t:1000, fn:remiliaSC3, args:[PI2/16*15, 16, i % 2 ? 0.08 : -0.08], });
				d.push({ t:2000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				if (i % 4 == 0) {
					var t = i % 8 ? 0.02 : -0.02;
					array(4, function(i) {
						d.push({ t:200, fn:remiliaSC3, args:[PI2/8*8, 8, t, i*0.2], });
					})
					d.push({ t:2000, fx:random(0.1, 0.9), fy:random(0.05, 0.4) });
				}
			}, [
				{ v:0.2, },
				{ fx:0.5, fy:0.3 },
			]),
			next: 'bossKill',
		},
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'score', },
	], newStgSecBossKill, 'bossKill');
	stage.score = newStgSecScore('ended');
	stage.ended = newStgSecOver();
	return stage;
}
