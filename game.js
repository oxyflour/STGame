Math.Inf = parseFloat('Infinity');

function array(n, fn) {
	var ls = [];
	for (var i = 0; i < n; i ++) {
		ls[i] = fn(i);
	}
	return ls;
}
function range(n) {
	return array(n, function(i) {
		return i;
	});
}
function ieach(ls, fn, d) {
	var n = ls.length, r = undefined;
	for (var i = 0; i < n && r === undefined; i ++) {
		r = fn(i, ls[i], d);
	}
	return r === undefined ? d : r;
}
function keach(ls, fn, d) {
	for (var i in ls) {
		var r = fn(i, ls[i], d);
		if (r !== undefined)
			return r;
	}
	return d;
}
function each(ls, fn, d) {
	return (ls.length>=0 ? ieach : keach)(ls, fn, d);
}
function reduce(ls, fn, r) {
	return each(ls, function(i, v, d) {
		d.$ = fn(i, v, d.$);
	}, {$:r}).$;
}
function dictflip(a) {
	return each(a, function(i, v, d) {
		d[v] = i;
	}, {});
}
function keys(d) {
	return each(d, function(k, v, ls) {
		ls.push(k);
	}, []);
}
function keyfind(d, i) {
	return each(d, function(k, v) {
		if (v == i) return k;
	});
}
function extend(c) {
	function ext(d, s) {
		return keach(s || {}, function(k, v, d) {
			d[k] = v;
		}, d || {});
	}
	return reduce(arguments, function(i, v, r) {
		return i == 0 ? r : ext(r, v);
	}, c);
}
function arrcat() {
	return ieach(arguments, function(i, v, d) {
		each(v, function(j, u, d) {
			d.push(u);
		}, d);
	}, []);
}
function sum(ls) {
	return reduce(ls, function(i, v, r) {
		return v + r;
	}, 0);
}
function random(b, e) {
	var d = (e || 0) - b;
	return b + Math.random()*d;
}
function randin(ls) {
	return ls[Math.floor(Math.random()*ls.length)];
}
function squa_sum(x, y) {
	return x*x + y*y;
}
function sqrt_sum(x, y) {
	return Math.sqrt(squa_sum(x, y));
}
function rect_intersect(rt1, rt2) {
	return !(rt1.l > rt2.r || rt1.r < rt2.l ||
		rt1.t > rt2.b || rt1.b < rt2.t);
}
function circle_intersect(cr1, cr2) {
	return squa_sum(cr1.x - cr2.x, cr1.y - cr2.y) < 
		squa_sum(cr1.r + cr2.r, 0)
}
function line_circle_intersect(x1, y1, x2, y2, cr) {
	var dx = x2 - x1, dy = y2 - y1,
		dx1 = cr.x - x1, dy1 = cr.y - y1, t1 = dx1*dx + dy1*dy,
		dx2 = cr.x - y2, dy2 = cr.y - y2, t2 = dx2*dx + dy2*dy;
	return (t1 > 0 && t2 < 0 && squa_sum(dy*dx1 - dx*dy1, 0) / squa_sum(dx, dy) < squa_sum(cr.r, 0)) ||
		(t1 <= 0 && squa_sum(dx1, dy1) < squa_sum(cr.r, 0)) ||
		(t2 >= 0 && squa_sum(dx2, dy2) < squa_sum(cr.r, 0));
}

function $(s, p) {
	return (p || document).querySelectorAll(s);
}
function $e(id) {
	return document.getElementById(id);
}
function $attr(e, a) {
	var attr = e && e.attributes[a];
	return attr && attr.textContent;
}

function newCounter() {
	var t0 = Date.now();
	return function() {
		var t = Date.now(),
			dt = t - t0;
		t0 = t;
		return dt;
	}
}
function newFPSCounter() {
	var idx = 0,
		len = 100,
		arr = Array(len);
	return function(t) {
		var dt = (t - arr[idx]) / len;
		arr[idx] = t;
		idx = (idx + 1) % len;
		return 1000.0 / dt;
	}
}
function newTicker(t) {
	var _t = {
		t: t,
		c: 0,
		run: function(dt) {
			_t.c += dt;
			if (_t.c > _t.t) {
				_t.c -= _t.t;
				return true;
			}
		}
	}
	return _t;
}
function newAnimateList() {
	var _t = [], unused = [];
	_t.add = function(v, e) {
		// a should be object like { t:newTicker(20), f:fn, d:{} }
		_t[unused.length ? unused.pop() : _t.length] = v;
		if (e) v.f(v.d, e);
	};
	_t.run = function(dt, e) {
		ieach(_t, function(i, v) {
			if (v && v.t.run(dt) && v.f(v.d, e)) {
				_t[i] = undefined;
				unused.push(i);
			}
		});
	};
	return _t;
}
function newStateMachine(stes) {
	var _t = {
		n: undefined,
		s: undefined, // object like { run:fn(dt,d), [init:fn(d)], [quit:fn(d,n)] }
		d: {},
		stes: stes,
		run: function(dt) {
			if (_t.s) {
				var n = _t.s.run(dt, _t.d);
				if (n !== undefined) _t.set(n);
			}
		},
		set: function(n) {
			_t.n = n;
			if (_t.s && _t.s.quit)
				_t.s.quit(_t.d, n)
			_t.s = _t.stes[n];
			_t.d = _t.s && _t.s.data || {};
			if (_t.s && _t.s.init)
				_t.s.init(_t.d);
		}
	}
	return _t;
}

var DC = (function(canv) {
	var _t = canv.getContext('2d');
	_t.canv = canv;
	_t.clear = function() {
		_t.clearRect(0, 0, canv.width, canv.height);
	}
	_t.drawImageInt = function(i, sx, sy, sw, sh, dx, dy, dw, dh) {
		var f = Math.floor;
		sx = f(sx);
		sy = f(sy);
		sw = f(sw);
		sh = f(sh);
		dx = f(dx);
		dy = f(dy);
		dw = f(dw);
		dh = f(dh);
		_t.drawImage(i, sx, sy, sw, sh, dx, dy, dw, dh);
	}
	_t.font = '20px Arial';
	_t.textAlign = 'center';
	_t.strokeStyle = 'rgba(255,128,0,0.5)';
	_t.fillStyle = 'white';
	_t.lineWidth = 3;
	return _t;
})($e('canv'));

