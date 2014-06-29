function newStage4(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg4'),
		title: 'STAGE 4',
		text: 'Hello MuQ!',
	});
	stage.over = {
		run: function(dt, d) {
			GAME.state = GAME.states.OVER;
		}
	}
	return stage;
}
