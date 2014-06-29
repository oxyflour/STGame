function newStg4BgAnim(bg) {
}
function newStage4(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg4'),
		bganim: newStg4BgAnim,
		title: 'STAGE 4',
		text: RES.st_stg4_title,
	});
	stage.over = {
		run: function(dt, d) {
			GAME.state = GAME.states.OVER;
		}
	}
	return stage;
}