var RES = (function(res) {
	var _t = {};
	_t.process = 0;
	function getSrc(from) {
		var st = from.split(' '),
			im = $e(st[0]);
		if (st.length == 5) return {
			s: im,
			x: parseInt(st[1]),
			y: parseInt(st[2]),
			w: parseInt(st[3]),
			h: parseInt(st[4]),
		}
		else return {
			s: im,
			x: 0,
			y: 0,
			w: im.naturalWidth,
			h: im.naturalHeight,
		}
	}
	function getTrans(trans) {
		return trans ? trans.split(' ') : [];
	}
	function loaded() {
		ieach(res.children, function(i, v, d) {
			if (v.tagName == 'CANVAS') {
				var from = $attr(v, 'from'),
					trans = $attr(v, 'transform');
				if (from) {
					var sc = getSrc(from),
						ts = getTrans($attr(v, 'transform')),
						dc = v.getContext('2d');
					v.width = sc.w * ts.length;
					v.height = sc.h;
					ieach(ts, function(i, t) {
						dc.save();
						var st = t.split(':');
						if (st[0] == 'mirror') {
							if (st[1] == 'x') {
								dc.translate(v.width, 0);
								dc.scale(-1, 1);
							}
							else if (st[1] == 'y') {
								dc.translate(0, v.height);
								dc.scale(1, -1);
							}
							dc.drawImage(sc.s, 0, 0);
						}
						else if (st[0] == 'rotate') {
							dc.translate(sc.w*i + sc.w/2, sc.h/2);
							dc.rotate(parseInt(st[1])*Math.PI/180);
							dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
								-sc.w/2, -sc.h/2, sc.w, sc.h);
						}
						dc.restore();
					});
				}
			}
			d[v.id] = v;
		}, _t);
		var e = document.createEvent('CustomEvent');
		e.initCustomEvent('res.loaded', false, false, {});
		document.dispatchEvent(e);
	}
	function check() {
		var ls = ieach(res.children, function(i, v, d) {
			if (v.tagName == 'IMG')
				d.push(v.complete ? 1 : 0);
		}, []);
		_t.process = sum(ls) / ls.length;
		if (_t.process == 1) 
			loaded();
		else
			setTimeout(check, 500);
	};
	setTimeout(check, 10);
	return _t;
})($e('res'));

var SPRITE = (function() {
	var _t = {
		cls: {},
		obj: {},
		init: {},
		sort: [],
		clsIds: {},
	};
	_t.newCls = function(c, cls, init, from) {
		if (from) {
			cls.from = _t.cls[from];
			cls = extend({}, cls.from, cls)
		}
		if (!(_t.clsIds[c] >= 0))
			_t.clsIds[c] = _t.sort.length;
		cls.clsName = c;
		cls.clsId = _t.clsIds[c];
		init.prototype = cls;

		_t.cls[c] = cls;
		_t.init[c] = init;
		if (!_t.obj[c])
			_t.obj[c] = [];

		_t.sort = keach(_t.cls, function(k, v, d) {
			d.push([v.layer || v.clsName, v.clsName]);
		}, []).sort();
		return cls;
	};
	_t.newObj = function(c, data) {
		var ls = _t.obj[c],
			cls = _t.cls[c],
			obj = new _t.init[c](data, cls);

		var idx = ieach(ls, function(i, v) {
			if (!v.isAlive) return i;
		}, ls.length);
		obj.idx = idx;
		obj.isAlive = true;
		ls[idx] = obj;

		return obj;
	};
	_t.eachCls = function(fn) {
		for (var ls =_t.sort, i = 0, n = ls.length; i < n; i ++)
			fn(ls[i][1]);
	};
	_t.eachObj = function(fn, c) {
		function loop(c) {
			var ls = _t.obj[c],
				n = ls.length,
				a = 0;
			for (var i = 0; i < n; i ++) {
				var v = ls[i];
				if (v.isAlive) {
					fn(v);
					a ++;
				}
			}
			// no one alive? clear the array then
			if (a == 0 && n > 0)
				_t.obj[c] = [];
		}
		c ? loop(c) : _t.eachCls(loop);
	};
	_t.clearObj = function(c) {
		_t.eachObj(function(v) {
			v.isAlive = false;
		}, c);
	}
	return _t;
})();

var STORY = (function() {
	var _t = [];
	_t.events = dictflip([
		'GAME_INPUT',
		'OBJECT_OUT',
		'PLAYER_HIT',
		'PLAYER_DEAD',
		'PLAYER_AUTOCOLLECT',
		'PLAYER_GETDROP',
		'PLAYER_GRAZE',
		'PLAYER_FIRE',
		'PLAYER_BOMB',
		'DROP_COLLECTED',
		'BULLET_HIT',
		'ENEMY_KILL'
	]);
	_t.state = _t.anim = _t.hook = {};
	_t.load = function(tl, hook) {
		_t.state = newStateMachine(tl);
		_t.anim = newAnimateList();
		_t.hook = extend({
			before_run: undefined,
			after_run: undefined,
			before_on: undefined,
			after_on: undefined,
		}, hook);
	}
	_t.timeout = function(f, t, d, n) {
		n = n>=0 ? n : 1;
		_t.anim.add({
			d: d,
			t: newTicker(t),
			f: function(d) {
				if (n-->=0)
					f.apply(d, [n]);
				return n <= 0;
			},
		});
	}
	_t.run = function(dt) {
		if (_t.hook.before_run)
			_t.hook.before_run(dt, _t.state.d, _t.state.s);
		_t.state.run(dt);
		if (_t.hook.after_run)
			_t.hook.after_run(dt, _t.state.d, _t.state.s);

		_t.anim.run(dt);
	};
	_t.on = function(e, v) {
		var sm = _t.state;
		if (_t.hook.before_on)
			_t.hook.before_on(e, v, sm.d, sm.s);
		if (sm.s && sm.s.on)
			sm.s.on(e, v, sm.d);
		if (_t.hook.after_on)
			_t.hook.after_on(e, v, sm.d, sm.s);
	};
	return _t;
})();

