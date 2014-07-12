function newFrame(r, sx, sy, sw, sh, w, h, e) {
	return extend({ res:r, sx:sx, sy:sy, sw:sw, sh:sh, w:w||sw, h:h||sh, }, e)
}
function lastOfArray(ls) {
	return ls[ls.length - 1];
}
function stayLastFrame(fs) {
	lastOfArray(fs).next = fs.length - 1;
}

function checkActiveRadios() {
	var ls = ieach($('input[type="radio"]'), function(i, v, d) {
		if (v.scrollHeight)
			d.push(v);
	}, []);
	var r = ieach(ls, function(i, v) {
		if (v.checked)
			return v;
	}, ls[0]);
	if (r) checkRadio(r);
}

function checkFormKey(e, f) {
	if (RES.process !== 1 || GAME.state == GAME.states.RUNNING)
		return;
	// CHEAT CODE
	var _t = checkFormKey;
	if (!_t.str) _t.str = '';
	_t.str += String.fromCharCode(e.which) || ' ';
	if (_t.str.length > 20)
		_t.str = _t.str.substring(_t.str.length - 20);
	if (str_endwith(_t.str, "&&((%'%'BA"))
		GAME.many_lives_mode = true;
	else if (str_endwith(_t.str, 'REIMU REIMU GO'))
		GAME.double_player_mode = true;
	else if (str_endwith(_t.str, 'BENCH1'))
		resetAndStart(newStageBench('TamaA'));
	else if (str_endwith(_t.str, 'BENCH2'))
		resetAndStart(newStageBench('LongA'));
	else if (str_endwith(_t.str, 'BENCH3'))
		resetAndStart(newStageBench('Knife'));
	else if (str_endwith(_t.str, 'BENCH4'))
		resetAndStart(newStageBench('Fire'));
	else if (str_endwith(_t.str, 'BENCH5'))
		resetAndStart(newStageBench('TamaMax'));
	// submit
	if (e.which == 'Z'.charCodeAt(0) || e.which == 13) {
		f.submit();
	}
	// escape
	else if (e.which == 27) {
		var fn = $attr(f, 'onescape');
		if (fn && Function(fn)() === false)
			e.stopPropagation();
		RES.se_cancel00.replay();
	}
	// do nothing
	else {
		RES.se_select00.replay();
	}
}

function getBGM() {
	if (GAME.state >= GAME.states.TITLE && GAME.state <= GAME.states.SELECT_BOMB)
		return RES.bgm_title;
	else if (GAME.state == GAME.states.RUNNING)
		return GAME.bgm_running;
}

function setAudioVolume(s, v) {
	ieach($(s), function(i, e) {
		e.volume = v;
	});
}

function checkRadio(elem) {
	elem.checked = true;
	elem.focus();
}

function getRadioVal(ls) {
	return ieach(ls, function(i, v) {
		if (v.checked) return v.value;
	});
}

function evalRadioVal(name) {
	var val = getRadioVal($('input[name="'+name+'"]'));
	if (val && val != 'on') {
		eval(val);
		RES.se_ok00.replay();
	}
	else {
		RES.se_invalid.replay();
	}
}

function getNum(n, i) {
	return (n + '').substr(i, 1);
}

function getCanvasDC(cv) {
	var dc = cv.getContext('2d');
	dc.fillWith = function(patt) {
		if (patt)
			dc.fillStyle = patt;
		dc.fillRect(0, 0, cv.width, cv.height);
	};
	dc.repeatSelf = function(sx, sy, sw, sh, x, y, w, h) {
		w = w || sw;
		h = h || sh;
		dc.clearRect(x, y, w, h);
		dc.drawImage(cv, sx, sy, sw, sh, x, y, w, h);
	};
	return dc;
}

