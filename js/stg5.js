function newStg5BgAnim(bg) {
}

function stg5Sec1(fx, color) {
	ieach([fx, 1-fx], function(i, fx) {
		var obj = SPRITE.newObj('Enemy', {
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
			pathnodes: RES.path[pth],
			frames: RES.frames.Enemy3A,
		})
		stg5Fire2(obj);
	}, 600, null, 8)
}
function stg5Sec3(fx) {
	var obj = SPRITE.newObj('Enemy', {
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
	}, 3500, obj.data)
}

function stg5Fire1(from, color) {
	var pl = UTIL.getOneAlive('Player'),
		to = { data:{ x:pl.data.x, y:pl.data.y } };
		n = 8;
	from.anim(100, function(d) {
		if (n-- > 0) range(1, 0, 1/40, function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.2-n*0.02, 0, {
				color: color || 'b',
				tama: 'TamaB',
			})
		})
	}, from.data)
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
}
function stg5Fire3(from) {
	var to = UTIL.getOneAlive('Player');
	from.anim(100, function(d) {
		if (d.vx || d.vy)
			return true;
		var f0 = random(-PI/2, PI/2),
			t = random(0.05, 0.30),
			v = random(0.10, 0.15);
		range(1, 0, 1/4, function(f) {
			ieach(f ? [-t*f, t*f] : [0], function(i, f) {
				newDannmaku(from, to, 0, f0+f, v/Math.cos(f), 0, {
					color: 'b',
					tama: 'TamaA',
				})
			})
		})
	}, from.data)
}

function newStage5(difficulty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec7', {
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
		{ text:RES.st_stg5_diag21, pos:'.fr.dg', face:'.f9a', ended:true, },
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
		}
	], newStgSecBoss, 'boss');
	return stage;
}