var GAME = (function() {
	function testhit(c1, c2, dt) {
		SPRITE.eachObj(function(v1) {
			SPRITE.eachObj(function(v2) {
				if (c1 == c2 && v2.idx >= v1.idx)
					return;
				if (rect_intersect(v1.rect, v2.rect))
					v1.hit(v2, dt)
			}, c2);
		}, c1);
	};
	var _t = [];
	_t.state = 0;
	_t.states = dictflip([
		'READY',
		'RUNNING',
		'PAUSE',
		'ENDED',
	]);
	_t.rect = {
		l: 0,
		t: 0,
		r: DC.canv.width,
		b: DC.canv.height
	};
	_t.start = function(n) {
		STORY.state.set(n);
		_t.state = _t.states.RUNNING;
	};
	_t.run = function(dt) {
		SPRITE.eachCls(function(c1) {
			var hits = SPRITE.cls[c1].hits;
			if (hits) ieach(hits, function(i, c2) {
				testhit(c1, c2, dt);
			});
		});
		SPRITE.eachObj(function(v) {
			v.run(dt);
		});
		STORY.run(dt);
	};
	_t.draw = function() {
		DC.clear();
		SPRITE.eachObj(function(v) {
			v.draw();
		})
	};
	_t.keyste = {};
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	_t.keychars = ieach(chars, function(i, v, d) {
		d[v] = v.charCodeAt(0);
	}, {});
	_t.input = function(e) {
		_t.keyste.shiftKey = e.shiftKey;
		_t.keyste.ctrlKey = e.ctrlKey;
		if (e.type == 'keydown') {
			// to supress repeated keydown event
			if (_t.keyste[e.which])
				return;
			_t.keyste[e.which] = 1;
		}
		else if (e.type == 'keyup') {
			_t.keyste[e.which] = 0;
		}
		STORY.on(STORY.events.GAME_INPUT, e);
	};
	return _t;
})();

var UTIL = {
	getAliveObj: function(c) {
		return ieach(SPRITE.obj[c], function(i, v) {
			if (v.isAlive) return v;
		});
	},
	getAliveObjs: function(c) {
		return ieach(SPRITE.obj[c], function(i, v, d) {
			if (v.isAlive) d.push(v);
		}, []);
	},
	// fs should be array of objects like
	// { res:'', sx:0, sy:0, sw:10, sh:10, w:10, h:10, [rotate:1] }
	newFrameAnim: function(t, fs) {
		return {
			t: newTicker(t),
			d: {
				frames: fs,
				index: 0
			},
			f: function(d, v) {
				d.index = (d.index + 1) % d.frames.length;
				v.data.frame = d.frames[d.index];
			},
		}
	},
	// fgs: array of fs in newFrameAnim
	newFrameGroupAnim: function(t, fgs, fn) {
		return {
			t: newTicker(t),
			d: {
				frames: fgs[0],
				index: 0
			},
			f: function(d, v) {
				d.frames = fn(v, d, fgs);
				d.index = (d.index + 1) % d.frames.length;
				v.data.frame = d.frames[d.index];
			},
		}
	},
	// ps should be array of objects like
	// { x/fx:0, y/fy:0, v:10 }
	// x and y should be between 0 and 1
	newPathAnim: function(t, ps) {
		return {
			t: newTicker(t),
			d: {
				pathnodes: ps,
				index: 0
			},
			f: function(d, v) {
				var e = v.data,
					n = d.pathnodes[d.index];
				if (!n) return true;

				if (+n.fx === n.fx)
					n.x = GAME.rect.l * (1-n.fx) + GAME.rect.r * n.fx;
				if (+n.fy === n.fy)
					n.y = GAME.rect.t * (1-n.fy) + GAME.rect.b * n.fy;

				if (d.index == 0) {
					e.x = n.x;
					e.y = n.y;
					d.index ++;
				} else {
					var dx = n.x - e.x,
						dy = n.y - e.y,
						r = sqrt_sum(dx, dy),
						f = n.v / r;
					e.x = e.x * (1-f) + n.x * f;
					e.y = e.y * (1-f) + n.y * f;
					if (f >= 1) // to next node
						d.index ++;
				}
			},
		}
	},
	newTimeRunner: function(t, n) {
		return function(dt, d) {
			d.age = (d.age || 0) + dt;
			if (d.age > t) return n;
		}
	},
	// stes: array of objects like
	// { life:1000, [next:1] }
	newAliveState: function(stes) {
		function init(d) {
			d.age = 0;
		}
		function run(dt, d) {
			d.age += dt;
			if (d.age > d.life)
				return d.next !== undefined ? d.next : -1;
		}
		stes = ieach(stes, function(k, v, d) {
			d[k] = { run:run, init:init, data:extend({}, v) }
		}, []);

		var s = newStateMachine(stes);
		s.setWith = function(k) {
			var i = ieach(s.stes, function(i, v, d) {
				if (v.data[k]) return i;
			});
			s.set(i);
		}
		s.set(0);
		return s;
	},
};

(function() {
	var timeCounter = newCounter();
	var tick = function() {
		var dt = timeCounter();
		if (GAME.state == GAME.states.RUNNING)
			GAME.run(Math.min(dt, 15));
	}
	setInterval(tick, 10);

	GAME.fps = 0;
	var fpsCounter = newFPSCounter();
	requestAnimationFrame(function render(t) {
		GAME.fps = fpsCounter(t);
		GAME.draw();
		requestAnimationFrame(render);
	});

	setInterval(function() {
		var fns = {
			'ui-bind': function(e, t) {
				return Function(($attr(e, 'ui-bind-attr') || 'this.innerHTML')+'='+t);
			},
			'ui-show': function(e, t) {
				return Function('this.style.display=('+t+')?"block":"none"');
			}
		};
		ieach($('.ui'), function(i, e) {
			ieach(e.attributes, function(i, attr) {
				var n = attr.name,
					t = attr.textContent,
					k = 'exec:'+n+':'+t,
					f = fns[attr.name];
				if (f) (e[k] = e[k] || f(e, t)).apply(e);
			});
		});
	}, 80);
	
	ieach(['keydown', 'keyup'], function(i, v) {
		window.addEventListener(v, function(e) {
			GAME.input(e);
			tick();
		});
	});
})();

