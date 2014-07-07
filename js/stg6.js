function stg6Sec1(pth, color) {
	STORY.timeout(function(d, n) {
		var obj = SPRITE.newObj('Enemy', {
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
			x: UTIL.getGamePosX(fx),
			y: UTIL.getGamePosY(fy),
			vx: [0.1, -0.1][fx] || 0,
			vy: [0.1, -0.1][fy] || 0,
			frames: RES.frames.Enemy3A,
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
					rotate_object_speed(d, t0, 0.2);
					return true;
				}
			}, obj.data)
		})
	}, 50, null, 15)
}

function newStage6(difficulty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('secRestart', {
		bgelem: $('.bg-stg6'),
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
		{ duration:5000, name:'secRestart', next:'reimuSpeak'},
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
		},
		{
			duration: 500,
			pathnodes: [
				{ v:0.2 },
				{ fn:function(from) { from.die() } },
			],
			no_countdown: true,
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
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'sakuyaSpeak2', },
	], newStgSecBossKill, 'bossKill');
	stage.score = newStgSecScore('ended');
	stage.ended = newStgSecOver();
	return stage;
}