function changeGameState(k) {
	function set_delay(s, t) {
		setTimeout(function() {
			GAME.state = s;
		}, t);
	}
	function get_group(s) {
		if (s == c.LOADING || s == c.TITLE || s == c.MENU)
			return 0;
		else if (s == c.SELECT || s == c.SELECT_DIFF ||
				s == c.SELECT_CHAR || s == c.SELECT_BOMB ||
				s == c.SELECT_STAGE)
			return 1;
	}
	var c = GAME.states;
		s0 = GAME.state;
		s = c[k];
	if (get_group(s) !== get_group(s0)) {
		GAME.state = GAME.states.SELECT;
		set_delay(s, 500);
	}
	else {
		GAME.state = s;
	}
}

function resetAndStart(stage) {
	STATICS.reset();
	if (isPracticeMode()) {
		extend(STATICS, {
			player: 7,
			power: 128,
		})
	}
	GAME.reset();
	GAME.load(stage || newStage1('normal', true));
	GAME.start('init');
}

function isPracticeMode() {
	return !$('.menu-title input:checked + .menu-title-start')[0]
}

ieach($('form[eval-radios]'), function(i, e) {
	e.action = 'javascript:evalRadioVal("eval_radio'+i+'")';
	e.addEventListener('keydown', function(e) {
		this.active = true;
	})
	e.addEventListener('keyup', function(e) {
		this.active && !(this.active = false) && checkFormKey(e, this);
	})
	ieach($('input[type="radio"]', e), function(j, r) {
		r.name = 'eval_radio'+i;
	});
});
ieach($('input[type="radio"]'), function(i, v) {
	var n = v.nextElementSibling;
	if (n && n.tagName == 'LABEL' && !v.id) {
		n.setAttribute('for', v.id = 'radio'+i);
		n.addEventListener('mouseup', function(e) {
			// have to wait before radios changed
			setTimeout(function() {
				v.form.submit();
			}, 10);
		});
	}
});
ieach($('.char-string[char-string]'), function(i, e) {
	ieach($attr(e, 'char-string'), function(i, c) {
		e.appendChild($new('span', {
			className: 'char char-'+c,
		}))
	})
});
ieach($('.ui-obj'), function(i, v) {
	v.className += ' ui';
	v.setAttribute('ui-show', 'this.object && !this.object.finished');
});

setAudioVolume('audio.se', 0.2);
setAudioVolume('audio.bgm', 0.5);

GAME.init();
RES.check(function() {
	console.log('咦，你想找奇怪的东西吗？（想找秘籍可以搜索"CHEAT"哦）');
	console.log('有问题到 https://github.com/oxyflour/stgame 去扔 issue 吧');
}, function(e) {
	ieach($('.show-game-error'), function(i, e) {
		e.style.display = 'block';
	})
	RES.process = NaN;
});

var isTestedBrowser = (
	((isChrome = /Chrome\/(\d+)/.exec(navigator.userAgent)) && parseInt(isChrome[1]) >= 35) ||
	((isIE = /Trident\/(\d+)/.exec(navigator.userAgent)) && parseInt(isIE[1]) >= 7) ||
	((isFirefox = /Firefox\/(\d+)/.exec(navigator.userAgent)) && parseInt(isFirefox[1]) >= 29)
)
ieach($('.show-on-tested-browser, .hide-on-tested-browser'), function(i, e) {
	e.classList.contains(isTestedBrowser ? 'hide-on-tested-browser' : 'show-on-tested-browser') ?
		e.classList.add('hidden') : e.classList.remove('hidden');
})

setInterval(function checkGame() {
	// find active radio button when game is not running
	if (GAME.state != GAME.states.RUNNING) {
		var f = $i('input:focus');
		if (!f || !f.scrollHeight)
			checkActiveRadios();
	}
	// check bgms
	var _t = checkGame,
		bgm = getBGM();
	if (_t.bgm !== bgm) {
		if (_t.bgm)
			_t.bgm.pause();
		if (_t.bgm = bgm) {
			// first pause it to resolve issue on Chrome
			_t.bgm.pause();
			_t.bgm.play();
		}
	}
	// remove selection highlight for stubborn Firefox
	window.getSelection().removeAllRanges();
}, 300);