SPRITE.newCls('Static', {
	layer: 'L10',
	runStatic: undefined,
	run: function(dt) {
		var d = this.data, s = this.state;

		s.run(dt);
		if (!s.d.life)
			this.isAlive = false;

		if (this.runStatic)
			this.runStatic(dt, d, s);
	},
	drawStatic: undefined,
	drawText: function(d, s) {
		if (d.font)
			DC.font = d.font;
		if (d.color)
			DC.fillStyle = d.color;
		DC.fillText(d.t, d.x, d.y);
	},
	drawFrame: function(d, s) {
		var f = d.frame;
		if (f.rotate) {
			var t = +f.rotate===f.rotate ? f.rotate :
				Math.PI/2 + Math.atan2(d.vy, d.vx);
			DC.translate(d.x, d.y);
			DC.rotate(t);
			DC.drawImageInt(RES[f.res],
				f.sx, f.sy, f.sw, f.sh,
				-f.w/2, -f.h/2, f.w, f.h);
		}
		else DC.drawImageInt(RES[f.res],
			f.sx, f.sy, f.sw, f.sh,
			d.x-f.w/2, d.y-f.h/2, f.w, f.h);
	},
	draw: function() {
		var d = this.data, s = this.state;
		DC.save();

		if (s.d.creating)
			d.max_opacity = DC.globalAlpha = s.d.age / s.d.life;
		else if (s.d.dying)
			DC.globalAlpha = Math.min(d.max_opacity, 1 - s.d.age / s.d.life);
		else
			d.max_opacity = 1;

		if (this.drawStatic)
			this.drawStatic(d, s);
		else if (d.frame)
			this.drawFrame(d, s);
		else if (d.text)
			this.drawText(d, s);

		DC.restore();
	},

	states: [
		{ creating: 1, life:	500, next: 1 },
		{ living:   1, life:	Math.Inf, next: 2 },
		{ dying:    1, life: 500 }
	],
}, function(o, c) {
	this.state = UTIL.newAliveState(this.states);
	this.data = extend({
		x: (GAME.rect.l+GAME.rect.r)/2,
		y: (GAME.rect.t+GAME.rect.b)/2,
		text: 'Static Text',
		color: undefined,
		font: undefined,
		frame: undefined, // i.e. {res:'player0L', sx:0, sy:0, sw:10, sh:10, w:10, h:10}
	}, o);
});

SPRITE.newCls('Base', {
	runBase: undefined,
	runStatic: function(dt, d, s) {
		d.x0 = d.x;
		d.y0 = d.y;
		if (this.runBase)
			this.runBase(dt, d, s);
		d.x += d.vx * dt;
		d.y += d.vy * dt;

		this.anim.run(dt, this);

		var s = this.space;
		if (d.x+d.r+s.l < GAME.rect.l ||
			d.x-d.r-s.r > GAME.rect.r ||
			d.y+d.r+s.t < GAME.rect.t ||
			d.y-d.r-s.b > GAME.rect.b) {
			this.isAlive = false;
			STORY.on(STORY.events.OBJECT_OUT, this);
		}

		this.rect.l = Math.min(d.x0, d.x) - d.r*1.1;
		this.rect.t = Math.min(d.y0, d.y) - d.r*1.1;
		this.rect.r = Math.max(d.x0, d.x) + d.r*1.1;
		this.rect.b = Math.max(d.y0, d.y) + d.r*1.1;
	},
	drawStatic: function(d, s) {
		if (d.frame)
			this.drawFrame(d, s);
		else if (d.color) {
			DC.fillStyle = d.color;
			DC.beginPath();
			DC.arc(d.x, d.y, d.r, 0, 2*Math.PI);
			DC.closePath();
			DC.fill();
		}
	},
	space: {
		l: 40,
		r: 40,
		t: 40,
		b: 20
	},
	init: function(d, e) {
		this.rect = { l:0, t:0, r:0, b:0 };
		this.state = UTIL.newAliveState(this.states);
		this.anim = newAnimateList();
		this.data = extend({
			r: 10,
			x: (GAME.rect.l+GAME.rect.r)/2,
			y: (GAME.rect.t+GAME.rect.b)/2,
			vx: 0,
			vy: 0,
			x0: 0,
			y0: 0,
		}, d, e);
	},
}, function(d, c) {
	this.init(d);
}, 'Static');

