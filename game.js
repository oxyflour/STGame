Math.Inf = parseFloat('Infinity');

function return_self(x) {
	return x;
}
function array(n, fn) {
	var ls = [];
	for (var i = 0; i < n; i ++) {
		ls[i] = fn(i);
	}
	return ls;
}
function range(n) {
	return array(n, return_self);
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
function fill(c) {
	function fil(d, s) {
		return keach(s || {}, function(k, v, d) {
			if (d[k] === undefined) d[k] = v;
		}, d || {});
	}
	return reduce(arguments, function(i, v, r) {
		return i == 0 ? r : fil(r, v);
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
function limit_between(x, min, max) {
	if (x > max) x = max;
	if (x < min) x = min;
	return x;
}
function interp(x0, x1, f) {
	return x0 * (1-f) + x1 * f;
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
function line_circle_intersect(x1, y1, x2, y2, w, cr) {
	var dx = x2 - x1, dy = y2 - y1,
		dx1 = cr.x - x1, dy1 = cr.y - y1, t1 = dx1*dx + dy1*dy,
		dx2 = cr.x - y2, dy2 = cr.y - y2, t2 = dx2*dx + dy2*dy;
	return (t1 > 0 && t2 < 0 && squa_sum(dy*dx1 - dx*dy1, 0) / squa_sum(dx, dy) < squa_sum(cr.r+w, 0)) ||
		(t1 <= 0 && squa_sum(dx1, dy1) < squa_sum(cr.r+w, 0)) ||
		(t2 >= 0 && squa_sum(dx2, dy2) < squa_sum(cr.r+w, 0));
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
function newTicker(t, f, d) {
	var _t = {
		t: t,
		c: 0,
		d: d,
		f: f,
		run: function(dt) {
			for (_t.c += dt; _t.c >= _t.t; _t.c -= _t.t)
				_t.f(_t.d);
		},
	}
	return _t;
}
function newAnimateList() {
	var _t = [], unused = [];
	var cleaner = newTicker(1000, function() {
		var len = unused.length;
		if (len > 100 || (len > 30 && unused.last_len > 30))
			_t.clean();
		unused.last_len = len;
	});

	_t.clean = function() {
		var ls = _t.filter(return_self);
		_t.length = unused.length = 0;
		_t.push.apply(_t, ls);
	};
	_t.add = function(t) { // t should be object returned from newTicker()
		t.finished = false;
		_t[unused.length ? unused.pop() : _t.length] = t;
	};
	_t.run = function(dt) {
		for (var i = 0, n = _t.length; i < n; i ++) {
			var t = _t[i];
			if (t)
				t.run(dt);
			if (t && t.finished) {
				_t[i] = undefined;
				unused.push(i);
			}
		}
		cleaner.run(dt);
	}
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
		var st = trans ? trans.split(' ') : [];
		return ieach(st, function(i, v, d) {
			var st = v.split(':'),
				k = st[0],
				vs = st[1].split(',');
			ieach(vs, function(i, v) {
				d.push({ k:k, v:v });
			});
		}, []);
	}
	function updateCanvas(canv, from, trans) {
		var sc = getSrc(from),
			ts = getTrans(trans),
			dc = canv.getContext('2d');
		canv.width = sc.w * ts.length;
		canv.height = sc.h;
		ieach(ts, function(i, t) {
			dc.save();
			if (t.k == 'mirror') {
				if (t.v == 'x') {
					dc.translate(canv.width, 0);
					dc.scale(-1, 1);
				}
				else if (t.v == 'y') {
					dc.translate(0, canv.height);
					dc.scale(1, -1);
				}
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					0, 0, sc.w, sc.h);
			}
			else if (t.k == 'rotate') {
				dc.translate(sc.w*i + sc.w/2, sc.h/2);
				dc.rotate(parseInt(t.v)*Math.PI/180);
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					-sc.w/2, -sc.h/2, sc.w, sc.h);
			}
			dc.restore();
		});
	}
	function loaded() {
		ieach(res.children, function(i, v, d) {
			if (v.tagName == 'CANVAS') {
				var from = $attr(v, 'from'),
					trans = $attr(v, 'transform');
				if (from)
					updateCanvas(v, from, trans);
				d[v.id] = v;
			}
			else if (v.tagName == 'IMG') {
				d[v.id] = v;
			}
			else if (v.tagName == 'SCRIPT') {
				d[v.id] = eval(v.innerHTML)();
			}
		}, _t);
	}
	_t.check = function check(fn) {
		var ls = ieach(res.children, function(i, v, d) {
			if (v.tagName == 'IMG')
				d.push(v.complete ? 1 : 0);
		}, []);
		_t.process = sum(ls) / ls.length;
		if (_t.process == 1) {
			loaded();
			fn();
		}
		else setTimeout(function() {
			check(fn);
		}, 500);
	};
	return _t;
})($e('res'));

var SPRITE = (function() {
	var _t = {
		obj: {},
		init: {},
		proto: {},
		sort: [],
	};
	var clsId = 0;
	_t.newCls = function(c, proto, init) {
		var from = proto.from ? new _t.init[proto.from]() : {};
		proto = extend(from, proto, {
			clsName: c,
			clsId: clsId++,
		});

		_t.obj[c] = [];
		_t.init[c] = init;
		_t.proto[c] = init.prototype = proto;
		_t.sort.push([proto.layer || c, c]);
		_t.sort.sort();
		return proto;
	};
	_t.newObj = function(c, data) {
		var ls = _t.obj[c],
			obj = new _t.init[c](data);

		var idx = ieach(ls, function(i, v) {
			if (!v.isAlive) return i;
		}, ls.length);
		obj.idx = idx;
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
	_t.getAliveOne = function(c) {
		for (var ls = _t.obj[c], i = 0, n = ls.length; i < n; i ++)
			if (ls[i].isAlive) return ls[i];
	},
	_t.getAliveAll = function(c) {
		var ret = [];
		for (var ls = _t.obj[c], i = 0, n = ls.length; i < n; i ++)
			if (ls[i].isAlive) ret.push(ls[i]);
		return ret;
	},
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
		'PLAYER_DYING',
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
		n = (n >= 0) ? n : 1;
		_t.anim.add(newTicker(t, function(d) {
			this.finished = f(d, --n) || n <= 0;
		}, d));
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
			var hits = SPRITE.proto[c1].hits;
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
	addAnimate: function(v, t, f, d) {
		var t = newTicker(t, function() {
			this.finished = f(d, v) || !v.isAlive;
		});
		STORY.anim.add(t);
		// execute once after added
		t.f(t.d);
	},
	// fs should be array of objects like
	// { res:'', sx:0, sy:0, sw:10, sh:10, w:10, h:10, [rotate:1] }
	addFrameAnim: function(v, t, fs) {
		UTIL.addAnimate(v, t, function(d) {
			d.index = (d.index + 1) % d.frames.length;
			v.data.frame = d.frames[d.index];
		}, {
			frames: fs,
			index: 0
		});
	},
	// fgs: array of fs in newFrameAnim
	// fn should return frames to display
	addFrameGroupAnim: function(v, t, fn) {
		UTIL.addAnimate(v, t, function(d) {
			d.frames = fn(v, d);
			d.index = (d.index + 1) % d.frames.length;
			v.data.frame = d.frames[d.index];
		}, {
			frames: undefined,
			index: 0
		});
	},
	// ps should be array of objects like
	// { x/fx:0, y/fy:0, v:10 }
	// x and y should be between 0 and 1
	addPathAnim: function(v, t, ps) {
		UTIL.addAnimate(v, t, function(d) {
			var e = v.data,
				n = d.pathnodes[d.index];
			if (!n)
				return true;

			if (+n.fx === n.fx)
				n.x = interp(GAME.rect.l, GAME.rect.r, n.fx);
			if (+n.fy === n.fy)
				n.y = interp(GAME.rect.t, GAME.rect.b, n.fy);

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
		}, {
			pathnodes: ps,
			index: 0
		});
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
	var dt = newCounter();
	var gameTick = newTicker(10, function() {
		if (GAME.state == GAME.states.RUNNING)
			GAME.run(10);
	});
	setInterval(function() {
		gameTick.run(Math.min(dt(), 100));
	}, 10);

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
			gameTick.run(Math.min(dt(), 100));
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
		if (d.parent && d.parent.state.d.dying && !s.d.dying)
			s.setWith('dying');

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
		var f = d.frame,
			w = (f.w || f.sw) * d.scale,
			h = (f.h || f.sh) * d.scale;
		if (f.rotate) {
			var t = +f.rotate===f.rotate ? f.rotate :
				Math.PI*1.5 + Math.atan2(d.vy, d.vx);
			DC.translate(d.x, d.y);
			DC.rotate(t);
			DC.drawImageInt(RES[f.res],
				f.sx, f.sy, f.sw, f.sh,
				-w/2, -h/2, w, h);
		}
		else DC.drawImageInt(RES[f.res],
			f.sx, f.sy, f.sw, f.sh,
			d.x-w/2, d.y-h/2, w, h);
	},
	draw: function() {
		var d = this.data, s = this.state;
		DC.save();

		if (s.d.creating)
			DC.globalAlpha = d.max_opacity = s.d.age / s.d.life;
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
		{ creating: 1, life: 500, next: 1 },
		{ living:   1, life: Math.Inf, next: 2 },
		{ dying:    1, life: 500 }
	],
}, function(d) {
	this.isAlive = true;
	this.state = UTIL.newAliveState(this.states);
	this.data = extend({
		x: interp(GAME.rect.l, GAME.rect.r, 0.5),
		y: interp(GAME.rect.t, GAME.rect.b, 0.5),
		text: 'Static Text',
		color: undefined,
		font: undefined,

		parent: undefined, // if parent is dead, it will kill self too

		frame: undefined, // i.e. {res:'player0L', sx:0, sy:0, sw:10, sh:10, w:10, h:10}
		scale: 1,

		frtick: 50,
		frames: undefined, // array of frames
	}, d);
	if (this.data.frames) {
		if (this.data.frames.length > 1)
			UTIL.addFrameAnim(this, this.data.frtick, this.data.frames);
		else
			this.data.frame = this.data.frames[0];
	}
});
ieach([10, 20, 99], function(i, v) {
	SPRITE.newCls('StaticL'+v, {
		from: 'Static',
		layer: 'L'+v,
	}, function(d) {
		SPRITE.init.Static.call(this, d);
	});
});

SPRITE.newCls('Base', {
	from: 'Static',
	runBase: undefined,
	mkRect: function(rt, d) {
		rt.l = Math.min(d.x0, d.x) - d.r*1.1;
		rt.t = Math.min(d.y0, d.y) - d.r*1.1;
		rt.r = Math.max(d.x0, d.x) + d.r*1.1;
		rt.b = Math.max(d.y0, d.y) + d.r*1.1;
	},
	checkPosition: function(rt, sp) {
		if (rt.r+sp.l < GAME.rect.l ||
			rt.l-sp.r > GAME.rect.r ||
			rt.b+sp.t < GAME.rect.t ||
			rt.t-sp.b > GAME.rect.b) {
			this.isAlive = false;
			STORY.on(STORY.events.OBJECT_OUT, this);
		}
	},
	runStatic: function(dt, d, s) {
		d.x0 = d.x;
		d.y0 = d.y;
		if (this.runBase)
			this.runBase(dt, d, s);
		d.x += d.vx * dt;
		d.y += d.vy * dt;

		var rt = this.rect, sp = this.space;
		this.mkRect(rt, d);
		this.checkPosition(rt, sp);
	},
	drawCircle: function(d, s) {
		if (d.color)
			DC.fillStyle = d.color;
		DC.beginPath();
		DC.arc(d.x, d.y, d.r, 0, 2*Math.PI);
		DC.closePath();
		DC.fill();
	},
	drawStatic: function(d, s) {
		if (d.frame)
			this.drawFrame(d, s);
		else
			this.drawCircle(d, s);
	},
	space: {
		l: 40,
		r: 40,
		t: 40,
		b: 20
	},
}, function(d) {
	d = extend({
		r: 10,
		vx: 0,
		vy: 0,
		x0: 0,
		y0: 0,
	}, d);
	SPRITE.init.Static.call(this, d);
	this.rect = { l:0, t:0, r:0, b:0 };
});

SPRITE.newCls('Player', {
	from: 'Static',
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
		else if (v.clsId == SPRITE.proto.Drop.clsId && v.state.d.living) {
			if (circle_intersect(d, { x:e.x, y:e.y, r:20 })) {
				STORY.on(STORY.events.PLAYER_GETDROP, this);
				STORY.on(STORY.events.DROP_COLLECTED, v);
			}
			else
				e.collected = this;
		}
		else if (v.clsId == SPRITE.proto.Player.clsId) {
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
			v = m ? 0.12 : 0.35;
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
			if (!d.is_firing) {
				d.fire_tick = newTicker(d.conf.fire_interval, function(v) {
					STORY.on(STORY.events.PLAYER_FIRE, v);
				}, this);
				d.fire_tick.f(this);
			}
			d.is_firing = true;
			d.fire_count = d.conf.fire_count;
		}
		else if (d.is_firing) {
			d.fire_count -= dt;
			if (d.fire_count <= 0)
				d.is_firing = false;
		}
		if (d.is_firing)
			d.fire_tick.run(dt);

		// BOMB!
		if (GAME.keyste[d.conf.key_bomb] && !s.d.bomb)
			STORY.on(STORY.events.PLAYER_BOMB, this);

		// AUTO COLLECT!
		if (d.y < interp(GAME.rect.t, GAME.rect.b, 0.3))
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT, v);
	},
	runStatic: function(dt, d, s) {
		if (!this.isAlive) {
			STORY.on(STORY.events.PLAYER_DEAD, this);
			return;
		}

		if (!s.d.dying)
			this.runPlayer(dt, d, s);
		else if (!d.is_dying)
			STORY.on(STORY.events.PLAYER_DYING, this);
		d.is_dying = s.d.dying;

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

	states: [
		{ creating: 1, life: 1000, next:  1, isInvinc: 1 },
		{ living:   1, life: Math.Inf, next:  2 },
		{ dying:    1, life: 1000, isInvinc: 1 },
		{ bomb:     1, life: 5000, next:  2, isInvinc: 1 },
		{ juesi:    1, life:  100, next:  2, isInvinc: 1 },
	],
}, function(d) {
	d = extend({
		r: 15,
		h: 3,

		x: interp(GAME.rect.l, GAME.rect.r, 0.5),
		y: interp(GAME.rect.t, GAME.rect.b, 0.8),
		vx: 0,
		vy: 0,
		x0: 0,
		y0: 0,
	}, d);
	SPRITE.init.Static.call(this, d);
	this.rect = { l:0, t:0, r:0, b:0 };

	UTIL.addFrameGroupAnim(this, 120, function(v, d) {
		var fs = RES.frames.Player0;
		if (v.state.d.dying) {
			fs = RES.frames.PlayerD;
			if (d.index + 1 > fs.length - 1)
				d.index = fs.length - 2;
		}
		else if (Math.abs(v.data.vx) > 0.1) {
			fs = v.data.vx < 0 ? RES.frames.PlayerL : RES.frames.PlayerR;
			if (d.frames != fs)
				d.index = 0;
			if (d.index + 1 > fs.length - 1)
				d.index = 2;
		}
		return fs;
	}),
	this.data.conf = extend({
		key_left: 37,
		key_up: 38,
		key_right: 39,
		key_down: 40,
		key_fire: GAME.keychars.Z,
		key_bomb: GAME.keychars.X,
		fire_interval: 80,
		fire_count: 500,
	}, this.data.conf);
});

SPRITE.newCls('Ball', {
	from: 'Base',
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
}, function(d) {
	SPRITE.init.Base.call(this, d);
});

SPRITE.newCls('Enemy', {
	from: 'Base',
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
}, function(d) {
	d = extend({
		r: 20,
		y: interp(GAME.rect.t, GAME.rect.b, 0.1),
		life: 10,
		damage: 0
	}, d);
	SPRITE.init.Base.call(this, d);
});

SPRITE.newCls('Bullet', {
	from: 'Base',
	layer: 'L20',
	runBase: function(dt, d, s) {
		var u = d.to,
			e = u && u.data;
		if (!u || !u.isAlive || !u.state.d.mkDamage)
			return;
		var dx = e.x - d.x,
			dy = e.y - d.y,
			r = sqrt_sum(dx, dy),
			v = sqrt_sum(d.vx, d.vy);
		d.vx = v * dx / r;
		d.vy = v * dy / r;
	},
	states: [
		{ creating: 1, life: 50, next: 1 },
		{ living:   1, life: Math.Inf, next: 2 },
		{ dying:    1, life: 10 }	
	],
}, function(d) {
	d = extend({
		r: 5,
		vy: -0.5,
		from: undefined, // from which player
		to: undefined,	// to which enemy
	}, d);
	SPRITE.init.Base.call(this, d);
});

SPRITE.newCls('Drop', {
	from: 'Base',
	layer: 'L20',
	runBase: function(dt, d, s) {
		var v = d.collected;
		if (v && !v.isAlive)
			v = d.collected = SPRITE.getAliveOne('Player');
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
		else if (d.vy < 0.15) {
			d.vy += 0.001 * dt;
			d.vx *= 0.9;
		}
	},
	space: {
		l: 40,
		r: 40,
		t: 300,
		b: 20
	},
	states: [
		{ creating: 1, life: 300, next: 1 },
		{ living:   1, life: Math.Inf, next: 2 },
		{ dying:    1, life: 100 }
	],
}, function(d) {
	d = extend({
		r: 60,
		vy: -0.4,
		collected: undefined,
		collected_auto: false,
		frames: [ RES.frames.Drops[2] ],
	}, d);
	SPRITE.init.Base.call(this, d);
});

SPRITE.newCls('Dannmaku', {
	from: 'Base',
	layer: 'L20',
	states: [
		{ creating: 1, life: 100, next: 1 },
		{ living:   1, life: Math.Inf, next: 2, mkDamage: 1 },
		{ dying:    1, life: 100 },
	],
}, function(d) {
	d = extend({
		r: 5,
		vy: 0.3,
		from: null,
		type: 0
	}, d);
	SPRITE.init.Base.call(this, d);
});

// for test only
function newPlayer() {
	var p = SPRITE.newObj('Player');
	p.data.onmyous = {
		left:  SPRITE.newObj('Static', {
			parent: p, frames: RES.frames.Onmyou,
			anim: { r:25, t:0.9, max:0.9, min:0.6, v:-0.002 }
		}),
		right: SPRITE.newObj('Static', {
			parent: p, frames: RES.frames.Onmyou,
			anim: { r:25, t:0.1, max:0.4, min:0.1, v:+0.002 }
		}),
	};
	keach(p.data.onmyous, function(k, s) {
		s.runStatic = function(dt, d, s) {
			var a = d.anim,
				dv = p.data.slowMode ? a.v : -a.v;
			a.t = limit_between(a.t + dt * dv, a.min, a.max);
			d.x = d.parent.data.x + a.r * Math.cos(a.t * Math.PI);
			d.y = d.parent.data.y - a.r * Math.sin(a.t * Math.PI);
		};
	});
}
function newBall(v, fy) {
	var t = random(-0.6, 0.6) * Math.PI / 2,
		r = random(10) + 5;
	SPRITE.newObj('Ball', {
		x: random(GAME.rect.l, GAME.rect.r),
		y: random(GAME.rect.t, interp(GAME.rect.t, GAME.rect.b, fy)),
		vx: v*Math.sin(t),
		vy: v*Math.cos(t),
		r: r,
		scale: 2.5*r / 32,
		frames: [ RES.frames.TamaLarge[randin(range(8))] ],
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
			t = (v.data.slowMode ? random(-5, 5) : random(10, 20)) * Math.PI / 180,
			onmyou = x > 0 ? v.data.onmyous.right : v.data.onmyous.left;
		SPRITE.newObj('Bullet', {
			x: v.data.x + 10*x,
			y: v.data.y,
			vy: -v0,
			from: v,
			frames: RES.frames.Bullet0,
		});
		SPRITE.newObj('Bullet', {
			x: onmyou.data.x,
			y: onmyou.data.y,
			vy: -v1*Math.cos(t),
			vx: v1*x*Math.sin(t),
			from: v,
			to: e,
			frames: RES.frames.Bullet1,
		});
	});
}
function updateDannmaku(d, v) {
	if (d.type == 'FollowSource') {
		fill(d, {
			duration: 1500,
			gravity: 20e-7,
		});
		v.runBase = function(dt, d, s) {
			if (this.state.d.age < d.duration && d.from) {
				var e = d.from.data;
				d.vx -= d.gravity * dt * (d.x - e.x);
				d.vy -= d.gravity * dt * (d.y - e.y);
			}
		};
	}
	else if (d.type == 'SlowingDown') {
		fill(d, {
			min_velocity: 0.02,
			decrease_by: 0.992,
		});
		v.runBase = function(dt, d, s) {
			if (Math.abs(d.vx) > d.min_velocity) d.vx *= d.decrease_by;
			if (Math.abs(d.vy) > d.min_velocity) d.vy *= d.decrease_by;
		};
	}
	else if (d.type == 'FollowTarget') {
		fill(d, {
			duration: 1000,
			gravity: 10e-7,
			decrease_by: 0.98,
		});
		v.runBase = function(dt, d, s) {
			if (this.state.d.age < d.duration) {
				d.vx *= d.decrease_by;
				d.vy *= d.decrease_by;
			}
			else {
				if (!d.to || !d.to.isAlive)
					d.to = SPRITE.getAliveOne('Player');
				if (d.to) {
					var e = d.to.data;
					d.vx -= d.gravity * dt * (d.x - e.x);
					d.vy -= d.gravity * dt * (d.y - e.y);
				}
			}
		};
	}
	else if (d.type == 'OrbAround') {
		fill(d, {
			pos: { x:d.from.data.x, y:d.from.data.y, t:0 },
			dir: undefined,
			speed: 1/300,
		});
		v.runBase = function(dt, d, s) {
			var f = d.from;
			if (f && f.isAlive && !f.state.d.dying) {
				d.pos.t += dt;
				d.x = 100*Math.sin(d.pos.t*d.speed) + d.pos.x;
				d.y = 100*Math.cos(d.pos.t*d.speed) + d.pos.y;
			}
		};
	}
}
function genDannmaku(d, v) {
	if (d.type == 'any') {
	}
	else {
		d = extend({
			theta: 0,
			theta_rand: 0.05,
			theta_rand_min: 0.8,
			theta_rand_max: 1.2,
			theta_step: 0.15,
			theta_count: 9,
			theta_reverse: false,
			theta_velocity: 0.0,
			theta_velocity_flip: false,
			count: 9,
			layers: 10,
			interval: 200,
			radius: 20,
			velocity: 0.2,
			from: v,
			x: undefined,
			y: undefined,
			to: undefined,
			dannmaku: undefined,
		}, {
			'com1': {
				count: 1,
				layers: 50,
				interval: 50,
			},
			'com2': {
				count: 1,
				layers: 50,
				interval: 50,
				theta_reverse: true,
			},
		}[d && d.preset], d);
		var idx = 0, cnt = d.theta_count-1;
		STORY.timeout(function(d, layer) {
			if (v && v.state.d.living) {
				for(var count = 0; count < d.count; count ++) {
					if (idx ++ >= cnt)
						idx = d.theta_reverse ? -cnt : 0;
					d.theta = (Math.abs(idx) - cnt/2) * d.theta_step;
					if (d.theta_velocity_flip)
						d.theta_velocity = -d.theta_velocity;

					var to = d.to ? d.to.data : SPRITE.getAliveOne('Player').data,
						from = +d.x === d.x ? { x:d.x, y:d.y } : d.from.data,
						t = Math.atan2(to.y-from.y, to.x-from.x) +
							d.theta*random(d.theta_rand_min, d.theta_rand_max)+random(d.theta_rand);
					var dmk = SPRITE.newObj('Dannmaku', extend({
						x: from.x + d.radius*Math.cos(t),
						y: from.y + d.radius*Math.sin(t),
						vx: d.velocity*Math.cos(t+d.theta_velocity),
						vy: d.velocity*Math.sin(t+d.theta_velocity),
						r: 3,
						from: v,
						frames: RES.frames.LongA,
						generator: { layer:layer, count:count },
					}, d.dannmaku));
					updateDannmaku(dmk.data, dmk);
				};
			}
			else
				this.finished = true;
		}, d.interval, d, d.layers);
	}
}
function newEnemy(d, f) {
	d = extend({
		x: random(GAME.rect.l+100, GAME.rect.r-100),
		vx: random(-0.05, 0.05),
		vy: random(0.01, 0.1),
		r: 16,
		frtick: 150,
		frames: RES.frames['Enemy'+randin([0,1])+randin([0,1,2])],
	}, {
		'com1': {
			// example
		}
	}[d && d.preset], d);
	f = f || {
		delay: 1000,
	};
	var enm = SPRITE.newObj('Enemy', d);
	if (f) STORY.timeout(function(enm) {
		genDannmaku(f, enm);
	}, f.delay || 0, enm);
}
function newBoss() {
	var boss = SPRITE.newObj('Enemy', {
		r: 24,
		life: 300,
		frtick: 150,
		frames: RES.frames.EnemyX,
	});
	UTIL.addPathAnim(boss, 30, [
		{ fx:0.0, fy:0.0, v:3 },
		{ fx:0.1, fy:0.1, v:3 },
		{ fx:0.5, fy:0.1, v:3 },
	]);
	boss.data.ext = Array(3);
	ieach(boss.data.ext, function(i, v) {
		UTIL.addAnimate(boss, 50, function(d) {
			d.t += d.vt;
			d.p += d.vp;
			d.i = (d.i + 1) % 16;
			boss.data.ext[i] = {
				x: d.a*Math.cos(d.t)*Math.cos(d.p) - d.b*Math.sin(d.t)*Math.sin(d.p),
				y: d.a*Math.cos(d.t)*Math.sin(d.p) + d.b*Math.sin(d.t)*Math.cos(d.p),
				z: Math.sin(d.t),
				s: 1.0 + 0.4*Math.sin(d.t),
				frame: RES.frames.EffBoss[d.i],
			}
		}, {
			i: 0,
			t: 0,
			vt: random(0.05, 0.10),
			p: random(1),
			vp: random(0.01, 0.05),
			a: 30,
			b: 10,
		});
	});
	boss.drawStatic = function(d, s) {
		ieach(boss.data.ext, function(i, e) {
			if (e.z < 0) {
				var f = e.frame;
				DC.drawImageInt(RES[f.res], f.sx, f.sy, f.sw, f.sh,
					d.x+e.x-f.sw/2, d.y+e.y-f.sh/2, f.sw*e.s, f.sh*e.s);
			}
		});
		if (d.frame)
			this.drawFrame(d, s);
		ieach(boss.data.ext, function(i, e) {
			if (e.z > 0) {
				var f = e.frame;
				DC.drawImageInt(RES[f.res], f.sx, f.sy, f.sw, f.sh,
					d.x+e.x-f.sw/2, d.y+e.y-f.sh/2, f.sw*e.s, f.sh*e.s);
			}
		});
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
		frames: {
			Enemy: RES.frames.EffEnemy,
			Player: RES.frames.EffPlayer,
		}[v.clsName],
	});
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
		}
		else if (e == STORY.events.PLAYER_GRAZE) {
			GAME.statics.graze ++;
		}
		else if (e == STORY.events.PLAYER_DYING) {
			var vy = -0.8,
				x = v.data.x,
				y = v.data.y;
			SPRITE.newObj('Drop', { vy:vy, x:x+90, y:y-50 });
			SPRITE.newObj('Drop', { vy:vy, x:x+30, y:y-60 });
			SPRITE.newObj('Drop', { vy:vy, x:x-30, y:y-60 });
			SPRITE.newObj('Drop', { vy:vy, x:x-90, y:y-50 });
			newEffect(v);
		}
		else if (e == STORY.events.PLAYER_DEAD) {
			GAME.statics.miss ++;
			newPlayer();
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
		newPlayer();
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
		STORY.timeout(function(d, n) {
			newBall(n > 10 ? 0.05 : 0.25, n > 10 ? 0.6 : 0.2);
		}, 20, null, 60);
	},
	quit: function(d) {
		killCls('Ball');
	},
	on: function(e, v, d) {
		if (e == STORY.events.OBJECT_OUT) {
			if (v.clsId == SPRITE.proto.Ball.clsId) {
				var fy = random(0.2, 0.6);
				newBall(0.6-fy, fy);
			}
		}
	}
};
tl.sec1 = {
	init: function(d) {
		STORY.timeout(function(d, n) {
			if (n < 3) newEnemy();
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
				frames: [ RES.frames.Drops[1] ],
			});
		}, 'Dannmaku');
		STORY.timeout(function() {
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT,
				SPRITE.getAliveOne('Player'));
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
			if (pass) STORY.timeout(function(d) {
				d.pass = true;
			}, 100, d);
		}
		else if (e == STORY.events.OBJECT_OUT) {
			if (v.clsId == SPRITE.proto.Enemy.clsId && !v.state.d.dying)
				newEnemy();
		}
	}
};
ieach([
	{ t:'x0aabbcc', x:GAME.rect.l+50, y:interp(GAME.rect.t, GAME.rect.b, 0.8), name:'diag' },
	{ t:'y0aabbcc', x:GAME.rect.r-50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ t:'x0aabbcc', x:GAME.rect.l+50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ t:'y0aabbcc', x:GAME.rect.r-50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ t:'x0aabbcc', x:GAME.rect.l+50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ t:'y0aabbcc', x:GAME.rect.r-50, y:interp(GAME.rect.t, GAME.rect.b, 0.8), next:'boss' },
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
		killCls('Enemy', 'Dannmaku');
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

RES.check(function() {
	STORY.load(tl, tl.all);
	GAME.start('init');
//	STORY.state.set('sec1');
});
