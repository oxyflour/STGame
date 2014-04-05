var Inf = parseFloat('Infinity');

function return_nothing() {
}
function return_self(x) {
	return x;
}
function range(e, b, d, fn) {
	var ls = [];
	for (var i = b||0, k = d||1; i < e; i += k) {
		ls.push(fn ? fn(i) : i);
	}
	return ls;
}
function array(n, fn) {
	return range(n, 0, 1, fn);
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
	var ks = keys(ls),
		i = Math.floor(random(ks.length)),
		k = ks[i];
	return ls[k];
}
function limit_between(x, min, max) {
	if (!(x <= max)) x = max;
	if (!(x >= min)) x = min;
	return x;
}
function keep_outside(x, min, max) {
	if (!(x >= max) && !(x <= min))
		x = (x + x > max + min) ? max : min;
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
function line_circle_intersect(ln, cr) {
	var dx = ln.dx, dy = ln.dy,
		dx1 = cr.x - ln.x, dy1 = cr.y - ln.y, t1 = dx1*dx + dy1*dy,
		dx2 = dx1 - dx, dy2 = dy1 - dy, t2 = dx2*dx + dy2*dy,
		ret = { x:0, y:0, vx:0, vy:0, r:ln.r, mass:1e3 };
	if (((t1 > 0 && t2 < 0) || (t1 < 0 && t2 > 0)) &&
			squa_sum(dy*dx1 - dx*dy1, 0) / squa_sum(dx, dy) < squa_sum(cr.r+ln.r, 0)) {
		var dxq = dx*dx, dyq = dy*dy, dxy = dx*dy;
		ret.x = (dyq*ln.x+dxq*cr.x + dxy*(cr.y-ln.y)) / (dxq + dyq);
		ret.y = (dxq*ln.y+dyq*cr.y + dxy*(cr.x-ln.x)) / (dxq + dyq);
		return ret;
	}
	else if (t1 <= 0 && squa_sum(dx1, dy1) < squa_sum(cr.r+ln.r, 0)) {
		ret.x = ln.x;
		ret.y = ln.y;
		return ret;
	}
	else if (t2 >= 0 && squa_sum(dx2, dy2) < squa_sum(cr.r+ln.r, 0)) {
		ret.x = ln.x + dx;
		ret.y = ln.y + dy;
		return ret;
	}
}
function circles_hit(cr1, cr2) {
	if (cr1.x == cr2.x && cr1.y == cr2.y)
		cr2[randin(['x', 'y'])] += randin([-1, 1]) * 1e-3;
	var r = sqrt_sum(cr1.x - cr2.x, cr1.y - cr2.y),
		sin = (cr1.y - cr2.y) / r,
		cos = (cr1.x - cr2.x) / r,
		md = cr1.mass || cr1.r,
		me = cr2.mass || cr2.r,
		vd = sqrt_sum(cr1.vx, cr1.vy),
		ve = sqrt_sum(cr2.vx, cr2.vy),
		vdn = cr1.vx*cos + cr1.vy*sin, vdr = cr1.vx*sin - cr1.vy*cos,
		ven = cr2.vx*cos + cr2.vy*sin, ver = cr2.vx*sin - cr2.vy*cos;
	var vdn2 = (vdn*(md - me)+2*me*ven)/(md+me),
		ven2 = (ven*(me - md)+2*md*vdn)/(md+me);
	cr1.vx = vdn2*cos + vdr*sin; cr1.vy = vdn2*sin - vdr*cos;
	cr2.vx = ven2*cos + ver*sin; cr2.vy = ven2*sin - ver*cos;
	var cx = (cr1.x*cr2.r+cr2.x*cr1.r)/(cr1.r+cr2.r),
		cy = (cr1.y*cr2.r+cr2.y*cr1.r)/(cr1.r+cr2.r),
		f = 1.01;
	cr1.x = cx + cr1.r*cos*f; cr1.y = cy + cr1.r*sin*f;
	cr2.x = cx - cr2.r*cos*f; cr2.y = cy - cr2.r*sin*f;
}
function redirect_object(from, to, v) {
	var dx = to.x - from.x,
		dy = to.y - from.y,
		r = sqrt_sum(dx, dy);
	from.vx = v * dx / r;
	from.vy = v * dy / r;
	return r;
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
function $style(e, k) {
	var style = getComputedStyle(e);
	return style && style.getPropertyValue(k);
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
		len = 120,
		arr = Array(len);
	return function(t) {
		var fps = 1000 * len / (t - arr[idx]);
		arr[idx] = t;
		idx = (idx + 1) % len;
		return fps;
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
	_t.add = function(t) { // t should be object like { run: function(){} }
		t.finished = false;
		_t[unused.length ? unused.pop() : _t.length] = t;
	};
	_t.run = function(dt) {
		for (var i = 0, n = _t.length; i < n; i ++) {
			var t = _t[i];
			if (t) {
				if (t.finished) {
					_t[i] = undefined;
					unused.push(i);
				}
				else
					t.run(dt);
			}
		}
		cleaner.run(dt);
	}
	return _t;
}
function newGroupAnim() {
	var _t = [];
	_t.groups = {};
	_t.sort = [];
	_t.resort = function() {
		_t.sort = keys(_t.groups).sort();
		_t.length = 0;
		ieach(_t.sort, function(i, k) {
			_t.push(_t.groups[k]);
		});
	};
	_t.add = function(k, t) {
		var ls = _t.groups[k];
		if (!ls) {
			ls = _t.groups[k] = newAnimateList();
			_t.resort();
		}
		ls.add(t);
	};
	_t.run = function(dt) {
		for (var i = 0, n = _t.length; i < n; i ++)
			_t[i].run(dt);
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
	canv.width = canv.scrollWidth;
	canv.height = canv.scrollHeight;
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
		if (sw > 0 && sh > 0)
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
			w: im.naturalWidth || im.width,
			h: im.naturalHeight || im.height,
		}
	}
	function getTrans(trans) {
		var st = (trans || '').split(';');
		return ieach(st, function(i, s, d) {
			var k = s.substr(0, s.indexOf(':')),
				v = s.substr(k.length + 1);
			v = v.replace(/{{([^{}]+)}}/gm, function(match, name) {
				var r = eval(name);
				return r.join ? r.join(',') : r;
			});
			ieach(v.split(','), function(i, v) {
				d.push({ k:k, v:v });
			});
		}, []);
	}
	function updateCanvas(canv, from, trans) {
		var sc = getSrc(from),
			ts = getTrans(trans),
			dc = canv.getContext('2d'),
			sk = $attr(canv, 'stack') == 'y' ? [0, 1] : [1, 0];
		canv.width = sc.w + sc.w*(ts.length-1)*sk[0];
		canv.height = sc.h + sc.h*(ts.length-1)*sk[1];
		ieach(ts, function(i, t) {
			dc.save();
			dc.translate(sc.w*i*sk[0], sc.h*i*sk[1]);
			if (!t.k || t.k == 'mirror') {
				if (t.v.indexOf('x') >= 0) {
					dc.translate(sc.w, 0);
					dc.scale(-1, 1);
				}
				if (t.v.indexOf('y') >= 0) {
					dc.translate(0, sc.h);
					dc.scale(1, -1);
				}
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					0, 0, sc.w, sc.h);
			}
			else if (t.k == 'rotate') {
				dc.translate(sc.w/2, sc.h/2);
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
				d[v.id] = eval(v.innerHTML)(_t);
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
	function loop(ls, fn) {
		if (ls) return ieach(ls, function(i, v) {
			if (v && !v.finished)
				return fn(i, v);
		});
	}
	var _t = {
		cls: newGroupAnim(),
		layers: newGroupAnim(),
		init: {},
		proto: {},
	};
	_t.newCls = function(c, proto, init) {
		var from = proto.from ? new _t.init[proto.from]() : {};
		proto = extend(from, proto);
		proto.clsName = c;

		_t.init[c] = init;
		_t.proto[c] = init.prototype = proto;

		return proto;
	};
	_t.newObj = function(c, data) {
		var obj = new _t.init[c](data);
		_t.cls.add(c, obj);
		_t.layers.add(obj.layer, {
			obj: obj,
			run: function() {
				(this.finished = this.obj.finished) || this.obj.draw();
			}
		});
		return obj;
	};
	_t.eachObj = function(fn, c) {
		if (c)
			return loop(_t.cls.groups[c], fn);
		else return ieach(_t.cls, function(i, ls) {
			return loop(ls, fn);
		});
	};
	_t.clrObj = function(c) {
		_t.eachObj(function(i, v) {
			v.finished = true;
		}, c);
	};
	return _t;
})();

var STORY = (function() {
	var _t = [];
	_t.events = dictflip([
		'STORY_LOAD',
		'GAME_INPUT',
		'OBJECT_OUT',
		'PLAYER_HIT',
		'PLAYER_DYING',
		'PLAYER_DEAD',
		'PLAYER_AUTOCOLLECT',
		'PLAYER_GRAZE',
		'PLAYER_FIRE',
		'PLAYER_BOMB',
		'PLAYER_BOMBEND',
		'DROP_COLLECTED',
		'BULLET_HIT',
		'DANNMAKU_HIT',
		'ENEMY_KILL'
	]);
	_t.state = _t.anim = _t.hook = {};
	_t.load = function(tl, hook) {
		_t.state = newStateMachine(tl);
		_t.anim = newAnimateList();
		_t.hook = extend({
			init: undefined,
			quit: undefined,
			before_run: undefined,
			after_run: undefined,
			before_on: undefined,
			after_on: undefined,
		}, hook);
		_t.state.set = (function(set, hk) {
			return function(n) {
				if (hk.quit)
					hk.quit(this.n, this.d);
				set.call(this, n);
				if (hk.init)
					hk.init(this.n, this.d);
			};
		})(_t.state.set, _t.hook);
	}
	_t.timeout = function(f, t, d, n) {
		var s = _t.state.s;
		n = (n >= 0) ? n : 1;
		_t.anim.add(newTicker(t, function(d) {
			this.finished = _t.state.s != s || f(d, --n) || n <= 0;
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
		SPRITE.eachObj(function(i, obj1) {
			SPRITE.eachObj(function(j, obj2) {
				if (c1 == c2 && j >= i)
					return;
				if (rect_intersect(obj1.rect, obj2.rect))
					obj1.hit(obj2, dt);
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
		r: DC.canvas.width,
		b: DC.canvas.height
	};
	_t.load = function(tl, hk) {
		STORY.load(tl, hook);
		STORY.on(STORY.events.STORY_LOAD);
	};
	_t.start = function(n) {
		STORY.state.set(n);
		_t.state = _t.states.RUNNING;
	};
	_t.run = function(dt) {
		ieach(SPRITE.cls.sort, function(i, c1) {
			var hits = SPRITE.proto[c1].hits;
			if (hits) ieach(hits, function(i, c2) {
				testhit(c1, c2, dt);
			});
		});
		SPRITE.cls.run(dt);
		STORY.run(dt);
	};
	_t.draw = function() {
		DC.clear();
		SPRITE.layers.run();
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
	getOneObj: function(c, fn) {
		var ls = SPRITE.cls.groups[c];
		return ls && ieach(ls, function(i, v, fn) {
			if (v && !v.finished) return fn ? fn(v) : v;
		}, fn);
	},
	addAnim: function(v, t, d, id) {
		fill(d, {
			value: 0,
			min: 0,
			max: 1,
			callback: undefined,
			step: 1,
			loop: undefined,
		});
		function loop(d, begin, end) {
			if (d.loop && d.loop.apply)
				d.loop(begin, end);
			else if (d.loop == 'restart')
				d.value = begin;
			else if (d.loop == 'reverse')
				d.step = -d.step;
			else
				d.value = end;
		}
		v.anim(t, function(d) {
			if (d.value > d.max && d.step > 0)
				loop(d, d.min, d.max);
			else if (d.value < d.min && d.step < 0)
				loop(d, d.max, d.min);
			if (d.callback)
				d.callback(v);
			d.value += d.step;
		}, d, id);
	},
	// fs can be function, frame array, or a single frame
	addFrameAnim: function(v, fs, t) {
		t = t || v.data.frtick || 50;
		v.anim(t, function(d) {
			if (d.callback)
				d.frames = d.callback(v, d);
			if (d.frames) {
				d.index = (d.index + 1) % d.frames.length;
				v.data.frame = d.frames[d.index];
			}
		}, {
			callback: fs.call && fs,
			frames: fs.length >= 0 ? fs : [fs],
			index: 0
		}, 'frame');
	},
	// ps should be array of objects like
	// { x/fx:0, y/fy:0, v:10 }
	// x and y should be between 0 and 1
	addPathAnim: function(v, ps, t) {
		t = t || v.data.pathtick || 50;
		v.anim(t, function(d) {
			var e = v.data,
				n = d.pathnodes[d.index];
			if (!n) {
				e.vx = e.vy = 0;
				return true;
			}

			if (+n.x !== n.x && +n.fx === n.fx)
				n.x = interp(GAME.rect.l, GAME.rect.r, n.fx);
			if (+n.y !== n.y && +n.fy === n.fy)
				n.y = interp(GAME.rect.t, GAME.rect.b, n.fy);

			if (d.index == 0) {
				d.index = 1;
				if (+n.x === n.x) e.x = n.x;
				if (+n.y === n.y) e.y = n.y;
			}
			else {
				if (redirect_object(e, n, n.v) < n.v * d.tick)
					d.index ++;
			}
		}, {
			tick: t,
			pathnodes: ps,
			index: 0
		}, 'path');
	},
	newTimeRunner: function(t, n) {
		return function(dt, d) {
			d.age = (d.age || 0) + dt;
			if (d.age > t) return n;
		}
	},
	// stes: array of objects like
	// { life:1000, [next:1] }
	newAliveState: function(stes, hk) {
		function init(d) {
			d.age = 0;
		}
		function run(dt, d) {
			d.age += dt;
			if (d.age > d.life)
				return d.next !== undefined ? d.next : -1;
		}

		if (!stes.name) stes.name = ['creating', 'living', 'dying'];
		if (!stes.next) stes.next = [1, 2, -1];

		stes = ieach(stes.life, function(i, n, d) {
			var data = each(stes, function(k, ls, d) {
				d[k] = ls[i];
			}, {});
			d[i] = { run:run, init:init, data:data };
		}, []);

		var s = newStateMachine(stes);

		s.set = (function(set) {
			return function(k) {
				k = ieach(this.stes, function(i, v, d) {
					if (v.data.name==k) return i;
				}, k);
				set.call(this, k);

				this.is_creating = this.d.name == 'creating';
				this.is_dying = this.d.name == 'dying';
				this.is_living = !(this.is_creating || this.is_dying);
			};
		})(s.set);

		if (hk) s.set = (function(set, hk) {
			return function(k) {
				hk && hk.quit && hk.quit(hk.data, this);
				set.call(this, k);
				hk && hk.init && hk.init(hk.data, this);
			};
		})(s.set, hk);

		s.die = function() {
			s.set('dying');
		}
		s.create = function() {
			s.set('creating');
		}
		s.set(0);

		return s;
	},
};

(function(counter) {
	var dt =  function() {
		return Math.min(counter(), 100);
	};
	var gameTick = newTicker(5, function() {
		if (GAME.state == GAME.states.RUNNING)
			GAME.run(5);
	});
	var uiTick = newTicker(100, function(cbs) {
		ieach($('.ui'), function(i, e) {
			ieach(cbs, function(i, cb) {
				var n = cb[0],
					f = cb[1],
					attr = e.attributes[n];
				if (attr) {
					var t = attr.textContent,
						k = 'ui-exec:'+n+':'+t,
						d = e[k] || (e[k] = {
							fn: f(e),
							fv: Function('return ('+t+')'),
							v: NaN,
						});
					var v = d.fv.call(e);
					if (v != d.v)
						d.fn.call(e, d.v = v);
				}
			});
		});
	}, [
		['ui-bind', function(e) {
			return Function('val', $attr(e, 'ui-bind-exec') || (($attr(e, 'ui-bind-attr') || 'this.innerHTML')+'=val'));
		}],
		['ui-show', function(e) {
			return function(v) {
				this.style.display = v ? 'block' : 'none';
			};
		}],
	]);
	setInterval(function() {
		var t = dt();
		gameTick.run(t);
		uiTick.run(t);
		GAME.tick = t;
	}, 5);

	GAME.fps = 0;
	var fpsCounter = newFPSCounter();
	requestAnimationFrame(function render(t) {
		GAME.fps = fpsCounter(t);
		GAME.draw();
		requestAnimationFrame(render);
	});
	
	ieach(['keydown', 'keyup'], function(i, v) {
		window.addEventListener(v, GAME.input);
	});
})(newCounter());

SPRITE.newCls('Basic', {
	layer: 'L10',
	runBasic: undefined,
	run: function(dt) {
		var d = this.data, s = this.state;

		s.run(dt);
		if (!s.d.life)
			this.finished = true;

		var p = d.parent;
		if (p && (p.finished || p.state.is_dying) && !s.is_dying) 
			s.die();

		var x = (s.is_creating && dt/s.d.life) || (s.is_dying && -dt/s.d.life) || 1;
		d.health = limit_between(d.health + x, 0, 1);

		if (this.runBasic)
			this.runBasic(dt, d, s);

		if (d.x + d.y !== d.y + d.x)
			this.finished = true;
	},
	drawBasic: undefined,
	drawText: function(d, s) {
		if (d.font)
			DC.font = d.font;
		if (d.color)
			DC.fillStyle = d.color;
		DC.fillText(d.text, d.x, d.y);
	},
	drawFrame: function(d, s) {
		var f = d.frame,
			w = (f.w || f.sw) * d.scale,
			h = (f.h || f.sh) * d.scale;
		if (f.rotate === undefined)
			f.rotate = 0;
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
		if (d.health > 0) {
			DC.save();
			if (d.health < 1 || d.opacity < 1)
				DC.globalAlpha = d.health*d.opacity;
			if (d.blend)
				DC.globalCompositeOperation = d.blend;

			if (this.drawBasic)
				this.drawBasic(d, s);
			else if (d.frame)
				this.drawFrame(d, s);
			else
				this.drawText(d, s);
			DC.restore();
		}
	},
	anim: function(t, fn, x, id) {
		var t = newTicker(t, function(obj) {
			this.finished = obj.finished || fn(x, obj);
		}, this);

		STORY.anim.add(t);
		t.f(t.d);

		if (id) {
			var d = this.data,
				k = 'am#' + id;
			if (d[k])
				d[k].finished = true;
			d[k] = t;
		}

		return t;
	},
	states: {
		life: [500,	Inf, 500],
	},
}, function(d) {
	this.data = d = extend({
		x: interp(GAME.rect.l, GAME.rect.r, 0.5),
		y: interp(GAME.rect.t, GAME.rect.b, 0.5),
		text: undefined,
		color: undefined,
		font: undefined,

		health: 0, // variable between 0 and 1

		parent: undefined, // if parent is dead, it will kill self too

		frame: undefined, // i.e. {res:'player0L', sx:0, sy:0, sw:10, sh:10, w:10, h:10}
		blend: undefined,
		scale: 1,
		opacity: 1,

		frtick: 50,
		frames: undefined, // array of frames
		pathtick: 50,
		pathnodes: undefined, // array of objects like { x/fx:0, y/fy:0, v:1}

		states: undefined,
		layer: undefined,
	}, d);
	this.state = UTIL.newAliveState(d.states || this.states);
	if (d.frames)
		UTIL.addFrameAnim(this, d.frames);
	if (d.pathnodes)
		UTIL.addPathAnim(this, d.pathnodes);
	if (d.layer)
		this.layer = d.layer;
});

SPRITE.newCls('Circle', {
	from: 'Basic',
	runCircle: undefined,
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
			this.finished = true;
			STORY.on(STORY.events.OBJECT_OUT, this);
		}
	},
	runBasic: function(dt, d, s) {
		d.x0 = d.x;
		d.y0 = d.y;
		if (this.runCircle)
			this.runCircle(dt, d, s);
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
	drawBasic: function(d, s) {
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
	SPRITE.init.Basic.call(this, d);
	this.rect = { l:0, t:0, r:0, b:0 };
});

SPRITE.newCls('Player', {
	from: 'Basic',
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
		if (v.clsName == SPRITE.proto.Drop.clsName && v.state.is_living) {
			e.collected = this;
			if (circle_intersect(d, { x:e.x, y:e.y, r:20 }))
				STORY.on(STORY.events.DROP_COLLECTED, v);
		}
		else if (v.clsName == SPRITE.proto.Player.clsName) {
			if (circle_intersect(d, e))
				circles_hit(d, e)
		}
		else if (v.state.d.mkDamage) {
			if (!this.state.d.isInvinc && circle_intersect({ x:d.x, y:d.y, r:d.h }, e))
				STORY.on(STORY.events.PLAYER_HIT, this);
			else if (!e.grazed && circle_intersect(d, e))
				STORY.on(STORY.events.PLAYER_GRAZE, e.grazed = this);
		}
	},
	
	runPlayer: function(dt, d, s) {
		var m = GAME.keyste.shiftKey,
			v = m ? 0.12 : 0.24;
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
		if (GAME.keyste[d.conf.key_bomb] && (s.is_creating || s.is_living) && s.d.name !== 'bomb')
			STORY.on(STORY.events.PLAYER_BOMB, this);

		// AUTO COLLECT!
		if (d.y < interp(GAME.rect.t, GAME.rect.b, 0.3))
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT, this);
	},
	runBasic: function(dt, d, s) {
		if (this.finished) {
			STORY.on(STORY.events.PLAYER_DEAD, this);
			return;
		}

		if (!s.is_dying)
			this.runPlayer(dt, d, s);

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
	drawBasic: function(d, s) {
		if (this.state.d.isInvinc)
			DC.globalAlpha = 0.5;

		if (d.frame)
			this.drawFrame(d, s);
	},

	states: {
		name: ['creating', 'living', 'dying', 'bomb', 'juesi'],
		life: [2000, Inf, 1000, 5000, 100],
		next: [1, 2, -1, 0, 2],
		isInvinc: [1, 0, 1, 1, 1],
	},
}, function(d) {
	d = extend({
		r: 15,
		h: 1,

		x: interp(GAME.rect.l, GAME.rect.r, 0.5),
		y: interp(GAME.rect.t, GAME.rect.b, 0.8),
		vx: 0,
		vy: 0,
		x0: 0,
		y0: 0,

		frtick: 120,
	  	frames: function(v, d) {
			var fs = RES.frames.Player0;
			if (v.state.is_dying) {
				fs = RES.frames.PlayerD;
				if (d.index + 1 > fs.length - 1)
					d.index = fs.length - 2;
			}
			else if (Math.abs(v.data.vx) > 0.1) {
				fs = v.data.vx < 0 ? RES.frames.PlayerL : RES.frames.PlayerR;
				if (d.frames != fs)
					d.index = 0;
				if (d.index + 1 > fs.length - 1)
					d.index = 4;
			}
			return fs;
		},
	}, d);
	SPRITE.init.Basic.call(this, d);
	this.rect = { l:0, t:0, r:0, b:0 };

	this.state = UTIL.newAliveState(d.states || this.states, {
		data: this,
		init: function(v, s) {
			if (s.is_dying)
				STORY.on(STORY.events.PLAYER_DYING, v);
		},
	});
	this.data.conf = extend({
		key_left: 37,
		key_up: 38,
		key_right: 39,
		key_down: 40,
		key_fire: GAME.keychars.Z,
		key_bomb: GAME.keychars.X,
		fire_interval: 1000 / 12,
		fire_count: 500,
	}, this.data.conf);
});

SPRITE.newCls('Ball', {
	from: 'Circle',
	layer: 'L20',
	hits: [
		'Ball',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (circle_intersect(d, e))
			circles_hit(d, e);
	},

	states: {
		life: [200, Inf, 500],
		mkDamage: [0, 1, 0],
	},
}, function(d) {
	SPRITE.init.Circle.call(this, d);
	this.data.mass = this.data.r;
});

SPRITE.newCls('Stick', {
	from: 'Circle',
	layer: 'L20',
	hits: [
		'Ball',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
			cr = line_circle_intersect(d, e);
		if (cr)
			circles_hit(cr, e);
	},
	mkRect: function(rt, d) {
		rt.l = Math.min(d.x0, d.x, d.x + d.dx);
		rt.t = Math.min(d.y0, d.y, d.y + d.dy);
		rt.r = Math.max(d.x0, d.x, d.x + d.dx);
		rt.b = Math.max(d.y0, d.y, d.y + d.dy);
	},
	drawBasic: function(d, s) {
		DC.beginPath();
		DC.moveTo(d.x, d.y);
		DC.lineTo(d.x + d.dx, d.y + d.dy);
		DC.lineWidth = d.r;
		DC.stroke();
		DC.closePath();
	},

	states: {
		life: [200, Inf, 500],
		mkDamage: [0, 1, 0],
	},
}, function(d) {
	d = extend({
		dx: 0,
		dy: (GAME.rect.b - GAME.rect.t)*0.2,
	}, d);
	SPRITE.init.Circle.call(this, d);
	this.data.mass = 100;
});

SPRITE.newCls('Enemy', {
	from: 'Circle',
	hits: [
		'Bullet',
		'Shield',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (!this.state.is_dying && !v.state.is_dying &&
				v.hit_with != this && circle_intersect(d, e)) {
			v.hit_with = this;
			d.damage += v.state.d.mkDamage || 1;
			if (v.clsName == SPRITE.proto.Bullet.clsName)
				STORY.on(STORY.events.BULLET_HIT, v);
			if (d.damage >= d.life)
				STORY.on(STORY.events.ENEMY_KILL, this);
		}
	},
	
	states: {
		life: [500, Inf, 500],
		mkDamage: [0, 1, 0],
	},
}, function(d) {
	d = extend({
		r: 20,
		y: interp(GAME.rect.t, GAME.rect.b, 0.1),
		life: 2,
		damage: 0
	}, d);
	SPRITE.init.Circle.call(this, d);
});

SPRITE.newCls('Shield', {
	from: 'Circle',
	hits: [
		'Dannmaku',
	],
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (!v.state.is_dying &&
				v.hit_with != this && circle_intersect(d, e)) {
			v.hit_with = this;
			STORY.on(STORY.events.DANNMAKU_HIT, v);
		}
	},
	
	states: {
		life: [800, Inf, 500],
		mkDamage: [0, 20, 0],
	},
}, function(d) {
	SPRITE.init.Circle.call(this, d);
});

SPRITE.newCls('Drop', {
	from: 'Circle',
	layer: 'L20',
	runCircle: function(dt, d, s) {
		var v = d.collected;
		if (v && v.finished)
			v = d.collected = UTIL.getOneObj('Player');
		if (v && !v.finished && !v.state.is_dying) {
			var e = v.data,
				v = d.collected_auto ? 0.6 : sqrt_sum(d.vx, d.vy);
			redirect_object(d, e, v);
			if (!d.collected_auto)
				d.collected = undefined;
		}
		else if (d.vy < 0.15) {
			d.vy += 0.001 * dt;
			d.vx *= 0.9;
		}
		else {
			d.vx = 0;
		}
	},
	drawBasic: function(d, s) {
		SPRITE.proto.Circle.drawBasic.call(this, d);
		if (d.y < GAME.rect.t && d.frame_small) this.drawFrame({
			x: d.x,
			y: GAME.rect.t + 16,
			scale: 1,
			frame: d.frame_small,
		}, s);
	},
	space: {
		l: 40,
		r: 40,
		t: 300,
		b: 20
	},
	states: {
		life: [100, Inf, 50],
	},
}, function(d) {
	d = extend({
		r: 60,
		vy: -0.4,
		collected: undefined,
		collected_auto: false,
		frames: RES.frames.Drops[2],
		frame_small: RES.frames.Drops[8],
	}, d);
	SPRITE.init.Circle.call(this, d);
});

SPRITE.newCls('Bullet', {
	from: 'Circle',
	layer: 'L20',
	states: {
		life: [50, Inf, 400],
		mkDamage: [0, 1, 0],
	},
}, function(d) {
	d = extend({
		r: 5,
		vy: -1.2,
	}, d);
	SPRITE.init.Circle.call(this, d);
});

SPRITE.newCls('Dannmaku', {
	from: 'Circle',
	layer: 'L20',
	states: {
		life: [100, Inf, 200],
		mkDamage: [0, 1, 0],
	},
}, function(d) {
	d = extend({
		r: 5,
		vy: 0.3,
	}, d);
	SPRITE.init.Circle.call(this, d);
});

// for test only
function newPlayer() {
	var p = SPRITE.newObj('Player');
	p.onmyous = {};
	keach({
		'left' : { value:0.9, max:0.9, min:0.6, delta:-0.008, frames:'OnmyouR' },
		'right': { value:0.1, max:0.4, min:0.1, delta:+0.008, frames:'Onmyou' },
	}, function(k, a) {
		a.callback = function(v) {
			var p = v.data.parent,
				r = 25,
				t = this.value * Math.PI;
			v.data.x = p.data.x + r * Math.cos(t);
			v.data.y = p.data.y - r * Math.sin(t);
			this.step = p.data.slowMode ? this.delta : -this.delta;
		};
		p.onmyous[k] = SPRITE.newObj('Basic', {
			parent: p,
			frames: RES.frames[a.frames],
		});
		UTIL.addAnim(p.onmyous[k], 15, a);
	});
	p.pslow = SPRITE.newObj('Basic', {
		layer: 'L20',
		parent: p,
		frames: RES.frames.PSlow,
	});
	UTIL.addAnim(p.pslow, 15, {
		delta: 1/120,
		callback: function(v) {
			var p = v.data.parent;
			v.data.x = p.data.x;
			v.data.y = p.data.y;
			v.data.opacity = this.value;
			this.step = p.data.slowMode ? this.delta : -this.delta;
		},
	});
}
function newBall(d) {
	var t = random(-0.6, 0.6) * Math.PI / 2,
		r = random(10) + 5;
	SPRITE.newObj('Ball', {
		x: random(GAME.rect.l, GAME.rect.r),
		y: random(GAME.rect.t, interp(GAME.rect.t, GAME.rect.b, d.fy)),
		vx: d.speed*Math.sin(t),
		vy: d.speed*Math.cos(t),
		r: r,
		scale: 2.5*r / 32,
		frames: randin(RES.frames.TamaLarge),
	});
}
function newBullet(d) {
	d.from.bullet1_idx = ((d.from.bullet1_idx || 0) + 1) % 6;
	array(2, function(i, para) {
		var x = i % 2 ? -1 : 1;
		SPRITE.newObj('Bullet', {
			x: d.from.data.x + x*5,
			y: d.from.data.y,
			vx: 0.02*x,
			vy: -0.72,
			from: d.from,
			frtick: 1000/36,
			frames: RES.frames.Bullet0,
			opacity: 0.7,
		});
	});
	if (d.from.bullet1_idx == 0) {
		if (!d.to) {
			var r = Inf;
			SPRITE.eachObj(function(i, u) {
				if (u.state.d.mkDamage) {
					var r0 = squa_sum(u.data.x-d.from.data.x, u.data.y-d.from.data.y);
					if (r0 < r) {
						r = r0;
						d.to = u;
					}
				}
			}, 'Enemy');
		}
		array(4, function(i) {
			var x = i % 2 ? -1 : 1,
				v1 = random(0.4, 0.5),
				t = (d.from.data.slowMode ? random(-5, 5) : random(10, 20)-i*5) * Math.PI / 180,
				onmyou = x > 0 ? d.from.onmyous.right : d.from.onmyous.left;
			SPRITE.newObj('Bullet', {
				x: onmyou.data.x,
				y: onmyou.data.y,
				vy: -v1*Math.cos(t),
				vx: x*v1*Math.sin(t),
				from: d.from,
				to: d.to,
				frtick: 1000/36,
				frames: RES.frames.Bullet1,
				opacity: 0.7,
			}).runCircle = function(dt, d, s) {
				var u = d.to,
					e = u && u.data;
				if (u && !u.finished && u.state.d.mkDamage && !s.is_dying)
					redirect_object(d, e, sqrt_sum(d.vx, d.vy));
			};
		})
	}
}
function newDannmaku(d) {
	var v = SPRITE.newObj('Dannmaku', d);
	d = v.data;
	if (d.type == 'FollowTarget') {
		fill(d, {
			target_cls: undefined,
			target: undefined,
			decrease_duration: 1000,
			decrease_by: 0.99,
			velocity_min: 0.02,
			duration: 1000,
			gravity: 10e-7,
			accel_min: 0.1,
			offset_x: 0,
			offset_y: 0,
		});
		v.runCircle = function(dt, d, s) {
			if (s.d.age < d.decrease_duration) {
				d.vx *= d.decrease_by;
				d.vy *= d.decrease_by;
			}
			else if (s.d.age < d.decrease_duration + d.duration) {
				if (d.target && !d.target.finished) {
					var e = d.target.data,
						dx = e.x - d.x + d.offset_x,
						dy = e.y - d.y + d.offset_y;
					d.vx += d.gravity * dt * dx;
					d.vy += d.gravity * dt * dy;

					var v = sqrt_sum(d.vx, d.vy);
					if (v < d.accel_min && !d.grazed)
						redirect_object(d, e, v);
				}
				else if (d.target_cls)
					d.target = UTIL.getOneObj(d.target_cls);
			}
			d.vx = keep_outside(d.vx, -d.velocity_min, d.velocity_min);
			d.vy = keep_outside(d.vy, -d.velocity_min, d.velocity_min);
		};
	}
	else if (d.type == 'OrbAround') {
		fill(d, {
			source_x: d.from.data.x,
			source_y: d.from.data.y,
			theta: 0,
			speed: 1/500,
			radius: 100,
			offset_count: 0.04,
			offset_speed: 0.1,
			flip_each_count: true,
		});
		if (d.generator)
			d.theta = d.generator.theta0;
		if (d.offset_count && d.generator)
			d.theta += d.generator.count * d.offset_count;
		if (d.flip_each_count && d.generator)
			d.speed *= d.generator.count % 2 ? 1 : -1;
		v.runCircle = function(dt, d, s) {
			var f = d.from;
			if (f && !f.finished && !f.state.is_dying) {
				d.x = d.radius*Math.cos(d.theta) + d.source_x;
				d.y = d.radius*Math.sin(d.theta) + d.source_y;
				d.theta += dt*d.speed;
			}
		};
	}
	else if (d.type == 'ZigZag') {
		fill(d, {
			count: 0,
			theta_delta: 0.05,
			delay: 500,
			interval: 50,
			theta_max: 0.05,
			delay_count: 10,
			flip_count: 30,
			flip_each_count: true,
			flip_each_layer: true,
			decrease_by: 0.95,
		});
		if (d.flip_each_count && d.generator)
			d.theta_delta *= d.generator.count % 2 ? 1 : -1;
		if (d.flip_each_layer && d.generator)
			d.theta_delta *= d.generator.layer % 2 ? 1 : -1;
		v.anim(d.interval, function(d, v) {
			if (d.delay_count-- > 0)
				return;
			var vr = sqrt_sum(d.vx, d.vy),
				t = Math.atan2(d.vy, d.vx) + d.theta_delta;
			d.vx = Math.cos(t) * vr;
			d.vy = Math.sin(t) * vr;
			d.theta_delta *= d.decrease_by;
			if (d.count++ > d.flip_count) {
				d.count = 0;
				d.theta_delta = (d.theta_delta > 0 ? 1 : -1) * d.theta_max;
			}
		}, d);
	}
	else if (d.type == 'Laser') {
		fill(d, {
			radius1: 30,
			radius2: 30,
			theta: Math.PI/2,
		});

		var dim = d.radius1 + d.radius2;
		v.space = { l:dim, r:dim, t:dim, b:dim };

		var last = v;
		range(d.radius2, -d.radius1, d.r*1.5, function(r) {
			if (r > -d.r && d < d.r)
				return;
			last = SPRITE.newObj('Dannmaku', {
				vx: 0,
				vy: 0,
				r: v.data.r,
				head: v,
				dist: r,
				parent: last,
			});
			last.space = v.space;
			last.runCircle = function(dt, d, s) {
				var pd = d.head.data;
				d.x = pd.x + d.dist * Math.cos(pd.theta);
				d.y = pd.y + d.dist * Math.sin(pd.theta);
			};
		});
		v.data.parent = last;
	}
}
function genDannmaku(d) {
	d = extend({
		theta: 0,
		theta_rand: 0.05,
		theta_rand_min: 0.8,
		theta_rand_max: 1.2,
		theta_step: 0.2,
		theta_count: 9,
		theta_reverse: false,
		theta_velocity: 0.0,
		theta_velocity_flip: false,
		count: 9,
		layers: 10,
		interval: 200,
		radius: 20,
		velocity: 0.2,
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
		function getPlayerData() {
			var player = UTIL.getOneObj('Player');
			return player ? player.data : {
				x:interp(GAME.rect.l, GAME.rect.r, 0.5),
				y:interp(GAME.rect.t, GAME.rect.b, 0.7),
			};
		}
		if (!d.from || d.from.finished || d.from.state.is_dying) {
			this.finished = true;
			return;
		}
		var to = d.to ? d.to.data : getPlayerData(),
			from = +d.x === d.x ? { x:d.x, y:d.y } : d.from.data;
		for(var count = 0; count < d.count; count ++) {
			if (idx ++ >= cnt)
				idx = d.theta_reverse ? -cnt : 0;
			d.theta = (Math.abs(idx) - cnt/2) * d.theta_step;
			if (d.theta_velocity_flip)
				d.theta_velocity = -d.theta_velocity;

			var t0 = Math.atan2(to.y-from.y, to.x-from.x),
				tp = d.theta*random(d.theta_rand_min, d.theta_rand_max),
				t = t0 + tp + random(d.theta_rand);
			(d.create || newDannmaku)(extend({
				x: from.x + d.radius*Math.cos(t),
				y: from.y + d.radius*Math.sin(t),
				vx: d.velocity*Math.cos(t+d.theta_velocity),
				vy: d.velocity*Math.sin(t+d.theta_velocity),
				r: 3,
				from: d.from,
				frames: RES.frames.LongA,
				generator: { layer:layer, count:count, theta0:t0, thetap:tp, theta:t },
			}, d.dannmaku));
		};
	}, d.interval, d, d.layers);
}
function newEnemy(d) {
	d = extend({
		x: random(GAME.rect.l+100, GAME.rect.r-100),
		vx: random(-0.05, 0.05),
		vy: random(0.01, 0.1),
		r: 16,
		frtick: 150,
		frames: RES.frames['Enemy'+randin([0,1])+randin([0,1,2])],
		generator: {
			preset: '',
			delay: 1000,
			dannmaku: {
				type: 'FollowTarget',
	  			target_cls: 'Player',
			},
	  		create: function(d) {
				function get(ls, i) {
					return ls[i % ls.length];
				}
				var x = d.generator.count % 2;
				d.decrease_by = x ? 0.99 : 1;
				d.decrease_duration = x ? 1000 : 10000;
				d.frames = x ? RES.frames.LongA : RES.frames.TamaA;
				d.offset_x = d.generator.layer % 2 ? -40 : 40;
				newDannmaku(d);
			}
		}
	}, {
		'com1': {
			// example
		}
	}[d && d.preset], d);
	var enm = SPRITE.newObj('Enemy', d);
	if (d.generator) {
		d.generator.from = enm;
		STORY.timeout(function(d) {
			genDannmaku(d);
		}, d.generator.delay || 0, d.generator)
	};
}
function newBoss() {
	var boss = SPRITE.newObj('Enemy', {
		r: 24,
		life: 300,
		frtick: 150,
		frames: RES.frames.EnemyX,
	});
	boss.effects = array(3, function(i) {
		var eff = SPRITE.newObj('Basic', {
			parent: boss,
			frames: RES.frames.EffBoss,
			rot: {
				theta: 0,
				dtheta: random(0.05, 0.10) / 50,
				phi: random(1),
				dphi: random(0.01, 0.05) / 50,
				radius1: 30,
				radius2: 10,
			}
		});
		eff.runBasic = function(dt, d, s) {
			var p = d.parent,
				r = d.rot;
			r.theta += r.dtheta * dt;
			r.phi += r.dphi * dt;
			d.x = p.data.x +
				r.radius1*Math.cos(r.theta)*Math.cos(r.phi) -
				r.radius2*Math.sin(r.theta)*Math.sin(r.phi);
			d.y = p.data.y +
				r.radius1*Math.cos(r.theta)*Math.sin(r.phi) +
				r.radius2*Math.sin(r.theta)*Math.cos(r.phi);
			d.z = Math.sin(r.theta);
			d.scale = 1.0 + 0.4*Math.sin(r.theta);
		};
		eff.drawEffects = eff.draw;
		eff.draw = return_nothing;
		return eff;
	});
	boss.drawBasic = function(d, s) {
		ieach(boss.effects, function(i, v) {
			if (v.data.z < 0)
				v.drawEffects();
		});
		if (d.frame)
			this.drawFrame(d, s);
		ieach(boss.effects, function(i, v) {
			if (v.data.z >= 0)
				v.drawEffects();
		});
		DC.beginPath();
		DC.arc(d.x, d.y, d.r*1.5, 0, (d.life-d.damage)/d.life*2*Math.PI);
		DC.stroke();
		DC.closePath();
	}
	return boss;
}
function newEffect(v) {
	SPRITE.newObj('Circle', {
		x: v.data.x,
		y: v.data.y,
		vx: v.data.vx*=0.1,
		vy: v.data.vy*=0.1,
		frames: {
			Enemy: RES.frames.EffEnemy,
			Player: RES.frames.EffPlayer,
		}[v.clsName],
		states: {
			life: [0, 50, 950],
		},
	});
	array(8, function(i) {
		var p = SPRITE.newObj('Circle', {
			x: v.data.x + random(10),
			y: v.data.y + random(10),
			vx: random(-0.2, 0.2),
			vy: random(-0.2, 0.2),
			frames: randin({
				Enemy: RES.frames.EffPieceB,
				Player: RES.frames.EffPieceG,
			}[v.clsName]),
			scale: 2,
			opacity: 0.5,
			blend: 'lighter',
			states: {
				life: [50, 50, 750],
			},
		})
		p.runCircle = function(dt, d, s) {
			d.vx *= 0.97;
			d.vy *= 0.97;
			d.scale = d.health*d.health * 2 + 0.5;
		};
	});
}
function newBackground(elems) {
	var bg = SPRITE.newObj('Basic');
	bg.elems = elems;
	bg.draw = return_nothing;
	ieach(elems, function(i, e) {
		e.object = bg;
		e.offset = 0;
		e.total = e.scrollHeight - parseFloat($attr(e, 'bg-reserve') || '0');
		e.speed = parseFloat($attr(e, 'bg-speed') || '0');
		e.opacity = parseFloat(e.style.opacity || '1');
	});
	bg.anim(50, function(d, v) {
		ieach(v.elems, function(i, e) {
			e.offset += e.speed * 50;
			if (e.offset > 0)
				e.offset -= e.total;
			e.style.marginTop = e.offset + 'px';
			e.style.opacity = e.opacity * v.data.health;
		});
	});
	return bg;
}
function newBomb(player) {
	var bg = SPRITE.newObj('Basic');
	bg.player = player;
	bg.elem = $('.bgimg .bombbg')[0];
	bg.elem.object = bg;
	bg.draw = return_nothing;
	bg.anim(50, function(x, bg) {
		var p = bg.player;
		if ((p.finished || p.state.d.name !== 'bomb') && !bg.state.is_dying)
			bg.state.die();
		if (bg.elem.object == bg)
			bg.elem.style.opacity = bg.data.health;
	});
	bg.anim(400, function(x, bg) {
		var p = bg.player;
		if (bg.state.is_living) {
			var sh = SPRITE.newObj('Shield', {
				sx: p.data.x,
				sy: p.data.y,
				theta: random(0, Math.PI*2),
				dtheta: randin([-0.002, 0.002]),
				dist: 0,
				parent: p,
				frames: RES.frames.Shield[0],
				opacity: 0.8,
			});
			sh.runCircle = function(dt, d, s) {
				d.theta += d.dtheta * dt;
				d.dist += 0.1 * dt;
				d.x = d.sx + d.dist * Math.cos(d.theta);
				d.y = d.sy + d.dist * Math.sin(d.theta);
				d.r = 1 + Math.sqrt(d.health) * 40;
				d.scale = d.r / 30;
			};
			ieach([2, 3, 1, 2, 3], function(i, v) {
				SPRITE.newObj('Basic', {
					index: v,
					theta: random(0, Math.PI*2),
					dtheta: random(-0.005, 0.005),
					dist: random(10, 15),
					parent: sh,
					frame: RES.frames.Shield[v],
					opacity: 0.5,
					blend: 'lighter',
				}).runBasic = function(dt, d, s) {
					var p = d.parent;
					d.dist = p.data.r * 0.4;
					d.theta += d.dtheta * dt;
					d.x = p.data.x + d.dist * Math.cos(d.theta);
					d.y = p.data.y + d.dist * Math.sin(d.theta);
					if (d.index > 1 && !s.is_dying)
						d.scale = d.health * 1.5;
				};
			});
		}
	});
	SPRITE.newObj('Shield', {
		x: player.data.x,
		y: player.data.y,
		frames: RES.frames.EffPlayer,
		scale: 1.5,
		states: {
			life: [100, 50, 850],
		},
	}).runCircle = function(dt, d, s) {
		d.r = 20 + d.health * 60;
	};
}
function killCls() {
	ieach(arguments, function(i, c) {
		SPRITE.eachObj(function(i, v) {
			if (!v.state.is_dying)
				v.state.die();
		}, c);
	})
}
function killObj() {
	ieach(arguments, function(i, v) {
		if (!v.state.is_dying)
			v.state.die();
	})
}

GAME.objects = {
};
GAME.statics = {
	max_point: 1000000,
	point: 0,
	player: 7,
	bomb: 7,
	power: 255,
	graze: 0,
	dot: 0,
};
var hook = {
	init: function(n, d) {
		console.log('--> ', n)
	},
	quit: function(n, d) {
	},
	after_run: function(dt, d) {
		GAME.statics.time += dt;
	},
	before_on: function(e, v, d) {
		if (e == STORY.events.STORY_LOAD) {
			SPRITE.clrObj();
			GAME.objects.player = newPlayer();
			GAME.objects.bg = newBackground($('.bg1'));
		}
		else if (e == STORY.events.GAME_INPUT) {
			if (v.type == 'keyup' && v.which == 27) {
				var s = GAME.state,
					c = GAME.states;
				if (s == c.PAUSE)
					GAME.state = c.RUNNING;
				else if (s == c.RUNNING)
					GAME.state = c.PAUSE;
			}
		}
		else if (e == STORY.events.PLAYER_AUTOCOLLECT) {
			SPRITE.eachObj(function(i, u) {
				u.data.collected = v;
				u.data.collected_auto = true;
			}, 'Drop');
		}
		else if (e == STORY.events.PLAYER_HIT) {
			GAME.statics.graze --;
			v.state.set('juesi');
			newEffect(v);
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
			var x = v.data.x,
				y = v.data.y;
			SPRITE.newObj('Drop', { vx:  -1, vy: -0.8, x:x, y:y });
			SPRITE.newObj('Drop', { vx:-0.5, vy:-0.85, x:x, y:y });
			SPRITE.newObj('Drop', { vx: 0.5, vy:-0.85, x:x, y:y });
			SPRITE.newObj('Drop', { vx:   1, vy: -0.8, x:x, y:y });
			GAME.statics.player --;
		}
		else if (e == STORY.events.PLAYER_DEAD) {
			GAME.objects.player = newPlayer();
			GAME.statics.bomb = 7;
		}
		else if (e == STORY.events.PLAYER_FIRE) {
			if (!d.disable_fire)
				newBullet({
					from: v,
				});
		}
		else if (e == STORY.events.PLAYER_BOMB) {
			GAME.statics.bomb --;
			v.state.set('bomb');
			newBomb(v);
		}
		else if (e == STORY.events.ENEMY_KILL) {
			v.state.die();
			newEffect(v);
		}
		else if (e == STORY.events.DROP_COLLECTED) {
			v.state.die();
			GAME.statics.point += 10;
		}
		else if (e == STORY.events.BULLET_HIT) {
			v.state.die();
			v.data.vx *= 0.05;
			v.data.vy *= 0.05;
			UTIL.addFrameAnim(v, RES.frames.BulletD[v.data.to ? 1 : 0]);
			SPRITE.newObj('Circle', {
				x: v.data.x,
				y: v.data.y,
				vx: random(-0.2, 0.2),
				vy: random(-0.2, 0.2),
				frames: RES.frames.EffPieceR,
				opacity: 0.6,
				blend: 'lighter',
				states: {
					life: [50, 50, 550],
				}
			}).runCircle = function(dt, d, s) {
				d.scale = 0.5 + d.health;
			};
		}
		else if (e == STORY.events.DANNMAKU_HIT) {
			v.state.die();
			v.data.vx *= 0.1;
			v.data.vy *= 0.1;

			var f0 = v.data.frame;
				f = v.data.frame_dead || RES.frames.BulletD[1],
				h = f.h || f.sh;
				h0 = f0 ? (f0.h || f0.sh) : h,
			v.data.scale *= h / h0;
			v.data.opacity = 0.5;
			UTIL.addFrameAnim(v, f);

			SPRITE.newObj('Drop', {
				x: v.data.x,
				y: v.data.y,
				frames: RES.frames.Drops[6],
				collected: UTIL.getOneObj('Player'),
				collected_auto: true,
			});
		}
	}
};
var tl = {};
tl.init = {
	run: UTIL.newTimeRunner(5000, 'sec0'),
	init: function(d) {
		d.title = SPRITE.newObj('Basic', {
			text: 'Stage 1',
			font: '20px Arial',
			color: 'yellow',
		});
		STORY.timeout(function(d) {
			d.text = SPRITE.newObj('Basic', {
				text: '~ Mystic Flier ~',
				font: '15px Arial',
				sy: interp(GAME.rect.t, GAME.rect.b, 0.5) + 35,
			});
			d.text.runBasic = function(dt, d, s) {
				if (!s.is_dying)
					d.y = d.sy - Math.sqrt(d.health)*10;
			};
		}, 400, d);
	},
	quit: function(d) {
		killObj(d.title, d.text);
	}
};
tl.sec0 = {
	run: UTIL.newTimeRunner(20000, 'sec1'),
	init: function(d) {
		STORY.timeout(function(d, n) {
			newBall({
				speed: n > 10 ? 0.05 : 0.25,
				fy: n > 10 ? 0.6 : 0.2,
			});
		}, 20, null, 60);
	},
	quit: function(d) {
		killCls('Ball');
	},
	on: function(e, v, d) {
		if (e == STORY.events.OBJECT_OUT) {
			if (v.clsName == SPRITE.proto.Ball.clsName) {
				var fy = random(0.2, 0.6);
				newBall({
					speed: 0.6-fy,
					fy: fy
				});
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
				return 'boss0';
			else
				return 'sec1';
		}
	},
	on: function(e, v, d) {
		if (e == STORY.events.ENEMY_KILL) {
			SPRITE.newObj('Drop', {
				x: v.data.x,
				y: v.data.y
			});
			var pass = true;
			SPRITE.eachObj(function(i, v) {
				if (!v.state.is_dying)
					return pass = false;
			}, 'Enemy');
			if (pass) {
				SPRITE.eachObj(function(i, v) {
					v.state.die();
					SPRITE.newObj('Drop', {
						x: v.data.x,
						y: v.data.y,
						vx: v.data.vx *= 0.01,
						vx: v.data.vy *= 0.01,
						frames: RES.frames.Drops[1],
					});
				}, 'Dannmaku');
				STORY.timeout(function(d) {
					STORY.on(STORY.events.PLAYER_AUTOCOLLECT,
						UTIL.getOneObj('Player'));
					d.pass = true;
				}, 100, d);
			}
		}
		else if (e == STORY.events.OBJECT_OUT) {
			if (v.clsName == SPRITE.proto.Enemy.clsName && !v.state.is_dying)
				newEnemy();
		}
	}
};
ieach([
	{ text:'x0aabbcc', x:GAME.rect.l+50, y:interp(GAME.rect.t, GAME.rect.b, 0.8), name:'diag' },
	{ text:'y0aabbcc', x:GAME.rect.r-50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ text:'x0aabbcc', x:GAME.rect.l+50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ text:'y0aabbcc', x:GAME.rect.r-50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ text:'x0aabbcc', x:GAME.rect.l+50, y:interp(GAME.rect.t, GAME.rect.b, 0.8) },
	{ text:'y0aabbcc', x:GAME.rect.r-50, y:interp(GAME.rect.t, GAME.rect.b, 0.8), next:'boss1' },
], function(i, v, tl) {
	var c = v.name || 'diag'+i, n = v.next || 'diag'+(i+1);
	tl[c] = {
		init: function(d) {
			d.age = 0;
			d.disable_fire = true;
			d.text = SPRITE.newObj('Basic', v);
		},
		run: function(dt, d) {
			if (d.pass || GAME.keyste.ctrlKey || (d.age+=dt) > 20000)
				return n;
		},
		quit: function(d) {
			d.text.state.die();
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
tl.boss0 = {
	run: UTIL.newTimeRunner(5000, 'boss'),
};
ieach([
	{
		name:'boss',
		next:'diag',
		pathnodes: [
			{ fx:0.0, fy:0.0, v:0.1 },
			{ fx:0.1, fy:0.1, v:0.1 },
			{ fx:0.5, fy:0.1, v:0.1 },
		],
	},
	{
		pathnodes: [
			{ v:0.1 },
			{ fx:0.5, fy:0.5, v:0.1 },
		],
		damage_max: 100,
	},
	{
		pathnodes: [
			{ v:0.1 },
			{ fx:0.1, fy:0.5, v:0.2 },
			{ fx:0.9, fy:0.5, v:0.2 },
		],
	},
	{
		//...
	},
	{
		//...
	},
	{
		next: 'end',
	},
], function(i, v, tl) {
	var c = v.name || 'boss'+i, n = v.next || 'boss'+(i+1);
	tl[c] = {
		init: function(d) {
			killCls('Dannmaku');
			d.age = 0;
			d.duration = v.duration || 30000;
			d.damage_max = v.damage_max || Inf;

			d.boss = UTIL.getOneObj('Enemy') || newBoss();
			if (v.pathnodes)
				UTIL.addPathAnim(d.boss, v.pathnodes);

			d.countdown = SPRITE.newObj('Basic', {
				x: interp(GAME.rect.l, GAME.rect.r, 1)-20,
				y: interp(GAME.rect.t, GAME.rect.b, 0)+20,
			});
			d.countdown.anim(100, function(d, v) {
				var t = Math.floor((d.duration - d.age) / 1000);
				v.data.color = (t<10 && 'red') || (t<20 && 'rgb(151,125,208)') || 'rgb(164,209,250)';
				v.data.text = Math.max(t, 0);
			}, d);
		},
		quit: function(d) {
			d.countdown.state.die();
		},
		run: function(dt, d) {
			d.age += dt;
			if (d.age > d.duration || d.boss.data.damage >= d.damage_max || d.pass) {
				d.boss.data.damage = v.damage_max || 0;
				return n;
			}
		},
		on: function(e, v, d) {
			if (e == STORY.events.ENEMY_KILL) {
				d.pass = true;
				v.state.set('living');
			};
		},
	}
}, tl);
tl.end = {
	init: function(d) {
		killCls('Enemy', 'Dannmaku');
		SPRITE.newObj('Basic', {
			text: 'You Win!'
		});
	},
	run: function(dt, d) {
	}
};