SPRITE.newCls('Player', {
	hits: [
		'Player',
		'Ball',
		'Enemy',
		'Dannmaku',
		'Drop',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (v.state.d.mkDamage) {
			if (!this.state.d.isInvinc && circle_intersect({ x:d.x, y:d.y, r:d.h }, e)) {
				STORY.on(STORY.events.PLAYER_HIT, this);
			}
			else if (circle_intersect(d, e) && !e.grazed) {
				e.grazed = true;
				STORY.on(STORY.events.PLAYER_GRAZE, this);
			}
		}
		else if (v.clsId == SPRITE.clsIds.Drop) {
			if (v.state.d.living && circle_intersect(d, { x:e.x, y:e.y, r:20 })) {
				STORY.on(STORY.events.PLAYER_GETDROP, this);
				STORY.on(STORY.events.DROP_COLLECTED, v);
			}
			else
				e.collected = this;
		}
		else if (v.clsId == SPRITE.clsIds.Player) {
			if (circle_intersect(d, e)) {
				var r = sqrt_sum(d.x - e.x, d.y - e.y),
					sin = (d.y - e.y) / r,
					cos = (d.x - e.x) / r,
					cx = (d.x*e.r+e.x*d.r)/(d.r+e.r),
					cy = (d.y*e.r+e.y*d.r)/(d.r+e.r),
					f = 1.01;
				d.x = cx + d.r*cos*f; d.y = cy + d.r*sin*f;
				e.x = cx - e.r*cos*f; e.y = cy - e.r*sin*f;
			}
		}
	},
	
	runPlayer: function(dt, d, s) {
		var m = GAME.keyste.shiftKey,
			v = m ? 0.14 : 0.35;
		d.slowMode = m;
		d.x0 = d.x;
		d.y0 = d.y;

		var vx = 0,
			vy = 0;
		if (GAME.keyste[d.conf.key_left])
			vx = -v;
		else if (GAME.keyste[d.conf.key_right])
			vx = +v;
		if (GAME.keyste[d.conf.key_up])
			vy = -v;
		else if (GAME.keyste[d.conf.key_down])
			vy = +v;
		if (vx && vy) {
			vx /= 1.414;
			vy /= 1.414
		}
		d.vx = vx;
		d.vy = vy;
		d.x += d.vx * dt;
		d.y += d.vy * dt;

		// FIRE!
		if (GAME.keyste[d.conf.key_fire]) {
			if (d.firetick.run(dt) || !d.fire_on) {
				d.firetick.c = d.fire_on ? 80 : 0;
				STORY.on(STORY.events.PLAYER_FIRE, this);
			}
		}
		d.fire_on = GAME.keyste[d.conf.key_fire];

		// BOMB!
		if (GAME.keyste[d.conf.key_bomb] && !s.d.bomb) {
			STORY.on(STORY.events.PLAYER_BOMB, this);
		}

		// AUTO COLLECT!
		if (d.y < GAME.rect.t*0.7 + GAME.rect.b*0.3) {
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT, this);
		}
	},
	runStatic: function(dt, d, s) {
		if (!this.isAlive)
			STORY.on(STORY.events.PLAYER_DEAD, this);

		if (!s.d.dying)
			this.runPlayer(dt, d, s);

		this.anim.run(dt, this);

		// limit player move inside boundary
		if (d.x-d.r < GAME.rect.l)
			d.x = GAME.rect.l + d.r;
		if (d.x+d.r > GAME.rect.r)
			d.x = GAME.rect.r - d.r;
		if (d.y-d.r < GAME.rect.t)
			d.y = GAME.rect.t + d.r;
		if (d.y+d.r > GAME.rect.b)
			d.y = GAME.rect.b - d.r;

		this.rect.l = d.x - d.r*1.1;
		this.rect.t = d.y - d.r*1.1;
		this.rect.r = d.x + d.r*1.1;
		this.rect.b = d.y + d.r*1.1;
	},
	drawStatic: function(d, s) {
		if (this.state.d.isInvinc)
			DC.globalAlpha = 0.5;

		if (d.frame)
			this.drawFrame(d, s);

		if (d.slowMode) {
			DC.strokeStyle = 'black';
			DC.beginPath();
			DC.arc(d.x, d.y, d.h+1, 0, 2*Math.PI);
			DC.closePath();
			DC.stroke();
		}
	},
	init: function(d, e) {
		this.rect = { l:0, t:0, r:0, b:0 };
		this.state = UTIL.newAliveState(this.states);

		this.anim = newAnimateList();
		this.anim.add(UTIL.newFrameGroupAnim(120, [
			this.frames0,
			this.framesL,
			this.framesR
		], function(v, d, fgs) {
			if (v.data.vx == 0)
				return fgs[0];
			var fs = fgs[v.data.vx < 0 ? 1 : 2];
			if (d.frames != fs)
				d.index = 0;
			if (d.index + 1 > fs.length - 1)
				d.index = 2;
			return fs;
		})),
			
		this.data = extend({
			r: 15,
			h: 3,

			x: (GAME.rect.l+GAME.rect.r)/2,
			y: GAME.rect.t*0.2 + GAME.rect.b*0.8,
			vx: 0,
			vy: 0,
			x0: 0,
			y0: 0,

			firetick: newTicker(180),
		}, d, e);
		this.data.conf = extend({
			key_left: 37,
			key_up: 38,
			key_right: 39,
			key_down: 40,
			key_fire: GAME.keychars.Z,
			key_bomb: GAME.keychars.X,
		}, this.data.conf);
	},

	states: [
		{ creating: 1, life: 1000, next:  1, isInvinc: 1 },
		{ living:   1, life: Math.Inf, next:  2 },
		{ dying:    1, life: 1000, isInvinc: 1 },
		{ bomb:     1, life: 5000, next:  2, isInvinc: 1 },
		{ juesi:    1, life:  100, next:  2, isInvinc: 1 },
	],

	frames0: array(4, function(i) {
		return extend({ res:'player0L', sy: 0, sw:32, sh:48, w:32, h:48 }, { sx:32*i });
	}),
	framesL: arrcat([
		{ res:'player0L', sx: 0, sy:0, sw:32, sh:48, w:32, h:48 },
		{ res:'player0L', sx:32, sy:0, sw:32, sh:48, w:32, h:48 },
	], array(7, function(i) {
		return extend({ res:'player0L', sy:48, sw:32, sh:48, w:32, h:48 }, { sx:32*i });
	})),
	framesR: arrcat([
		{ res:'player0L', sx: 0, sy:0, sw:32, sh:48, w:32, h:48 },
		{ res:'player0L', sx:32, sy:0, sw:32, sh:48, w:32, h:48 },
	], array(7, function(i) {
		return extend({ res:'player0R', sy:48, sw:32, sh:48, w:32, h:48 }, { sx:255-32*(i+1) });
	})),
}, function(d, c) {
	this.init(d);
}, 'Static');

SPRITE.newCls('Ball', {
	layer: 'L20',
	hits: [
		'Ball',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (circle_intersect(d, e)) {
			var r = sqrt_sum(d.x - e.x, d.y - e.y),
				sin = (d.y - e.y) / r,
				cos = (d.x - e.x) / r,
				md = d.r,
				me = e.r,
				vd = sqrt_sum(d.vx, d.vy),
				ve = sqrt_sum(e.vx, e.vy),
				vdn = d.vx*cos + d.vy*sin, vdr = d.vx*sin - d.vy*cos,
				ven = e.vx*cos + e.vy*sin, ver = e.vx*sin - e.vy*cos;
			var vdn2 = (vdn*(md - me)+2*me*ven)/(md+me),
				ven2 = (ven*(me - md)+2*md*vdn)/(md+me);
			d.vx = vdn2*cos + vdr*sin; d.vy = vdn2*sin - vdr*cos;
			e.vx = ven2*cos + ver*sin; e.vy = ven2*sin - ver*cos;
			var cx = (d.x*e.r+e.x*d.r)/(d.r+e.r),
				cy = (d.y*e.r+e.y*d.r)/(d.r+e.r),
				f = 1.01;
			d.x = cx + d.r*cos*f; d.y = cy + d.r*sin*f;
			e.x = cx - e.r*cos*f; e.y = cy - e.r*sin*f;
		}
	},

	states: [
		{ creating: 1, life:	200, next: 1 },
		{ living:   1, life:	Math.Inf, next: 2, mkDamage: 1 },
		{ dying:    1, life: 500 }
	],
}, function(d, c) {
	this.init(d);
}, 'Base');

