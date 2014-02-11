var Inf = parseFloat('Infinity');

function ieach(ls, fn, d) {
	for (var i = 0, n = ls.length; i < n; i ++) {
		var r = fn(i, ls[i], d);
		if (r !== undefined)
			return r;
	}
	return d;
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
function sum(ls) {
	return reduce(ls, function(i, v, r) {
		return v + r;
	}, 0);
}
function random(b, e) {
	var d = (e || 0) - b;
	return b + Math.random()*d
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
function make_rect(rt, l, t, r, b) {
	rt.l = l;
	rt.t = t;
	rt.r = r;
	rt.b = b;
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

function getTick() {
	return (new Date()).getTime();
}
function newCounter() {
	var t0 = getTick();
	return function() {
		var t = getTick(),
			dt = t - t0;
		t0 = t;
		return dt;
	}
}
function TimeCounter() {
	var _t = TimeCounter;
	return (_t.counter || (_t.counter = newCounter()))();
}
function FPSCounter() {
	var _t = FPSCounter,
		dt = (_t.counter || (_t.counter = newCounter()))();
	var arr = _t.arr || (_t.arr=Array(20)),
		idx = ((arr.idx || 0) + 1) % arr.length;
	arr[idx] = dt;
	arr.idx = idx;
	return 1000.0 / (sum(arr) / arr.length);
}
function newState(stes) {
	var _t = {
		state: stes[0],
		age: 0,
		ste: 0,
		set: function(s, a) {
			if (!stes[s]) s = each(stes, function(k, v) {
				if (v[s]) return k;
			});
			if (a === undefined)
				_t.age = _t.ste == s ? _t.age : 0;
			else
				_t.age = a;
			_t.ste = s;
			_t.state = stes[s] || {};
		},
		run: function(dt) {
			var d = _t.state;
			_t.age = (_t.age || 0) + dt;
			if (d && _t.age > d.life)
				_t.set(d.next, _t.age - d.life);
		}
	};
	return _t;
}
function newTicker(t) {
	var _t = {
		tc: 0,
		run: function(dt) {
			_t.tc += dt;
			if (_t.tc > t) {
				_t.tc -= t;
				return true;
			}
		}
	}
	return _t;
}

var DC = (function() {
	var canv = $e('canv'),
		_t = canv.getContext('2d');
	canv.width = 480; //window.innerWidth;
	canv.height = 640; //window.innerHeight - 5;
	_t.canv = canv;
	_t.clear = function() {
		DC.clearRect(0, 0, canv.width, canv.height);
	}
	_t.font = '30px Arial';
	_t.textAlign = 'center';
	_t.strokeStyle = 'rgba(0,128,255,0.5)';
	_t.fillStyle = 'rgba(0, 0, 0, 0.5)';
	_t.lineWidth = 3;
	return _t;
})();

var RES = (function() {
	var res = $e('res'),
		_t = {};
	ieach(res.children, function(i, v, d) {
		if (v.tagName == 'CANVAS') {
			var from = $attr(v, 'from'),
				trans = $attr(v, 'transform');
			if (from) {
				var im = $e(from),
					dc = v.getContext('2d');
				v.width = im.naturalWidth;
				v.height = im.naturalHeight;
				if (trans == 'mirror-x') {
					dc.translate(v.width, 0);
					dc.scale(-1, 1);
				}
				else if (trans == 'mirror-y') {
					dc.translate(0, v.height);
					dc.scale(1, -1);
				}
				dc.drawImage(im, 0, 0);
			}
		}
		d[v.id] = v;
	}, _t);
	return _t;
})();

var SPRITE = (function() {
	var _t = {
		cls: {},
		obj: {},
		init: {}
	};
	_t.newCls = function(c, cls, init, from) {
		if (from)
			cls = extend({}, _t.cls[from], cls)
		cls.cls = c;
		init.prototype = cls;
		_t.cls[c] = cls;
		_t.init[c] = init;
		if (!_t.obj[c]) _t.obj[c] = [];
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
		ls[idx] = obj;
		return obj;
	};
	_t.eachCls = function(fn) {
		keach(_t.cls, fn);
	};
	_t.eachObj = function(fn, c) {
		function loopAlive(c) {
			var n = 0,
				ls = _t.obj[c];
			ieach(ls, function(i, v) {
				if (!v.isAlive)
					return;
				fn(v);
				n ++;
			});
			// no one alive? clear the array then
			if (n == 0 && ls.length)
				_t.obj[c] = [];
		}
		if (c) {
			loopAlive(c);
		}
		else keach(_t.obj, function(c) {
			loopAlive(c);
		});
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
		'PLAYER_AUTOCOLLECT',
		'PLAYER_DROP_COLLECTED',
		'PLAYER_GRAZE',
		'PLAYER_FIRE',
		'PLAYER_BOMB',
		'ENEMY_KILL'
	]);
	_t.load = function() {
		// to be finished
	}
	_t.timeline = { },
	_t.current = { },
	_t.start = function(s) {
		_t.current = {
			scene: s,
			data: {}
		};
		var p = _t.timeline[s];
		if (p && p.init) {
			p.init(_t.current.data);
		}
	};
	_t.timeouts = [];
	_t.timeoffs = [];
	_t.timeout = function(fn, t, d, n) {
		var id = _t.timeoffs.length ? _t.timeoffs.pop() : _t.timeouts.length;
		_t.timeouts[id] = {f:fn, t:t, c:0, d:d, n:n};
		return id;
	};
	_t.run = function(dt) {
		var t = _t.timeline,
			s = _t.current.scene,
			d = _t.current.data,
			p = t[s];
		if (t.all && t.all.before_run)
			t.all.before_run(dt, d, s);
		if (p) {
			var n = p.run(dt, d);
			if (n) _t.start(n);
		}
		if (t.all && t.all.after_run)
			t.all.after_run(dt, d, s);

		ieach(_t.timeouts, function(i, v) {
			if (!v) return;
			v.c += dt;
			if (v.c >= v.t) {
				if (v.n !== 0)
					v.f.apply(v.d, [v.c, v.n]);
				if (v.n > 0) {
					v.c = 0;
					v.n --;
				}
				else {
					_t.timeouts[i] = undefined;
					_t.timeoffs.push(i);
				}
			}
		});
	};
	_t.on = function(e, v) {
		var t = _t.timeline,
			s = _t.current.scene,
			d = _t.current.data,
			p = t[s];
		if (t.all && t.all.before_on)
			t.all.before_on(e, v, d, s);
		if (p && p.on)
			p.on(e, v, d);
		if (t.all && t.all.after_on)
			t.all.after_on(e, v, d, s);
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
	_t.init = function() {
		STORY.load();
		STORY.start('init');
	};
	_t.run = function(dt) {
		SPRITE.eachCls(function(c1) {
			SPRITE.eachCls(function(c2) {
				var hits = SPRITE.cls[c1].hits;
				if (hits && hits[c2] !== undefined)
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
	_t.keychars = ieach('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', function(i, v, d) {
		d[v] = v.charCodeAt(0);
	}, {});
	_t.input = function(e) {
		_t.keyste.shiftKey = e.shiftKey;
		_t.keyste.ctrlKey = e.ctrlKey;
		if (e.type == 'keydown') {
			_t.keyste[e.which] = 1;
		}
		else if (e.type == 'keyup') {
			_t.keyste[e.which] = 0;
		}
		STORY.on(STORY.events.GAME_INPUT, e);
	}
	return _t;
})();

SPRITE.newCls('Static', {
	run: function(dt) {
		var d = this.data;

		d.run(dt);
		if (!d.state.life)
			this.isAlive = false;
	},
	draw: function() {
		var d = this.data;
		DC.save();

		if (d.state.creating)
			DC.globalAlpha = d.age / d.state.life;
		else if (d.state.dying)
			DC.globalAlpha = 1 - d.age / d.state.life;
		if (d.color)
			DC.fillStyle = d.color;
		else
			DC.fillStyle = ['pink', 'red', 'gray'][d.ste];

		if (this.paint)
			this.paint(d);
		else
			DC.fillText(d.t, d.x, d.y);

		DC.restore();
	},

	states: {
		0: { creating: 1, life:	500, next: 1 },
		1: { living:   1, life:	Inf, next: 2 },
		2: { dying:    1, life: 500 }
	},
}, function(o, c) {
	this.isAlive = true;
	this.data = extend(newState(this.states), {
		t: 'Static Text',
		x: (GAME.rect.l+GAME.rect.r)/2,
		y: (GAME.rect.t+GAME.rect.b)/2,
	}, o);
});

SPRITE.newCls('Base', {
	run: function(dt) {
		var d = this.data;

		d.run(dt);
		if (!d.state.life)
			this.isAlive = false;

		d.x0 = d.x;
		d.y0 = d.y;
		d.x += d.vx * dt;
		d.y += d.vy * dt;
		if (this.update)
			this.update(dt, d);

		var s = this.space;
		if (d.x+d.r+s.l < GAME.rect.l ||
			d.x-d.r-s.r > GAME.rect.r ||
			d.y+d.r+s.t < GAME.rect.t ||
			d.y-d.r-s.b > GAME.rect.b) {
			this.isAlive = false;
			STORY.on(STORY.events.OBJECT_OUT, this);
		}

		make_rect(this.rect,
			Math.min(d.x0, d.x) - d.r*1.1,
			Math.min(d.y0, d.y) - d.r*1.1,
			Math.max(d.x0, d.x) + d.r*1.1,
			Math.max(d.y0, d.y) + d.r*1.1);
	},
	paint: function(d) {
		DC.beginPath();
		DC.arc(d.x, d.y, d.r, 0, 2*Math.PI);
		DC.closePath();
		DC.fill();
	},
	space: {
		l: 40,
		r: 40,
		t: 40,
		b: 20
	},
	newdata: function(d, e) {
		return extend(newState(this.states), {
			t: undefined,
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
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata(d);
}, 'Static');

SPRITE.newCls('Player', {
	hits: dictflip([
		'Player',
		'Ball',
		'Enemy',
		'Dannmaku',
		'Drop',
	]),
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (e.state.mkDamage) {
			if (!d.state.isInvinc && circle_intersect({x: d.x, y: d.y, r: d.h}, e))
				STORY.on(STORY.events.PLAYER_HIT, this);
			else if (circle_intersect(d, e))
				STORY.on(STORY.events.PLAYER_GRAZE, this);
		}
		else if (v.cls == 'Drop') {
			if (e.state.living && circle_intersect(d, {x: e.x, y: e.y, r: e.h})) {
				e.set('dying');
				STORY.on(STORY.events.PLAYER_DROP_COLLECTED, [this, v]);
			}
			else
				e.collected = this;
		}
		else if (v.cls == 'Player') {
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
	
	run: function(dt) {
		var d = this.data;
			m = GAME.keyste.shiftKey,
			f = (m ? 0.15 : 0.4)*dt;

		d.run(dt);

		d.slowMode = m;
		d.x0 = d.x;
		d.y0 = d.y;

		var vx = 0,
			vy = 0;
		if (GAME.keyste[this.conf.key_left])
			vx = -f;
		else if (GAME.keyste[this.conf.key_right])
			vx = +f;
		if (GAME.keyste[this.conf.key_up])
			vy = -f;
		else if (GAME.keyste[this.conf.key_down])
			vy = +f;
		if (vx && vy) {
			vx /= 1.414;
			vy /= 1.414
		}
		d.x += vx;
		d.y += vy;

		// limit player move inside boundary
		if (d.x-d.r < GAME.rect.l)
			d.x = GAME.rect.l + d.r;
		if (d.x+d.r > GAME.rect.r)
			d.x = GAME.rect.r - d.r;
		if (d.y-d.r < GAME.rect.t)
			d.y = GAME.rect.t + d.r;
		if (d.y+d.r > GAME.rect.b)
			d.y = GAME.rect.b - d.r;

		// update display frame
		if (d.frame.run(dt))
			this.updateframe(d);

		// FIRE!
		if (GAME.keyste[this.conf.key_fire]) {
			if (d.fire.run(dt) || !d.fire.on) {
				d.fire.tc = d.fire.on ? 80 : 0;
				STORY.on(STORY.events.PLAYER_FIRE, this);
			}
		}
		d.fire.on = GAME.keyste[this.conf.key_fire];

		// BOMB!
		if (GAME.keyste[this.conf.key_bomb] && !d.state.bomb) {
			d.set('bomb');
			STORY.on(STORY.events.PLAYER_BOMB, this);
		}

		// AUTO COLLECT!
		if (d.y < GAME.rect.t*0.7 + GAME.rect.b*0.3) {
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT, this);
		}

		make_rect(this.rect,
			d.x - d.r*1.1,
			d.y - d.r*1.1,
			d.x + d.r*1.1,
			d.y + d.r*1.1);
	},
	draw: function() {
		var d = this.data;
		DC.save();

		if (d.state.isInvinc) {
			DC.globalAlpha = 0.5;
		}

		var f = d.frames[d.framei];
		DC.drawImage(RES[f.res],
			f.x, f.y, f.w, f.h,
			d.x-f.w/2, d.y-f.h/2, f.w, f.h);

		if (d.slowMode) {
			DC.fillStyle = 'white';
			DC.beginPath();
			DC.arc(d.x, d.y, d.h, 0, 2*Math.PI);
			DC.closePath();
			DC.fill();
		}

		DC.restore();
	},
	newdata: function(d) {
		return extend(newState(this.states), {
			r: 15,
			h: 3,

			x: (GAME.rect.l+GAME.rect.r)/2,
			y: GAME.rect.t*0.2 + GAME.rect.b*0.8,
			vx: 0,
			vy: 0,
			x0: 0,
			y0: 0,

			fire: newTicker(180),
			frame: newTicker(150),
			frames: this.frames0,
			framei: 0,
		}, d);
	},
	updateframe: function(d) {
		if (d.x != d.x0 && !d.slowMode) {
			var fs = d.x < d.x0 ? this.framesL : this.framesR;
			if (d.frames != fs) {
				d.frames = fs;
				d.framei = 0;
			}
			d.framei = Math.min(d.framei + 1, d.frames.length - 1);
		}
		else {
			if (d.frames != this.frames0) {
				d.frames = this.frames0;
				d.framei = 0;
			}
			d.framei = (d.framei + 1) % d.frames.length;
		}
	},

	states: {
		0: { creating: 1, life: 1000, next:  1, isInvinc: 1 },
		1: { living:   1, life:  Inf, next:  2 },
		2: { dying:    1, life:  500 },
		3: { bomb:     1, life: 5000, next:  1, isInvinc: 1 },
		4: { juesi:    1, life:   50, next:  2, isInvinc: 1 },
	},

	frames0: [ /* move up/down */
		{ res:'player0L', x:32*0, y: 0, w:32, h:48 },
		{ res:'player0L', x:32*1, y: 0, w:32, h:48 },
		{ res:'player0L', x:32*2, y: 0, w:32, h:48 },
		{ res:'player0L', x:32*3, y: 0, w:32, h:48 },
	],
	framesL: [ /* move left */
		{ res:'player0L', x:32*0, y:48, w:32, h:48 },
		{ res:'player0L', x:32*1, y:48, w:32, h:48 },
		{ res:'player0L', x:32*2, y:48, w:32, h:48 },
		{ res:'player0L', x:32*3, y:48, w:32, h:48 },
		{ res:'player0L', x:32*4, y:48, w:32, h:48 },
		{ res:'player0L', x:32*5, y:48, w:32, h:48 },
		{ res:'player0L', x:32*6, y:48, w:32, h:48 },
	],
	framesR: [ /* move right */
		{ res:'player0R', x:255-32*1, y:48, w:32, h:48 },
		{ res:'player0R', x:255-32*2, y:48, w:32, h:48 },
		{ res:'player0R', x:255-32*3, y:48, w:32, h:48 },
		{ res:'player0R', x:255-32*4, y:48, w:32, h:48 },
		{ res:'player0R', x:255-32*5, y:48, w:32, h:48 },
		{ res:'player0R', x:255-32*6, y:48, w:32, h:48 },
		{ res:'player0R', x:255-32*7, y:48, w:32, h:48 },
	],

	conf: {
		key_left: 37,
		key_up: 38,
		key_right: 39,
		key_down: 40,
		key_fire: GAME.keychars.Z,
		key_bomb: GAME.keychars.X,
	},
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata(d);
	if (d && d.conf)
		this.conf = extend({}, c.conf, d.conf);
}, 'Static');

SPRITE.newCls('Ball', {
	hits: dictflip([
		'Ball',
	]),
	hit: function(v) {
		var d = this.data,
			e = v.data;
		var hit = circle_intersect(d, e);
		if (hit && d.state.creating) d.freeze = true;
		if (hit && e.state.creating) e.freeze = true;
		if (d.state.mkDamage && e.state.mkDamage && hit) {
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

	update: function(dt, d) {
		if (d.freeze) {
			if (d.state.creating)
				d.age -= dt;
			else {
				d.set('creating');
				d.age = d.state.life;
			}
			d.freeze = false;
		}
	},
	states: {
		0: { creating: 1, life:	300, next: 1 },
		1: { living:   1, life:	Inf, next: 2, mkDamage: 1 },
		2: { dying:    1, life: 300 }
	},
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata(d);
}, 'Base');

/*
SPRITE.newCls('Box', {
	hits: dictflip([
		'Ball',
	]),
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (e.x-e.r<d.l && e.x+e.r>d.l && e.y>d.t && e.y<d.b) {
			e.x = e.x < d.l ? d.l - e.r : d.l + e.r;
			e.vx = -e.vx;
		}
		else if (e.x-e.r<d.r && e.x+e.r>d.r && e.y>d.t && e.y<d.b) {
			e.x = e.x < d.r ? d.r - e.r : d.r + e.r;
			e.vx = -e.vx;
		}
		else if (e.y-e.r<d.t && e.y+e.r>d.t && e.x>d.l && e.x<d.r) {
			e.y = e.y < d.t ? d.t - e.r : d.t + e.r;
			e.vy = -e.vy;
		}
		else if (e.y-e.r<d.b && e.y+e.r>d.b && e.x>d.l && e.x<d.r) {
			e.y = e.y < d.b ? d.b - e.r : d.b + e.r;
			e.vy = -e.vy;
		}
	},

	run: function(dt) {
		var d = this.data;
		make_rect(this.rect, d.l, d.t, d.r, d.b);
	},
	draw: function() {
		var d = this.data;
		DC.beginPath();
		DC.rect(d.l, d.t, d.r-d.l, d.b-d.t);
		DC.closePath();
		DC.stroke();
	}
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = extend({
		l: 0,
		t: 0,
		r: 500,
		b: 500
	}, d);
});
*/

SPRITE.newCls('Enemy', {
	hits: dictflip([
		'Bullet',
	]),
	hit: function(v) {
		var d = this.data,
			e = v.data;
		if (d.state.dying || e.state.dying)
			return;
		if (circle_intersect(d, e)) {
			e.set('dying');
			d.life --;
			if (d.life <= 0) {
				d.set('dying');
				STORY.on(STORY.events.ENEMY_KILL, this);
			}
		}
	},
	
	states: {
		0: { creating: 1, life:	500, next: 1 },
		1: { living:   1, life:	Inf, next: 2, mkDamage: 1 },
		2: { dying:    1, life: 500 }
	},
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata({
		r: 20,
		y: GAME.rect.t*0.9+GAME.rect.b*0.1,
		life: 50
	}, d);
}, 'Base');

SPRITE.newCls('Bullet', {
	update: function(dt, d) {
		var u = d.to,
			e = u && u.data;
		if (!u || !u.isAlive || !e.state.mkDamage)
			return;
		if (d.type == 1) {
			var r = sqrt_sum(d.x - e.x, d.y - e.y),
				v = sqrt_sum(d.vx, d.vy);
			d.vx = v * (e.x - d.x)/r;
			d.vy = v * (e.y - d.y)/r;
		}
	},
	states: {
		0: { creating: 1, life: 100, next: 1 },
		1: { living:   1, life: Inf, next: 2 },
		2: { dying:    1, life: 10 }	
	},
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata({
		r: 5,
		vy: -0.5,
		color: 'white',
		from: null
	}, d);
}, 'Base');

SPRITE.newCls('Drop', {
	update: function(dt, d) {
		if (d.collected) {
			var e = d.collected.data,
				v = d.collected_auto ? 0.6 : sqrt_sum(d.vx, d.vy),
				r = sqrt_sum(d.x - e.x, d.y - e.y),
				sin = (e.x - d.x) / r,
				cos = (e.y - d.y) / r;
			d.vx = v * sin;
			d.vy = v * cos;
			d.collected = null;
			d.collected_auto = false;
		}
		else if (d.vy < 0.15)
			d.vy += 0.001 * dt;
	},
	paint: function(d) {
		DC.beginPath();
		DC.arc(d.x, d.y, d.h, 0, 2*Math.PI);
		DC.closePath();
		DC.fill();
	},
	space: {
		l: 200,
		r: 40,
		t: 40,
		b: 20
	},
	states: {
		0: { creating: 1, life: 300, next: 1 },
		1: { living:   1, life: Inf, next: 2 },
		2: { dying:    1, life: 100 }	
	},
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata({
		r: 60,
		h: 20,
		vy: -0.4,
		color: 'white',
	}, d);
}, 'Base');

SPRITE.newCls('Dannmaku', {
	update: function(dt, d) {
		var u = d.from,
			e = u && u.data;
		if (!u || !u.isAlive || !e.state.living)
			return;
		if (d.type == 1) {
			if (d.age < 1000) {
				d.vx -= 30e-7 * dt * (d.x - e.x);
				d.vy -= 30e-7 * dt * (d.y - e.y);
			}
		}
		else if (d.type == 2) {
			if (Math.abs(d.vx) > 0.03) d.vx *= 0.992;
			if (Math.abs(d.vy) > 0.03) d.vy *= 0.992;
		}
		else if (d.type == 3) {
			if (d.age < 1000) {
				d.vx *= 0.98;
				d.vy *= 0.98;
			}
			else {
				var p = randin(SPRITE.obj.Player).data;
				d.vx -= 10e-7 * dt * (d.x - p.x);
				d.vy -= 10e-7 * dt * (d.y - p.y);
			}
		}
		else if (d.type == 4) {
			if (!d.pos) d.pos = {x: e.x, y: e.y, t: 0};
			if (!e.dir) e.dir = Math.floor(random(2))*2-1;
			d.pos.t += dt;
			d.x = 100*Math.sin(e.dir*d.pos.t/400) + d.pos.x;
			d.y = 100*Math.cos(e.dir*d.pos.t/400) + d.pos.y;
		}
	},
	states: {
		0: { creating: 1, life: 100, next: 1 },
		1: { living:   1, life: Inf, next: 2, mkDamage: 1 },
		2: { dying:    1, life: 300 }
	},
}, function(d, c) {
	this.isAlive = true;
	this.rect = {};
	this.data = c.newdata({
		r: 5,
		vy: 0.3,
		color: 'red',
		from: null
	}, d);
}, 'Base');

setInterval(function() {
	var dt = TimeCounter();
	if (GAME.state == GAME.states.RUNNING)
		GAME.run(Math.min(dt, 15));
}, 10);

setInterval(function() {
	GAME.fps = FPSCounter();
	GAME.draw();
}, 16.6);

setInterval(function() {
	ieach($('.ui'), function(i, e) {
		if (!e.bindExec)
			e.bindExec = Function('return '+$attr(e, 'ui-bind'));
		e.innerHTML = e.bindExec();
	});
}, 80);

window.addEventListener('keydown', GAME.input);
window.addEventListener('keyup', GAME.input);

// for test only
function newBall(c, v) {
	var t = random(-1, 1) * Math.PI / 2;
	SPRITE.newObj('Ball', {
		x: random(GAME.rect.l, GAME.rect.r),
		y: random(GAME.rect.t, GAME.rect.t*0.4+GAME.rect.b*0.6),
		vx: v*Math.sin(t),
		vy: v*Math.cos(t),
		r: 10,
		color: c
	});
}
function newBullet(v) {
	var e = null, r = Inf;
	SPRITE.eachObj(function(u) {
		if (u.data.state.mkDamage) {
			var r0 = squa_sum(u.data.x-v.data.x, u.data.y-v.data.y);
			if (r0 < r) {
				r = r0;
				e = u;
			}
		}
	}, 'Enemy');
	SPRITE.newObj('Bullet', {
		x: v.data.x + 10,
		y: v.data.y,
		vy: -0.5,
		from: v,
	});
	SPRITE.newObj('Bullet', {
		x: v.data.x - 10,
		y: v.data.y,
		vy: -0.5,
		from: v,
	});
	SPRITE.newObj('Bullet', {
		x: v.data.x + 20,
		y: v.data.y,
		vy: -0.45,
		vx: 0.1,
		type: 1,
		from: v,
		to: e
	});
	SPRITE.newObj('Bullet', {
		x: v.data.x - 20,
		y: v.data.y,
		vy: -0.45,
		vx: -0.1,
		type: 1,
		from: v,
		to: e
	});
}
function newDannmaku(v, type) {
	STORY.timeout(function (tc, ts) {
		if (!this.isAlive && !this.data.state.living)
			return;
		var e = this.data,
			p = randin(SPRITE.obj.Player).data;
		var r = sqrt_sum(e.x-p.x, e.y-p.y),
			t = Math.asin((p.x - e.x) / r),
			n = 15, p = Math.PI*1.5,
			i = (ts % n - (n-1) / 2) * p/n,
			c = t + i*random(0.8, 1.2),
			dx = Math.sin(c),
			dy = Math.cos(c);
		SPRITE.newObj('Dannmaku', {
			x: e.x + 20*dx,
			y: e.y + 20*dy,
			vx: 0.3*dx,
			vy: 0.3*dy,
			from: this,
			color: e.color,
			type: type
		});
	}, 20, v, 100);
}
function newEnemy(type) {
	var v = SPRITE.newObj('Enemy', {
		x: random(GAME.rect.l+100, GAME.rect.r-100),
		vx: random(-0.05, 0.05),
		vy: random(0.01, 0.1),
	});
	STORY.timeout(function () {
		newDannmaku(this, type);
	}, 2000, v);
}
function newBoss() {
	var v = SPRITE.newObj('Enemy', {
		r: 50,
		color: 'gold',
		life: 300
	});
}
function killObj(ls) {
	ieach(ls, function(i, c) {
		SPRITE.eachObj(function(v) {
			if (!v.data.state.dying)
				v.data.set('dying');
		}, c);
	})
}

var tl = {};
tl.all = {
	after_on: function(e, v, d, s) {
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
			GAME.state = GAME.states.PAUSE;
			// simply reset player state
			v.data.set('creating');
		}
		else if (e == STORY.events.PLAYER_FIRE) {
			if (!d.disable_fire)
				newBullet(v);
		}
		else if (e == STORY.events.PLAYER_BOMB) {
			// to be finished
		}
	}
};
tl.init = {
	init: function(d) {
		// start the game!
		GAME.state = GAME.states.RUNNING;
		SPRITE.clearObj();
		/*
		SPRITE.newObj('Player', {
			x: 100,
			conf: {
				key_up: GAME.keychars.W,
				key_down: GAME.keychars.S,
				key_left: GAME.keychars.A,
				key_right: GAME.keychars.D,
			}
		});
		*/
		SPRITE.newObj('Player');

		d.title = SPRITE.newObj('Static', {
			t: 'Dannmaku Demo!'
		});
	},
	run: function(dt, d) {
		d.age = (d.age || 0) + dt;
		if (d.age > 5000) {
			d.title.data.set('dying');
			return 'sec0';
		}
	}
};
tl.sec0 = {
	init: function(d) {
		killObj(['Static']);
		STORY.timeout(function() {
			STORY.timeout(function(c, s) {
				var c = [ 'gray', 'lime', 'black', 'skyblue', 'lightgreen', 'orange',
					'navy', 'pink', 'cyan', 'purple', 'blue', 'red', 'yellow', 'green'];
				newBall(c[s % c.length], 0.02);
			}, 20, null, 80);
		}, 1000);
	},
	run: function(dt, d) {
		d.age = (d.age || 0) + dt;
		if (d.age > 15000)
			return 'sec1';
	},
	on: function(e, v, d) {
		if (e == STORY.events.OBJECT_OUT) {
			if (v.cls == 'Ball')
				newBall(v.data.color, 0.25);
		}
	}
};
tl.sec1 = {
	init: function(d) {
		killObj(['Ball', 'Enemy', 'Dannmaku']);
		STORY.timeout(function () {
			newEnemy(tl.loop || 0);
		}, 1000, null, 3);
	},
	run: function(dt, d) {
		if (d.pass) {
			tl.loop = (tl.loop || 0) + 1;
			if (tl.loop >= 5) {
				return 'diag';
			}
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
			var pass = reduce(SPRITE.obj.Enemy, function(i, v, r) {
				return v.isAlive ? (r && v.data.state.dying) : r;
			}, true);
			if (pass) STORY.timeout(function() {
				this.pass = true;
			}, 1000, d);
		}
		else if (e == STORY.events.OBJECT_OUT) {
			if (v.cls == 'Enemy' && !v.data.state.dying)
				newEnemy(tl.loop);
		}
	}
};
tl.diag = {
	init: function(d) {
		d.ste = newState({
			0: { life: 1, next: 1, data: { t: 'x0', x: GAME.rect.l+100 } },
			1: { life: 1, next: 2, data: { t: 'y0', x: GAME.rect.r-100 } },
			2: { life: 1, next: 3, data: { t: 'x1', x: GAME.rect.l+100 } },
			3: { life: 1, next: 4, data: { t: 'y2', x: GAME.rect.r-100 } },
			4: { life: 1, next: 5, data: { t: 'x1', x: GAME.rect.l+100 } },
			5: { life: 1, data: { t: 'y2', x: GAME.rect.r-100 } },
		});
		STORY.timeout(function() {
			this.ste.run(0.1);
			this.obj = SPRITE.newObj('Static', d.ste.state.data);
		}, 1000, d);
	},
	run: function(dt, d) {
		d.disable_fire = true;
		if (GAME.keyste.ctrlKey)
			tl.diag.next(d);
		if (d.pass)
			return 'boss';
	},
	on: function(e, v, d) {
		if (e == STORY.events.GAME_INPUT) {
			if (v.type == 'keyup' && v.which == GAME.keychars.Z)
				tl.diag.next(d);
		}
	},
	next: function(d) {
		if (!d.obj)
			return;
		d.ste.run(1);
		d.obj.data.set('dying');
		var n = d.ste.state.data;
		if (n)
			d.obj = SPRITE.newObj('Static', n);
		else {
			d.obj = null;
			STORY.timeout(function() {
				this.pass = true;
			}, 1000, d);
		}
	}
};
tl.boss = {
	init: function(d) {
		killObj(['Static', 'Enemy', 'Dannmaku']);
		STORY.timeout(function () {
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
		else if (e == STORY.events.PLAYER_DROP_COLLECTED) {
			if (v[1].data.pass)
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
STORY.timeline = tl;

GAME.init();