SPRITE.newCls('Enemy', {
	hits: [
		'Bullet',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (this.state.d.dying || v.state.d.dying)
			return;
		if (circle_intersect(d, e)) {
			d.damage ++;
			STORY.on(STORY.events.BULLET_HIT, v);
			if (d.damage >= d.life) {
				STORY.on(STORY.events.ENEMY_KILL, this);
			}
		}
	},
	
	states: [
		{ creating: 1, life:	500, next: 1 },
		{ living:   1, life:	Math.Inf, next: 2, mkDamage: 1 },
		{ dying:    1, life: 500 }
	],
}, function(d, c) {
	this.init({
		r: 20,
		y: GAME.rect.t*0.9+GAME.rect.b*0.1,
		life: 10,
		damage: 0
	}, d);
}, 'Base');

SPRITE.newCls('Bullet', {
	layer: 'L20',
	runBase: function(dt, d, s) {
		var u = d.to,
			e = u && u.data;
		if (!u || !u.isAlive || !u.state.d.mkDamage)
			return;
		if (d.type == 1) {
			var dx = e.x - d.x,
				dy = e.y - d.y,
				r = sqrt_sum(dx, dy),
				v = sqrt_sum(d.vx, d.vy);
			d.vx = v * dx / r;
			d.vy = v * dy / r;
		}
	},
	states: [
		{ creating: 1, life: 100, next: 1 },
		{ living:   1, life: Math.Inf, next: 2 },
		{ dying:    1, life: 10 }	
	],
}, function(d, c) {
	this.init({
		r: 5,
		vy: -0.5,
		from: null, // from which player
		to: null,	// to which enemy
	}, d);
}, 'Base');

SPRITE.newCls('Drop', {
	layer: 'L20',
	runBase: function(dt, d, s) {
		var v = d.collected;
		if (v && !v.isAlive)
			v = d.collected = UTIL.getAliveObj('Player');
		if (v && v.isAlive && !v.state.d.dying) {
			var e = v.data,
				v = d.collected_auto ? 0.8 : sqrt_sum(d.vx, d.vy),
				dx = e.x - d.x,
				dy = e.y - d.y,
				r = sqrt_sum(dx, dy);
			d.vx = v * dx / r;
			d.vy = v * dy / r;
			if (!d.collected_auto)
				d.collected = undefined;
		}
		else if (d.vy < 0.15)
			d.vy += 0.001 * dt;
	},
	space: {
		l: 200,
		r: 40,
		t: 40,
		b: 20
	},
	states: [
		{ creating: 1, life: 300, next: 1 },
		{ living:   1, life: Math.Inf, next: 2 },
		{ dying:    1, life: 100 }
	],
}, function(d, c) {
	this.init({
		r: 60,
		vy: -0.4,
		collected: undefined,
		collected_auto: false,
		frame: { res:'etama3', sx:32, sy:0, sw:16, sh:16, w:20, h:20 }
	}, d);
}, 'Base');

SPRITE.newCls('Dannmaku', {
	layer: 'L20',
	runBase: function(dt, d, s) {
		var u = d.from,
			e = u && u.data;
		if (!u || !u.isAlive || !u.state.d.living)
			return;
		if (d.type == 1) {
			if (this.state.d.age < 1000) {
				d.vx -= 30e-7 * dt * (d.x - e.x);
				d.vy -= 30e-7 * dt * (d.y - e.y);
			}
		}
		else if (d.type == 2) {
			if (Math.abs(d.vx) > 0.02) d.vx *= 0.992;
			if (Math.abs(d.vy) > 0.02) d.vy *= 0.992;
		}
		else if (d.type == 3) {
			if (this.state.d.age < 1000) {
				d.vx *= 0.98;
				d.vy *= 0.98;
			}
			else {
				if (!d.to || !d.to.isAlive)
					d.to = UTIL.getAliveObj('Player');
				if (d.to) {
					d.vx -= 10e-7 * dt * (d.x - d.to.data.x);
					d.vy -= 10e-7 * dt * (d.y - d.to.data.y);
				}
			}
		}
		else if (d.type == 4) {
			if (!d.pos) d.pos = {x: e.x, y: e.y, t: 0};
			if (!e.dir) e.dir = randin([-1, 1]);
			d.pos.t += dt;
			d.x = 100*Math.sin(e.dir*d.pos.t/250) + d.pos.x;
			d.y = 100*Math.cos(e.dir*d.pos.t/250) + d.pos.y;
		}
	},
	states: [
		{ creating: 1, life: 100, next: 1 },
		{ living:   1, life: Math.Inf, next: 2, mkDamage: 1 },
		{ dying:    1, life: 100 },
	],
}, function(d, c) {
	this.init({
		r: 5,
		vy: 0.3,
		from: null,
		type: 0
	}, d);
}, 'Base');

// for test only
function newBall(v, fy) {
	var t = random(-0.6, 0.6) * Math.PI / 2,
		r = random(10) + 5;
	SPRITE.newObj('Ball', {
		x: random(GAME.rect.l, GAME.rect.r),
		y: random(GAME.rect.t, GAME.rect.t*(1-fy)+GAME.rect.b*fy),
		vx: v*Math.sin(t),
		vy: v*Math.cos(t),
		r: r,
		frame: { res:'etama3', sx:randin(range(8))*32, sy:128,
			sw:32, sh:32, w:r*2.5, h:r*2.5 }
	});
}
function newBullet(v) {
	var e = null, r = Math.Inf;
	SPRITE.eachObj(function(u) {
		if (u.state.d.mkDamage) {
			var r0 = squa_sum(u.data.x-v.data.x, u.data.y-v.data.y);
			if (r0 < r) {
				r = r0;
				e = u;
			}
		}
	}, 'Enemy');
	ieach([1, -1], function(i, x) {
		var v0 = 0.7, v1 = 0.5,
			t = random(10, 20) * Math.PI / 180;
		var a = SPRITE.newObj('Bullet', {
			x: v.data.x + 10*x,
			y: v.data.y,
			vy: -v0,
			from: v,
			frame: { res:'bullet0', sx:0, sy:0, sw:16, sh:16, w:16, h:16 },
		});
		var b = SPRITE.newObj('Bullet', {
			x: v.data.x + 20*x,
			y: v.data.y,
			vy: -v1*Math.cos(t),
			vx: v1*x*Math.sin(t),
			type: 1,
			from: v,
			to: e
		});
		b.anim.add(UTIL.newFrameAnim(50, array(5, function(i) {
			return extend({ res:'bullet1', sy:0, sw:16, sh:16, w:16, h:16 }, { sx:16*i });
		})), b);
	});
}
function newDannmaku(v, type, ts) {
	var e = v.data,
		p = UTIL.getAliveObj('Player').data;
	var r = sqrt_sum(e.x-p.x, e.y-p.y),
		t = Math.asin((p.x - e.x) / r),
		n = 15, p = Math.PI*1.5,
		i = (ts % n - (n-1) / 2) * p/n,
		c = t + i*random(0.8, 1.2),
		dx = Math.sin(c),
		dy = Math.cos(c);
	var dann = SPRITE.newObj('Dannmaku', {
		x: e.x + 20*dx,
		y: e.y + 20*dy,
		vx: 0.3*dx,
		vy: 0.3*dy,
		r: 3,
		frame: { res:'etama3', sx:0, sy:64, sw:16, sh:16, w:16, h:16, rotate:true },
		from: v,
		type: type
	});
}
function newEnemy(type) {
	var bx = randin([0, 1]) * 32*4,
		by = randin([0, 1, 2]) * 32;
	var enm = SPRITE.newObj('Enemy', {
		x: random(GAME.rect.l+100, GAME.rect.r-100),
		vx: random(-0.05, 0.05),
		vy: random(0.01, 0.1),
		r: 16,
	});
	enm.anim.add(UTIL.newFrameAnim(150, array(4, function(i) {
		return extend({ res:'stg1enm', sy:by, sw:32, sh:32, w:32, h:32 }, { sx:bx+32*i });
	})));
	STORY.timeout(function(n) {
		if (n < 60 && enm.isAlive && enm.state.d.living)
			newDannmaku(enm, type, n);
	}, 20, null, 100);
}
function newBoss() {
	var boss = SPRITE.newObj('Enemy', {
		r: 24,
		life: 300,
	});
	boss.anim.add(UTIL.newFrameAnim(150, array(8, function(i) {
		return extend({ res:'stg1enm', sy:255-48, sw:32, sh:48, w:32, h:48 }, { sx:32*i });
	})));
	boss.anim.add(UTIL.newPathAnim(30, [
		{ fx:0.0, fy:0.0, v:3 },
		{ fx:0.1, fy:0.1, v:3 },
		{ fx:0.5, fy:0.1, v:3 },
	]));
	boss.drawStatic = function(d, s) {
		if (d.frame)
			this.drawFrame(d, s);
		DC.beginPath();
		DC.arc(d.x, d.y, d.r*1.5, 0, (d.life-d.damage)/d.life*2*Math.PI);
		DC.stroke();
		DC.closePath();
	}
}
function newEffect(v) {
	var eff = SPRITE.newObj('Base', {
		x: v.data.x,
		y: v.data.y,
		vx: v.data.vx*=0.1,
		vy: v.data.vy*=0.1,
	});
	eff.anim.add(UTIL.newFrameAnim(50, array(20, function(i) {
		var r = [32,42,52,62,60,58,56,54,52,50,48,46,44,42,40,38,36,34,32,30,28,26][i]*0.5;
		return extend({ res:'eff00', sx:0, sy:0, sw:32, sh:32 }, { w:r*2, h:r*2 });
	})));
	eff.state = UTIL.newAliveState([
		{ creating: 1, life: 100, next:  1 },
		{ living:   1, life: 50, next:  2 },
		{ dying:    1, life: 850 },
	]);
}
function killCls() {
	ieach(arguments, function(i, c) {
		SPRITE.eachObj(function(v) {
			if (!v.state.d.dying)
				v.state.setWith('dying');
		}, c);
	})
}
function killObj() {
	ieach(arguments, function(i, v) {
		if (!v.state.d.dying)
			v.state.setWith('dying');
	})
}

GAME.statics = {
	time: 0,
	graze: 0,
	point: 0,
	miss: 0
};
var tl = {};
tl.all = {
	after_run: function(dt) {
		GAME.statics.time += dt;
	},
	before_on: function(e, v, d) {
		if (e == STORY.events.GAME_INPUT) {
			if (v.type == 'keyup' && v.which == 13) {
				var s = GAME.state,
					c = GAME.states;
				if (s == c.PAUSE)
					GAME.state = c.RUNNING;
				else if (s == c.RUNNING)
					GAME.state = c.PAUSE;
			}
		}
		else if (e == STORY.events.PLAYER_AUTOCOLLECT) {
			SPRITE.eachObj(function(u) {
				u.data.collected = v;
				u.data.collected_auto = true;
			}, 'Drop');
		}
		else if (e == STORY.events.PLAYER_HIT) {
			GAME.statics.graze --;
			v.state.setWith('juesi');
			/*
			STORY.timeout(function() {
				killCls('Dannmaku');
			}, 10, null, 80);
			*/
			STORY.timeout(function() {
				if (v.state.d.dying) {
					var x = v.data.x,
						y = GAME.rect.t*0.8+GAME.rect.b*0.2;
					SPRITE.newObj('Drop', { x:x+90, y:y+10 });
					SPRITE.newObj('Drop', { x:x+30, y:y });
					SPRITE.newObj('Drop', { x:x-30, y:y });
					SPRITE.newObj('Drop', { x:x-90, y:y+10 });
				}
			}, 200);
		}
		else if (e == STORY.events.PLAYER_GRAZE) {
			GAME.statics.graze ++;
		}
		else if (e == STORY.events.PLAYER_DEAD) {
			GAME.statics.miss ++;
			SPRITE.newObj('Player');
		}
		else if (e == STORY.events.PLAYER_FIRE) {
			if (!d.disable_fire)
				newBullet(v);
		}
		else if (e == STORY.events.PLAYER_BOMB) {
			v.state.setWith('bomb');
		}
		else if (e == STORY.events.ENEMY_KILL) {
			v.state.setWith('dying');
			newEffect(v);
		}
		else if (e == STORY.events.DROP_COLLECTED) {
			v.state.setWith('dying');
			GAME.statics.point += 10;
		}
		else if (e == STORY.events.BULLET_HIT) {
			v.state.setWith('dying');
		}
	}
};
tl.init = {
	run: UTIL.newTimeRunner(5000, 'sec0'),
	init: function(d) {
		SPRITE.newObj('Player');
		d.title = SPRITE.newObj('Static', {
			t: 'Dannmaku Demo!',
			font: '30px Arial'
		});
	},
	quit: function(d) {
		d.title.state.setWith('dying');
	}
};
tl.sec0 = {
	run: UTIL.newTimeRunner(20000, 'sec1'),
	init: function(d) {
		STORY.timeout(function(n) {
			newBall(n > 10 ? 0.05 : 0.25, n > 10 ? 0.6 : 0.2);
		}, 20, null, 60);
	},
	quit: function(d) {
		killCls('Ball');
	},
	on: function(e, v, d) {
		if (e == STORY.events.OBJECT_OUT) {
			if (v.clsId == SPRITE.clsIds.Ball) {
				var fy = random(0.2, 0.6);
				newBall(0.6-fy, fy);
			}
		}
	}
};
tl.sec1 = {
	init: function(d) {
		STORY.timeout(function(n) {
			if (n < 3) newEnemy(tl.loop || 0);
		}, 300, null, 8);
	},
	run: function(dt, d) {
		if (d.pass) {
			tl.loop = (tl.loop || 0) + 1;
			if (tl.loop >= 5)
				return 'diag';
			else
				return 'sec1';
		}
	},
	quit: function(d) {
		SPRITE.eachObj(function(v) {
			v.state.setWith('dying');
			SPRITE.newObj('Drop', {
				x: v.data.x,
				y: v.data.y,
				vx: v.data.vx *= 0.01,
				vx: v.data.vy *= 0.01,
				frame: { res:'etama3', sx:16, sy:0, sw:16, sh:16, w:20, h:20 },
			});
		}, 'Dannmaku');
		STORY.timeout(function() {
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT,
				UTIL.getAliveObj('Player'));
		}, 100);
	},
	on: function(e, v, d) {
		if (e == STORY.events.ENEMY_KILL) {
			SPRITE.newObj('Drop', {
				x: v.data.x,
				y: v.data.y
			});
			var pass = reduce(SPRITE.obj.Enemy, function(i, v, r) {
				return v.isAlive ? (r && v.state.d.dying) : r;
			}, true);
			if (pass) STORY.timeout(function() {
				this.pass = true;
			}, 100, d);
		}
		else if (e == STORY.events.OBJECT_OUT) {
			if (v.clsId == SPRITE.clsIds.Enemy && !v.state.d.dying)
				newEnemy(tl.loop);
		}
	}
};
ieach([
	{ t:'x0aabbcc', x:GAME.rect.l+50, y:GAME.rect.t*0.2+GAME.rect.b*0.8, name:'diag' },
	{ t:'y0aabbcc', x:GAME.rect.r-50, y:GAME.rect.t*0.2+GAME.rect.b*0.8 },
	{ t:'x0aabbcc', x:GAME.rect.l+50, y:GAME.rect.t*0.2+GAME.rect.b*0.8 },
	{ t:'y0aabbcc', x:GAME.rect.r-50, y:GAME.rect.t*0.2+GAME.rect.b*0.8 },
	{ t:'x0aabbcc', x:GAME.rect.l+50, y:GAME.rect.t*0.2+GAME.rect.b*0.8 },
	{ t:'y0aabbcc', x:GAME.rect.r-50, y:GAME.rect.t*0.2+GAME.rect.b*0.8, next:'boss' },
], function(i, v, tl) {
	var c = v.name || 'diag'+i, n = v.next || 'diag'+(i+1);
	tl[c] = {
		init: function(d) {
			d.disable_fire = true;
			d.text = SPRITE.newObj('Static', v);
		},
		run: function(dt, d) {
			if (d.pass || GAME.keyste.ctrlKey)
				return n;
		},
		quit: function(d) {
			d.text.state.setWith('dying');
		},
		on: function(e, v, d) {
			if (e == STORY.events.GAME_INPUT) {
				if (v.which == GAME.keychars.Z) {
					if (v.type == 'keydown')
						d.pass = 0;
					else if (v.type == 'keyup' && d.pass === 0)
						d.pass = 1;
				}
			}
		},
	}
}, tl);
tl.boss = {
	init: function(d) {
		killCls('Static', 'Enemy', 'Dannmaku');
		STORY.timeout(function() {
			newBoss();
		}, 1000);
	},
	run: function(dt, d) {
		if (d.pass)
			return 'end';
	},
	on: function(e, v, d) {
		if (e == STORY.events.ENEMY_KILL) {
			SPRITE.newObj('Drop', {
				x: v.data.x,
				y: v.data.y,
				pass: 1
			});
		}
		else if (e == STORY.events.DROP_COLLECTED) {
			if (v.data.pass)
				d.pass = true;
		}
	}
};
tl.end = {
	init: function(d) {
		SPRITE.newObj('Static', {
			t: 'You Win!'
		});
	},
	run: function(dt, d) {
	}
};

document.addEventListener('res.loaded', function(e) {
	STORY.load(tl, tl.all);
	GAME.start('init');
});
