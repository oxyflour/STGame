var Inf = parseFloat('Infinity'),
	PI = Math.PI,
	PI2 = Math.PI * 2;

function return_nothing() {
}
function return_self(x) {
	return x;
}
function return_second(x0, x) {
	return x;
}
function same_type(a, b) {
	return typeof(a) === typeof(b);
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
function ease_in(f) {
	return f * f;
}
function ease_out(f) {
	return Math.sqrt(f);
}
function ease_in_out(f) {
	return (Math.sin((f - 0.5) * PI) + 1) * 0.5;
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
	return rt1.l < rt2.r && rt2.l < rt1.r &&
		rt1.t < rt2.b && rt2.t < rt1.b;
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
function redirect_object(from, to, v, f) {
	if (to.x == from.x && to.y == from.y)
		return from.vx = from.vy = 0;
	var dx = to.x - from.x,
		dy = to.y - from.y,
		r = sqrt_sum(dx, dy);
	var vx = v * dx / r,
		vy = v * dy / r;
	if (f > 0 && f < 1) {
		var tx = interp(from.vx, vx, f),
			ty = interp(from.vy, vy, f),
			tr = sqrt_sum(tx, ty);
		vx = v * tx / tr;
		vy = v * ty / tr;
	}
	from.vx = vx;
	from.vy = vy;
	return r;
}

// see http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function hue2rgb(p, q, t) {
	if (t < 0)
		t += 1;
	if (t > 1)
		t -= 1;
	if (t < 1/6)
		return p + (q - p) * 6 * t;
	if (t < 1/2)
		return q;
	if (t < 2/3)
		return p + (q - p) * (2/3 - t) * 6;
	return p;
}
function hsl2rgb(h, s, l) {
	var r, g, b;
	if (s == 0) {
		r = g = b = l; // achromatic
	}
	else {
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
			p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function rgb2hsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	}
	else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h, s, l];
}

function $(s, p) {
	return (p || document).querySelectorAll(s);
}
function $i(s, p) {
	return $.apply(null, arguments)[0];
}
function $e(id) {
	return document.getElementById(id);
}
function $attr(e, a) {
	if (same_type(e, '')) e = $i(e);
	var attr = e && e.attributes[a];
	return attr && attr.textContent;
}
function $style(e, k) {
	if (same_type(e, '')) e = $i(e);
	var style = getComputedStyle(e);
	return style && style.getPropertyValue(k);
}
function $prefixStyle(s, k, v) {
	ieach([
		'webkit',
		'ms',
		'Moz',
	], function(i, p, s) {
		s[p+k] = v;
	}, s)
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
		var nt = _t.length, nu = unused.length;
		if (nu > 100 || (nt && nu / nt > 0.8))
			_t.clean();
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
	var cleaner = newTicker(5000, function() {
		_t.clean();
	});

	_t.groups = {};
	_t.sort = [];
	_t.resort = function() {
		_t.sort = keys(_t.groups).sort();
		_t.length = 0;
		ieach(_t.sort, function(i, k) {
			_t.push(_t.groups[k]);
		});
	};
	_t.clean = function() {
		ieach(_t.sort, function(i, k) {
			if (_t.groups[k] == 0)
				delete _t.groups[k];
		});
		_t.resort();
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
		cleaner.run(dt);
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
			})
			v = v.replace(/\(([^\)]+)\)/gm, function(match, name) {
				return match.replace(/,/g, '#comma#');
			});
			ieach(v.split(','), function(i, v) {
				v = v.replace(/#comma#/gm, ',');
				d.push({ k:k, v:v });
			});
		}, []);
	}
	function getScale(scale) {
		var st = (scale || '').split(' '),
			x = parseFloat(st[0]),
			y = parseFloat(st[1]);
		if (+x === x && +y === y)
			return [x, y];
		else if (+x === x)
			return [x, x];
		else
			return [1, 1];
	}
	function getStack(stack) {
		return stack == 'y' ? [0, 1] : [1, 0];
	}
	function getColorRGB(color) {
		var id = 'div_test_color',
			div = $e(id);
		if (!div) {
			div = document.createElement('div');
			div.id = id;
			div.style.display = 'none';
			document.body.appendChild(div);
		}
		div.style.backgroundColor = color;
		return $style(div, 'background-color').match(/\d+/g).map(parseFloat);
	}
	function updateCanvas(canv) {
		var dc = canv.getContext('2d'),
			sc = getSrc($attr(canv, 'from')),
			ts = getTrans($attr(canv, 'transform')),
			scale = getScale($attr(canv, 'scale')),
			stack = getStack($attr(canv, 'stack'));
		canv.width = (sc.w + sc.w*(ts.length-1)*stack[0]) * scale[0];
		canv.height = (sc.h + sc.h*(ts.length-1)*stack[1]) * scale[1];
		ieach(ts, function(i, t) {
			dc.save();
			dc.scale(scale[0], scale[1]);
			dc.translate(sc.w*i*stack[0], sc.h*i*stack[1]);
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
				dc.rotate(parseInt(t.v)*PI/180);
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					-sc.w/2, -sc.h/2, sc.w, sc.h);
			}
			else if (t.k == 'offset') {
				var st = t.v.split(' ').map(parseFloat);
				dc.drawImage(sc.s, sc.x + st[0], sc.y + st[1], sc.w, sc.h,
					0, 0, sc.w, sc.h);
			}
			else if (t.k == 'colormask') {
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					0, 0, sc.w, sc.h);
				dc.globalCompositeOperation = 'source-atop';
				dc.fillStyle = t.v;
				dc.fillRect(0, 0, sc.w, sc.h);
			}
			else {
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					0, 0, sc.w, sc.h);
			}
			dc.restore();
			var w = sc.w*scale[0],
				h = sc.h*scale[1],
				x = w*i*stack[0],
				y = h*i*stack[1];
			if (t.k == 'colormap') {
				/*
				 * context.getImageData() does not work in chrome when opened in a local disk
				 */
				var st = t.v.split('->');
					source = st[0].trim(),
					color = st[1].trim(),
					rgb0 = getColorRGB(color),
					hsl0 = rgb2hsl(rgb0[0], rgb0[1], rgb0[2]);
					im = dc.getImageData(x, y, w, h),
					d = im.data;
				for (var i = 0; i < d.length; i += 4) {
					var hsl = rgb2hsl(d[i], d[i+1], d[i+2]);
					if (source == 'l') {
						hsl[0] = hsl0[0];
						hsl[1] = hsl[2];
						hsl[2] = hsl[1]*hsl0[2];
					}
					var rgb = hsl2rgb(hsl[0], hsl[1], hsl[2]);
					d[i] = rgb[0];
					d[i+1] = rgb[1];
					d[i+2] = rgb[2];
				}
				dc.putImageData(im, x, y);
			}
		});
	}
	function loaded() {
		ieach(res.children, function(i, v, d) {
			if (v.tagName == 'CANVAS') {
				if ($attr(v, 'from'))
					updateCanvas(v);
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
		}, 300);
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
	function draw() {
		(this.finished = this.obj.finished) || this.obj.draw();
	}
	var _t = {
		cls: newGroupAnim(),
		layers: newGroupAnim(),
		proto: {},
		elems: {},
	};
	_t.newCls = function(c, f, fn) {
		var from = f.substring ? new _t.proto[f].init() : {},
			proto = (f.call ? f : fn)(from);
		fill(proto, from);
		proto.clsName = c;
		_t.proto[c] = proto.init.prototype = proto;
		return proto;
	};
	_t.newObj = function(c, d) {
		var obj = new _t.proto[c].init(d);
		_t.cls.add(c, obj);
		_t.layers.add(obj.layer, { obj:obj, run:draw });
		if (obj.id) {
			if (_t.elems[obj.id])
				_t.elems[obj.id].finished = true;
			_t.elems[obj.id] = obj;
		}
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
	var _t = {};
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
					obj1.hitWith(obj2, dt);
			}, c2);
		}, c1);
	};
	var _t = {};
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
		if (same_type(fn, '')) {
			var id = fn;
			fn = function(i, v) {
				if (v.data.id == id)
					return v;
			};
		}
		return SPRITE.eachObj(fn || return_second, c);
	},
	getNearestAlive: function(v, c) {
		var r = Inf, t = undefined;
		SPRITE.eachObj(function(i, u) {
			if (u.is_dying)
				return;
			var r0 = squa_sum(u.data.x-v.data.x, u.data.y-v.data.y);
			if (r0 < r) {
				r = r0;
				t = u;
			}
		}, c);
		return t;
	},
	getGamePosX: function(f) {
		return interp(GAME.rect.l, GAME.rect.r, f);
	},
	getGamePosY: function(f) {
		return interp(GAME.rect.t, GAME.rect.b, f);
	},
	/*
	addAnim: function(v, d, t, id) {
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
		v.anim(t || 15, function(d) {
			if (d.value > d.max && d.step > 0)
				loop(d, d.min, d.max);
			else if (d.value < d.min && d.step < 0)
				loop(d, d.max, d.min);
			if (d.callback)
				d.callback(v);
			d.value += d.step;
		}, d, id);
	},
	*/
	// fs can be function, frame array, or a single frame
	addFrameAnim: function(v, fs, t) {
		t = t || v.data.frtick || 50;
		if (fs.push && fs.length == 1) {
			v.data.frame = fs[0];
			v.anim(0, 0, 0, 'frame');
		}
		else v.anim(t, function(d) {
			if (d.callback)
				d.frames = d.callback(v);
			if (d.frames) {
				d.index = (d.index + d.step) % d.frames.length;
				v.data.frame = d.frames[d.index];
			}
		}, {
			callback: fs.call && fs,
			frames: fs.length >= 0 ? fs : [fs],
			index: 0,
			step: 1,
		}, 'frame');
	},
	// ps should be array of objects like
	// { x/fx:0, y/fy:0, v:10 }
	// x and y should be between 0 and 1
	addPathAnim: function(v, ps, t) {
		t = t || v.data.pathtick || 50;
		ieach(ps, function(i, n, d) {
			if (+n.v !== n.v)
				n.v = d.v || 0.1;
			if (+n.x !== n.x)
				n.x = +n.fx===n.fx ? UTIL.getGamePosX(n.fx) : d.x;
			if (+n.y !== n.y)
				n.y = +n.fy===n.fy ? UTIL.getGamePosY(n.fy) : d.y;
			d.v = n.v;
			d.x = n.x;
			d.y = n.y;
		}, {});
		v.anim(t, function(d) {
			var e = v.data,
				i = d.index,
				n = d.pathnodes[d.index];
			if (!n) {
				e.vx = e.vy = 0;
				return true;
			}

			if (d.index == 0) {
				// directly move object to the first point
				if (+n.x === n.x) e.x = n.x;
				if (+n.y === n.y) e.y = n.y;
				d.index = 1;
				// skip points outside GAME.rect
				while (1) {
					var n = d.pathnodes[d.index];
					if (n && (n.x < GAME.rect.l || n.x > GAME.rect.r ||
							n.y < GAME.rect.t || n.y > GAME.rect.b))
						d.index ++;
					else
						break;
				}
			}
			else {
				d.time += d.tick;
				if (d.time > n.t || (+n.x === n.x && +n.y === n.y &&
						redirect_object(e, n, n.v) < n.v * d.tick)) {
					if (d.time < n.t) {
						e.x = n.x;
						e.y = n.y;
						e.vx = e.vy = 0;
					}
					else {
						d.index ++;
						d.time = 0;
					}
				}
			}

			if (i !== d.index) {
				n = d.pathnodes[d.index];
				n && n.fn && n.fn.apply(n, n.args ? arrcat([v], n.args) : [v]);
			}
		}, {
			tick: t,
			time: 0,
			pathnodes: ps,
			index: 0,
		}, 'path');
	},
	newTimeRunner: function(t, n) {
		return function(dt, d) {
			d.age = (d.age || 0) + dt;
			if (d.age > t) return n;
		}
	},
	pathOffset: function(ps, dx, dy) {
		return ieach(ps, function(i, v, d) {
			v = extend({}, v);
			v.x += dx;
			v.y += dy;
			d.push(v);
		}, []);
	},
};

(function() {
	var counter = newCounter();
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
})();

SPRITE.newCls('Basic', function(from) {
return proto = {
	layer: 'L10',
	runBasic: undefined,
	run: function(dt) {
		var d = this.data,
			p = d.parent;
		if (p && (p.finished || p.is_dying)) 
			d.dh = -d.kh;
		if ((d.age += dt) > d.duration)
			d.dh = -d.kh;

		if (d.ph < 1 || d.dh < 0)
			d.ph = limit_between(d.ph + d.dh*dt, 0, 1);
		if (d.ph == 0 && d.dh < 0)
			this.finished = true;

		this.is_creating = d.ph < 1 && d.dh > 0;
		this.is_dying = d.ph < 1 && d.dh < 0;

		if (this.runBasic)
			this.runBasic(dt, d);

		if (d.x + d.y !== d.y + d.x)
			this.finished = true;
	},
	drawBasic: undefined,
	drawText: function(d) {
		var t = d.text;
		if (t.text && t.res && t.map) {
			var m = t.map,
				w = m.cw * t.text.length,
				h = m.ch;
			ieach(t.text, function(i, c) {
				var pos = m[c];
				DC.drawImageInt(RES[t.res], pos.x, pos.y, m.cw, m.ch,
					d.x - w/2 + m.cw*i, d.y - h/2, m.cw, m.ch);
			});
		}
		else if (t.text) {
			if (t.font)
				DC.font = t.font;
			if (t.color)
				DC.fillStyle = t.color;
			DC.fillText(t.text, d.x, d.y);
		}
		else {
			DC.fillText(t, d.x, d.y);
		}
	},
	drawFrame: function(d) {
		var f = d.frame,
			w = (f.w || f.sw) * d.scale,
			h = (f.h || f.sh) * d.scale;
		if (f.rotate === undefined)
			f.rotate = 0;
		if (f.rotate) {
			var t = +f.rotate===f.rotate ? f.rotate :
				PI*1.5 + Math.atan2(d.vy, d.vx);
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
		var d = this.data;
		if (d.ph > 0) {
			DC.save();
			if (d.ph < 1 || d.opacity < 1)
				DC.globalAlpha = d.ph*d.opacity;
			if (d.blend)
				DC.globalCompositeOperation = d.blend;

			if (!this.drawBasic || this.drawBasic(d)) {
				if (d.frame)
					this.drawFrame(d);
				else if (d.text)
					this.drawText(d);
			}
			DC.restore();
		}
	},
	anim: function(t, fn, d, id) {
		if (t > 0) {
			t = newTicker(t, function(obj) {
				this.finished = obj.finished || fn.call(obj, d);
			}, this);

			STORY.anim.add(t);
			t.f(t.d);
		}

		if (id) {
			var k = 'anim_' + id;
			if (this[k])
				this[k].finished = true;
			this[k] = t;
		}

		return t;
	},
	die: function() {
		this.data.dh = -this.data.kh;
	},
	data0: {
		x: UTIL.getGamePosX(0.5),
		y: UTIL.getGamePosY(0.5),

		parent: undefined, // if parent is dead, it will kill self too

		frame: undefined, // i.e. {res:'player0L', sx:0, sy:0, sw:10, sh:10, w:10, h:10}
		text: undefined, // '' or {text:'', font:'', color:''} or {text:'', res:'', map:{}}
		blend: undefined,
		scale: 1,
		opacity: 1,

		// add later
		ph: 0,		// point of health, between 0 & 1
		dh: 1/500,	// delta of dh
		kh: 1/500,	// dh=-kh when call die();
		age: 0,
		duration: Inf,
	},
	init: function(d) {
		this.data = d = fill(d, proto.data0);
		if (d.frames)
			UTIL.addFrameAnim(this, d.frames);
		if (d.pathnodes)
			UTIL.addPathAnim(this, d.pathnodes);
		if (d.layer)
			this.layer = d.layer;
	}
}
});

SPRITE.newCls('Circle', 'Basic', function(from, proto) {
return proto = {
	runCircle: undefined,
	mkRect: function(rt, d) {
		rt.l = (d.x0 < d.x ? d.x0 : d.x) - d.r;
		rt.r = (d.x0 > d.x ? d.x0 : d.x) + d.r;
		rt.t = (d.y0 < d.y ? d.y0 : d.y) - d.r;
		rt.b = (d.y0 > d.y ? d.y0 : d.y) + d.r;
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
	runBasic: function(dt, d) {
		d.x0 = d.x;
		d.y0 = d.y;
		if (this.runCircle)
			this.runCircle(dt, d);
		d.x += d.vx * dt;
		d.y += d.vy * dt;

		var rt = this.rect, sp = this.space;
		this.mkRect(rt, d);
		this.checkPosition(rt, sp);
	},
	drawCircle: undefined,
	drawRound: function(d) {
		if (d.color)
			DC.fillStyle = d.color;
		DC.beginPath();
		DC.arc(d.x, d.y, d.r, 0, PI2);
		DC.closePath();
		DC.fill();
	},
	drawBasic: function(d) {
		if (!this.drawCircle || this.drawCircle(d)) {
			if (d.frame)
				return true;
			else
				this.drawRound(d);
		}
	},
	space: {
		l: 40,
		r: 40,
		t: 40,
		b: 20
	},
	data0: {
		r: 10,
		vx: 0,
		vy: 0,
		x0: 0,
		y0: 0,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
		this.rect = { l:0, t:0, r:0, b:0 };
	}
}
});

SPRITE.newCls('Player', 'Basic', function(from, proto) {
return proto = {
	hits: [
		'Player',
		'Enemy',
		'Dannmaku',
		'Drop',
	],
	hitWith: function(that) {
		var d = this.data,
			e = that.data;
		if (that.clsName == SPRITE.proto.Drop.clsName && !that.is_dying && !that.is_creating) {
			e.collected = this;
			if (circle_intersect(d, { x:e.x, y:e.y, r:20 }))
				STORY.on(STORY.events.DROP_COLLECTED, that);
		}
		else if (that.clsName == SPRITE.proto.Player.clsName) {
			if (circle_intersect(d, e))
				circles_hit(d, e)
		}
		else if (that.damage_pt) {
			var u = { x:d.x, y:d.y, r:d.h };
			if (!this.is_invinc && (that.is_line ? line_circle_intersect(e, u) : circle_intersect(e, u)))
				STORY.on(STORY.events.PLAYER_HIT, this);
			else if (!that.grazed && (that.is_line ? line_circle_intersect(e, d) : circle_intersect(e, d)))
				STORY.on(STORY.events.PLAYER_GRAZE, that.grazed = this);
		}
	},
	
	juesi: function() {
		this.is_juesi = 100;
	},
	bomb: function() {
		this.is_bomb = 5000;
	},
	runPlayer: function(dt, d) {
		var ks = GAME.keyste,
			cf = this.conf;

		this.is_invinc = this.is_creating || this.is_dying ||
			this.is_bomb || this.is_juesi;
		this.is_slow = ks.shiftKey;

		d.x0 = d.x;
		d.y0 = d.y;
		var v = this.is_slow ? cf.speed_low : cf.speed_high,
			vx = 0,
			vy = 0;
		if (ks[cf.key_left])
			vx += -v;
		if (ks[cf.key_right])
			vx += +v;
		if (ks[cf.key_up])
			vy += -v;
		if (ks[cf.key_down])
			vy += +v;
		if (vx && vy) {
			vx /= 1.414;
			vy /= 1.414
		}
		d.vx = vx;
		d.vy = vy;
		d.x += d.vx * dt;
		d.y += d.vy * dt;

		// FIRE!
		if (ks[cf.key_fire]) {
			if (!this.is_firing) this.anim(cf.fire_interval, function() {
				this.is_firing && STORY.on(STORY.events.PLAYER_FIRE, this);
			}, null, 'fire');
			this.is_firing = cf.fire_count;
		}
		else if (this.is_firing && (this.is_firing -= dt) <= 0)
			this.is_firing = 0;

		// JUESI!
		if (this.is_juesi > 0 && (this.is_juesi -= dt) <= 0) {
			this.is_juesi = 0;
			this.die();
			STORY.on(STORY.events.PLAYER_DYING, this);
		}

		// BOMB!
		if (this.is_bomb > 0) {
			this.is_juesi = 0;
			this.is_bomb -= dt;
		}
		if (ks[cf.key_bomb] && !this.is_dying && !(this.is_bomb > 0))
			STORY.on(STORY.events.PLAYER_BOMB, this);

		// AUTO COLLECT!
		if (d.y < UTIL.getGamePosY(0.3))
			STORY.on(STORY.events.PLAYER_AUTOCOLLECT, this);
	},
	runBasic: function(dt, d) {
		if (this.finished) {
			STORY.on(STORY.events.PLAYER_DEAD, this);
			return;
		}

		if (!this.is_dying)
			this.runPlayer(dt, d);

		var rt = this.rect;
		rt.l = d.x - d.r;
		rt.r = d.x + d.r;
		rt.t = d.y - d.r;
		rt.b = d.y + d.r;

		// limit player move inside boundary
		var gt = GAME.rect;
		if (rt.l < gt.l)
			d.x = gt.l + d.r;
		if (rt.r > gt.r)
			d.x = gt.r - d.r;
		if (rt.t < gt.t)
			d.y = gt.t + d.r;
		if (rt.b > gt.b)
			d.y = gt.b - d.r;

	},
	drawBasic: function(d) {
		if (this.is_invinc)
			DC.globalAlpha = 0.5;
		return true;
	},

	data0: {
		r: 15,
		h: 1,

		x: UTIL.getGamePosX(0.5),
		y: UTIL.getGamePosY(0.8),
		vx: 0,
		vy: 0,
		x0: 0,
		y0: 0,

		dh: 1/2000,
		kh: 1/1000,

		frtick: 120,
	  	frames: function(v) {
			var fs = RES.frames.Player0;
			if (v.is_dying) {
				fs = RES.frames.PlayerD;
				if (this.index + 1 > fs.length - 1)
					this.index = fs.length - 2;
			}
			else if (Math.abs(v.data.vx) > 0.1) {
				fs = v.data.vx < 0 ? RES.frames.PlayerL : RES.frames.PlayerR;
				if (this.frames != fs)
					this.index = 0;
				if (this.index + 1 > fs.length - 1)
					this.index = 4;
			}
			return fs;
		},
	},
	conf: {
		key_left: 37,
		key_up: 38,
		key_right: 39,
		key_down: 40,
		key_fire: GAME.keychars.Z,
		key_bomb: GAME.keychars.X,
		speed_high: 0.24,
		speed_low: 0.12,
		fire_interval: 1000 / 12,
		fire_count: 500,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
		this.rect = { l:0, t:0, r:0, b:0 };
		if (d.conf)
			this.conf = fill(d.conf, proto.conf);
	}
}
});

/*
SPRITE.newCls('Ball', 'Circle', function(from, proto) {
return proto = {
	layer: 'L20',
	hits: [
		'Ball',
	],
	hitWith: function(that) {
		var d = this.data,
			e = that.data;
		if (circle_intersect(d, e))
			circles_hit(d, e);
	},

	damage_pt: 1,
	data0: {
		dh: 1/200,
		kh: 1/500,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
	}
}
});

SPRITE.newCls('Stick', 'Circle', function(from, proto) {
return proto = {
	layer: 'L20',
	hits: [
		'Ball',
	],
	hitWith: function(that) {
		var d = this.data,
			e = that.data;
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
	drawBasic: function(d) {
		DC.beginPath();
		DC.moveTo(d.x, d.y);
		DC.lineTo(d.x + d.dx, d.y + d.dy);
		DC.lineWidth = d.r;
		DC.stroke();
		DC.closePath();
	},

	data0: {
		dh: 1/200,
		kh: 1/500,
		dx: 0,
		dy: (GAME.rect.b - GAME.rect.t)*0.2,
	},
	is_line: 1,
	damage_pt: 1,
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
	}
}
});
*/

SPRITE.newCls('Enemy', 'Circle', function(from, proto) {
return proto = {
	hits: [
		'Bullet',
		'Shield',
	],
	hitWith: function(that) {
		var d = this.data,
			e = that.data;
		if (!this.is_dying && !that.is_dying &&
				that.hit_with != this && circle_intersect(d, e)) {
			that.hit_with = this;
			d.damage += that.damage_pt || 1;
			if (that.clsName == SPRITE.proto.Bullet.clsName)
				STORY.on(STORY.events.BULLET_HIT, that);
			if (d.damage >= d.life)
				STORY.on(STORY.events.ENEMY_KILL, this);
		}
	},
	
	damage_pt: 1,
	data0: {
		dh: 1/100,
		kh: 1/100,
		r: 20,
		y: GAME.rect.t,
		life: 2,
		respawn: 0,
		damage: 0,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
	}
}
});

SPRITE.newCls('Shield', 'Circle', function(from, proto) {
return proto =  {
	hits: [
		'Dannmaku',
	],
	hitWith: function(that) {
		var d = this.data,
			e = that.data;
		if (!that.is_dying &&
				that.hit_with != this && circle_intersect(d, e)) {
			that.hit_with = this;
			STORY.on(STORY.events.DANNMAKU_HIT, that);
		}
	},
	
	damage_pt: 1,
	data0: {
		dh: 1/2000,
		kh: 1/500,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
	}
}
});

SPRITE.newCls('Drop', 'Circle', function(from, proto) {
return proto = {
	layer: 'L20',
	runCircle: function(dt, d) {
		var that = d.collected;
		if (that && that.finished)
			that = d.collected = UTIL.getOneObj('Player');
		if (that && !that.finished && !that.is_dying && !this.is_creating) {
			var e = that.data,
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
	drawBasic: function(d) {
		if (d.y < GAME.rect.t && d.frame_small) this.drawFrame({
			x: d.x,
			y: GAME.rect.t + 16,
			scale: 1,
			frame: d.frame_small,
		});
		return true;
	},
	space: {
		l: 40,
		r: 40,
		t: 300,
		b: 20
	},
	data0: {
		dh: 1/500,
		kh: 1/50,
		r: 60,
		vy: -0.4,
		collected: undefined,
		collected_auto: false,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0, {
			frames: RES.frames.Drops[2],
			frame_small: RES.frames.Drops[8],
		}));
	}
}
});

SPRITE.newCls('Bullet', 'Circle', function(from, proto) {
return proto =  {
	layer: 'L20',
	damage_pt: 1,
	data0: {
		dh: 1/50,
		kh: 1/400,
		r: 5,
		vy: -1.2,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
	}
}
});

SPRITE.newCls('Dannmaku', 'Circle', function(from, proto) {
return proto = {
	layer: 'L20',
	damage_pt: 1,
	data0: {
		dh: 1/300,
		kh: 1/300,
		r: 5,
		vy: 0.3,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
	}
}
});

// for test only
function newPlayer() {
	var p = SPRITE.newObj('Player');
	p.onmyous = {
		left: newOnmyou(p, 'OnmyouR', { x:-25, y:0 }, { x:-8, y:-28 }),
		right: newOnmyou(p, 'Onmyou', { x:+25, y:0 }, { x:+8, y:-28 }),
	};
	p.pslow = newPSlow(p);
	return p;
}
function newOnmyou(player, frames, pos1, pos2) {
	var obj = SPRITE.newObj('Basic', {
		parent: player,
		frames: RES.frames[frames],
	});
	obj.runBasic = function(dt, d) {
		var p = d.parent;
			v = p.is_slow ? 1 : -1;
		d.pos = limit_between((d.pos || 0) + 0.003*v*dt, 0, 1);
		d.x = p.data.x + interp(pos1.x, pos2.x, d.pos);
		d.y = p.data.y + interp(pos1.y, pos2.y, d.pos);
	};
	return obj;
}
function newPSlow(player) {
	var obj = SPRITE.newObj('Basic', {
		layer: 'L20',
		parent: player,
		frames: RES.frames.PSlow,
	});
	obj.runBasic = function(dt, d) {
		var p = d.parent,
			v = p.is_slow ? 1 : -1;
		d.x = p.data.x;
		d.y = p.data.y;
		d.opacity = limit_between(d.opacity + 0.003*v*dt, 0, 1);
	};
	return obj;
}
function newBullet(from, to) {
	from.bullet1_idx = ((from.bullet1_idx || 0) + 1) % 6;
	array(2, function(i, para) {
		var x = i % 2 ? -1 : 1;
		SPRITE.newObj('Bullet', {
			x: from.data.x + x*5,
			y: from.data.y,
			vx: 0.02*x,
			vy: -0.72,
			from: from,
			frtick: 1000/36,
			frames: RES.frames.Bullet0,
			opacity: 0.7,
		});
	});
	if (from.bullet1_idx == 0) {
		if (!to)
			to = UTIL.getNearestAlive(from, 'Enemy');
		array(4, function(i) {
			var x = i % 2 ? -1 : 1,
				v1 = random(0.4, 0.5),
				t = (from.is_slow ? random(-5, 5) : random(10, 20)-i*5) * PI / 180,
				onmyou = x > 0 ? from.onmyous.right : from.onmyous.left;
			SPRITE.newObj('Bullet', {
				x: onmyou.data.x,
				y: onmyou.data.y,
				vy: -v1*Math.cos(t),
				vx: x*v1*Math.sin(t),
				from: from,
				to: to,
				frtick: 1000/36,
				frames: RES.frames.Bullet1,
				opacity: 0.7,
			}).anim(50, function(k) {
				var d = this.data,
					that = d.to,
					e = that && that.data;
				if (that && !that.finished && that.damage_pt && !this.is_dying)
					redirect_object(d, e, sqrt_sum(d.vx, d.vy), 0.4);
			});
		})
	}
}
function newBomb(player) {
	var bg = SPRITE.newObj('Shield', {
		player: player,
		elem: $i('.bombbg'),
	});
	bg.draw = return_nothing;
	bg.data.elem.object = bg;
	bg.drawCircle = function(d) {
		var p = d.player;
		d.x = p.data.x;
		d.y = p.data.y;
		d.r = this.is_dying ? 400 - d.ph*300 : d.ph * 100;
		return true;
	};
	bg.anim(50, function(d) {
		var p = d.player;
		if ((p.finished || !p.is_bomb) && !bg.is_dying)
			bg.die();
		if (d.elem.object == bg)
			d.elem.style.opacity = limit_between(parseFloat(d.elem.style.opacity)+d.dh*50, 0, 1);
	}, bg.data);
	bg.anim(800, function(d) {
		if (!bg.is_dying)
			newShield(bg);
	});

	SPRITE.newObj('Basic', {
		x: player.data.x,
		y: player.data.y,
		frames: RES.frames.EffPlayer,
		scale: 1.5,
		dh: 1/100,
		kh: 1/850,
		duration: 150,
	});
}
function newShield(bg) {
	var p = bg.data.player;
	var sh = SPRITE.newObj('Shield', {
		x: p.data.x,
		y: p.data.y,
		vx: random(-0.1, 0.1),
		vy: random(-0.1, 0.1),
		frames: RES.frames.Shield[0],
		theta: random(0, PI2),
		dtheta: randin([-0.06, 0.06]),
		dv: 0.01,
		dh: 1/2000,
		kh: 1/1000,
		duration: 5000,
	});
	sh.damage_pt = 20;
	sh.drawCircle = function(d) {
		d.r = 1 + ease_out(d.ph) * 40;
		d.scale = d.r / 30;
		return true;
	};
	sh.anim(50, function(k) {
		var d = this.data;
		if (!d.to || d.to.finished)
			d.to = UTIL.getNearestAlive(this, 'Enemy');
		if (d.to && d.to != this.hit_with)
			redirect_object(d, d.to.data, sqrt_sum(d.vx, d.vy)+0.04, 0.2);
		else {
			d.vx *= 0.92;
			d.vy *= 0.92;
			d.theta += d.dtheta;
			d.vx += Math.sin(d.theta) * d.dv;
			d.vy += Math.cos(d.theta) * d.dv;
		}
	});
	ieach([1, 2, 3], function(i, v) {
		SPRITE.newObj('Basic', {
			index: v,
			theta: random(0, PI2),
			dtheta: random(-0.005, 0.005),
			dist: random(10, 15),
			parent: sh,
			frame: RES.frames.Shield[v],
			opacity: 0.5,
			blend: 'lighter',
			size: random(1.0, 1.6),
		}).runBasic = function(dt, d) {
			var p = d.parent;
			d.dist = p.data.r * 0.4;
			d.theta += d.dtheta * dt + random(-0.01, 0.01);
			d.x = p.data.x + d.dist * Math.cos(d.theta);
			d.y = p.data.y + d.dist * Math.sin(d.theta);
			if (!this.is_dying)
				d.scale = ease_out(d.ph) * d.size;
		};
	});
}

/*
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
function newDannmaku(d) {
	var v = SPRITE.newObj('Dannmaku', d);
	d = v.data;
	if (d.type == 'FollowTarget') {
		fill(d, {
			target_cls: undefined,
			target: undefined,
			decrease_duration: 1000,
			decrease_by: 0.95,
			velocity_min: 0.02,
			duration: 1500,
			gravity: 6e-5,
			accel_min: 0.1,
			offset_x: 0,
			offset_y: 0,
		});
		v.anim(50, function(k, v) {
			var d = v.data;
			if (v.data.age < d.decrease_duration) {
				d.vx *= d.decrease_by;
				d.vy *= d.decrease_by;
			}
			else if (v.data.age < d.decrease_duration + d.duration) {
				if (d.target && !d.target.finished) {
					var e = d.target.data,
						dx = e.x - d.x + d.offset_x,
						dy = e.y - d.y + d.offset_y;
					d.vx += d.gravity * dx;
					d.vy += d.gravity * dy;

					var v = sqrt_sum(d.vx, d.vy);
					if (v < d.accel_min && !d.grazed)
						redirect_object(d, e, v, 0.4);
				}
				else if (d.target_cls)
					d.target = UTIL.getOneObj(d.target_cls);
			}
			d.vx = keep_outside(d.vx, -d.velocity_min, d.velocity_min);
			d.vy = keep_outside(d.vy, -d.velocity_min, d.velocity_min);
		});
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
		v.runCircle = function(dt, d) {
			var f = d.from;
			if (f && !f.finished && !f.is_dying) {
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
			last.runCircle = function(dt, d) {
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
		if (!d.from || d.from.finished || d.from.is_dying) {
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
				d.decrease_by = x ? 0.96 : 1;
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
	return enm;
}
*/

function newSec1(pth, count, offset) {
	STORY.timeout(function (d, n) {
		ieach(offset || [[0, 0]], function(i, v) {
			var obj = SPRITE.newObj('Enemy', {
				frames: RES.frames.Enemy00,
				pathnodes: UTIL.pathOffset(RES.path[pth], v[0], v[1]),
			});
			STORY.timeout(function() {
				obj.anim(1500, newDanns1, obj);
			}, random(1500));
		});
	}, 250, null, count);
}
function newSec2(ylim, count) {
	STORY.timeout(function (d, n) {
		ieach([-1, 1], function(i, x) {
			var f = 0.5 + (n+0.5)/(count+0.5)*0.5 * x,
				dvx = 0.005 * x, dvy = -0.003;
			var obj = SPRITE.newObj('Enemy', {
				frames: RES.frames.Enemy00,
				x: UTIL.getGamePosX(f),
				y: 0,
				vy: 0.1,
				vx: 0,
				dvx: dvx,
				dvy: dvy,
			});
			obj.anim(50, function(d) {
				if (d.y > UTIL.getGamePosY(ylim)) {
					d.vx += d.dvx;
					d.vy += d.dvy;
				}
				if (d.age > 200 && !this.is_firing && (this.is_firing = true))
					newDanns1(this);
			}, obj.data);
		});
	}, 350, null, count);
}
function newSec3(tick, count) {
	STORY.timeout(function (d, n) {
		var enm = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy01,
			x: UTIL.getGamePosX(random(0, 1)),
			y: 0,
			vy: 0.1,
			vx: 0,
			dvy: -0.005,
			vx0: random(-0.1, 0.1),
		});
		enm.anim(50, function(d) {
			if (d.age > 600 && !this.is_firing && (this.is_firing = true)) {
				d.vy = 0;
				STORY.timeout(newDanns2, 300, this, 2)
				UTIL.addFrameAnim(enm, RES.frames.Enemy11);
			}
			else if (d.age > 2000) {
				d.vy += d.dvy;
				d.vx = d.vx0;
			}
		}, enm.data);
	}, tick, null, count);
}
function newSec4() {
	STORY.timeout(function (d, n) {
		var pth = RES.path[randin(['s0A1', 's0A2'])],
			ps = UTIL.pathOffset(pth, random(-200, 200), random(0, 200));
			px = ps[0].x;
		ps[0].x = ps[0].y = undefined;
		var obj = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy00,
			x: px,
			y: GAME.rect.t,
			pathnodes: ps,
		});
		STORY.timeout(function() {
			obj.anim(1500, newDanns1, obj);
		}, random(1500));
	}, 300, null, 10);
}

function newDanns1(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) {
		newDannmaku(from, to, 0, 0, 0.2, 0, {
			color: 'b',
			frames: RES.frames.TamaSmallX[5],
		});
	}
}
function newDanns2(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) range(0.501, -0.5, 1/8, function(f) {
		var obj = newDannmaku(from, to, 0, f*PI*0.6, 0.5, 0, {
			color: 'r',
			frames: RES.frames.TamaA[2],
		});
		obj.anim(50, function(d) {
			if (d.age < 500) {
				d.vx *= 0.85;
				d.vy *= 0.85;
			}
			else
				return true;
		}, obj.data);
	})
}
function newDannmaku(from, to, r, rt, v, vt, ext) {
	if (!to || !to.data) to = {
		data: { x: UTIL.getGamePosX(0.5), y: UTIL.getGamePosY(0.9), },
	};
	var rt0 = Math.atan2(to.data.y - from.data.y, to.data.x - from.data.x),
		cos = Math.cos(rt0 + rt),
		sin = Math.sin(rt0 + rt),
		cosv = Math.cos(rt0 + rt + vt),
		sinv = Math.sin(rt0 + rt + vt);
	var obj = SPRITE.newObj('Dannmaku', fill(ext, {
		x: from.data.x + r * cos,
		y: from.data.y + r * sin,
		vx: v * cosv,
		vy: v * sinv,
	}));
	obj.runCircle = function(dt, d) {
		if (this.is_creating) {
			if (!this.is_freezed && (this.is_freezed = true)) {
				d.vx0 = d.vx;
				d.vy0 = d.vy;
				d.scale0 = d.scale;
				d.vx = d.vx0 * 0.1;
				d.vy = d.vy0 * 0.1;
			}
			if (d.color && !this.is_color_set && (this.is_color_set = true))
				UTIL.addFrameAnim(this, RES.frames.TamaColorNew[d.color]);
			d.scale = 2.5 - d.ph * d.scale0;
		}
		else {
			if (this.is_freezed && !(this.is_freezed = false)) {
				d.vx = d.vx0;
				d.vy = d.vy0;
				d.scale = d.scale0;
			}
			if (d.frames && !this.is_frame_set && (this.is_frame_set = true))
				UTIL.addFrameAnim(this, d.frames);
		}
		if (this.is_dying) {
			if (d.color && !this.is_color_dead && (this.is_color_dead = true))
				UTIL.addFrameAnim(this, RES.frames.TamaColorDead[d.color]);
			d.scale += 0.005;
		}
	};
	return obj;
}
function newLaser(from, to) {
	if (!to || !to.data) to = {
		data: { x: UTIL.getGamePosX(0.5), y: UTIL.getGamePosY(0.9), },
	};
	var to = UTIL.getNearestAlive(from, 'Player') || {
		data: { x:UTIL.getGamePosX(0.5), y:GAME.rect.b, },
	}
	var px = from.data.x + random(-50, 50),
		py = from.data.y + random(-50, 50),
		dy = (GAME.rect.b - GAME.rect.t),
		dx = dy * (to.data.x - px) / (to.data.y - py);
	var obj = SPRITE.newObj('Dannmaku', {
		r: 10,
		x: px,
		y: py,
		vx: 0,
		vy: 0,
		dx: dx,
		dy: dy,
		frames: RES.frames.TamaFire[2],
		duration: 5000,
		dh: 1/3000,
		kh: 1/800,
	});
	obj.is_line = true;
	obj.mkRect = function(rt, d) {
		rt.l = Math.min(d.x0, d.x, d.x + d.dx);
		rt.t = Math.min(d.y0, d.y, d.y + d.dy);
		rt.r = Math.max(d.x0, d.x, d.x + d.dx);
		rt.b = Math.max(d.y0, d.y, d.y + d.dy);
	};
	obj.runCircle = function(dt, d) {
		this.damage_pt = this.is_creating || this.is_dying ? 0 : 1;
	};
	obj.drawCircle = function(d) {
		DC.beginPath();
		DC.moveTo(d.x, d.y);
		DC.lineTo(d.x + d.dx, d.y + d.dy);
		DC.strokeStyle = 'white';
		DC.lineWidth = d.r * d.ph;
		DC.stroke();
		DC.strokeStyle = 'blue';
		DC.lineWidth = 3;
		DC.stroke();
		DC.closePath();
		return true;
	};
}

function newBoss() {
	var boss = SPRITE.newObj('Enemy', {
		r: 24,
		life: 300,
		frtick: 150,
		frames: function(v) {
			var fs = [RES.frames.Boss],
				vx = Math.abs(v.data.vx);
			if (vx > 0.02 || vx < -0.02) {
				fs = v.data.vx > 0 ? RES.frames.BossL : RES.frames.BossR;
				if (this.frames != fs)
					this.index = 0;
				var max = vx > 0.1 ? fs.length - 2 : fs.length - 3;
				this.index = limit_between(this.index, 0, max);
			}
			return fs;
		},
		respawn: Inf,
		id: 'boss',
	});
	boss.effects = array(3, function(i) {
		var eff = newBossGadgets(boss);
		eff.drawEffects = eff.draw;
		eff.draw = return_nothing;
		return eff;
	});
	boss.drawBasic = function(d) {
		ieach(boss.effects, function(i, v) {
			if (v.data.z < 0)
				v.drawEffects();
		});
		if (d.frame)
			this.drawFrame(d);
		ieach(boss.effects, function(i, v) {
			if (v.data.z >= 0)
				v.drawEffects();
		});
	}
	return boss;
}
function newBossGadgets(boss) {
	var eff = SPRITE.newObj('Basic', {
		parent: boss,
		frames: RES.frames.EffBoss,
		rot: {
			theta: 0,
			dtheta: random(0.05, 0.10) / 30,
			phi: random(1),
			dphi: random(0.01, 0.05) / 30,
			radius1: random(50, 30),
			radius2: 10,
		}
	});
	eff.runBasic = function(dt, d) {
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
	return eff;
}
function newLifeBar(boss) {
	var bar = SPRITE.newObj('Basic', {
		parent: boss,
		x: GAME.rect.l+24,
		y: GAME.rect.t+8,
		frame: { res:'front', sx:0, sy:144, sw:48, sh:16, w:48, h:16 },
	});
	bar.drawBasic = function(d) {
		this.drawText({
			text: {
				text: '0',
				res: 'ascii_yellow',
				map: RES.fontmap,
			},
			x: d.x + 24 + 8,
			y: d.y,
		});
		var p = d.parent,
			x = d.x + 24 + 16,
			y = d.y + 2,
			len = GAME.rect.r - 50 - x;
		len *= (this.is_creating ? ease_out(d.ph) : 1) *
			(p.data.life - p.data.damage) / p.data.life;
		DC.beginPath();
		DC.moveTo(x, y);
		DC.lineTo(x + len, y);
		DC.closePath();
		DC.strokeStyle = 'white';
		DC.lineWidth = 5;
		DC.stroke();
		return true;
	};
	return bar;
}
function newCountDown(data) {
	var countdown = SPRITE.newObj('Basic', {
		x: GAME.rect.r-20,
		y: GAME.rect.t+8,
		text: {
			res: 'num',
			map: RES.nummap,
		},
	});
	countdown.anim(100, function(d) {
		var t = Math.max(Math.floor((d.duration - d.age) / 1000), 0);
		this.data.text.res = (t<5 && 'num3') || (t<10 && 'num2') || (t<20 && 'num1') || 'num0';
		this.data.text.text = (t < 10 ? '0' : '') + t;
	}, data);
	return countdown;
}
function newSCName(scname) {
	var scname = SPRITE.newObj('Basic', {
		x: GAME.rect.r-50,
		sy: GAME.rect.t+60,
		text: {
			text: scname,
			font: '15px Arial',
		},
	});
	scname.drawBasic = function(d) {
		if (this.is_creating)
			d.y = d.sy - ease_in(d.ph)*10;
		return true;
	};
	return scname;
}
function newBossBackground(boss) {
	var st = STORY.state.n;
	var obj = SPRITE.newObj('Basic', {
		x: 0,
		y: 0,
		elem: $i('.bossbg'),
	})
	obj.data.elem.object = obj;
	obj.anim(50, function(d) {
		d.elem.style.opacity = d.ph;
		d.elem.style['background-position'] = '0 '+(-d.age*0.1)+'px';
	}, obj.data)
	return obj;
}

function newBossDanns1(from, color, count, angular, dv) {
	var to = UTIL.getNearestAlive(from, 'Player'),
		frame = RES.frames.TamaA[('k rm b c g  y  w').indexOf(color)];
	if (!from.is_dying) array(count || 7, function(j) {
		range(1, 0.001, 1/(angular || 15), function(f) {
			newDannmaku(from, to, 0, f*PI2, 0.1+j*(dv || 0.01), 0, {
				color: color,
				frames: frame,
			})
		})
	})
}
function newBossDanns2(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var ds = [
		{ color:'k', frames:RES.frames.TamaSmallX[0] },
		{ color:'r', frames:RES.frames.TamaSmallX[1] },
		{ color:'r', frames:RES.frames.TamaSmallX[2] },
		{ color:'m', frames:RES.frames.TamaSmallX[3] },
		{ color:'m', frames:RES.frames.TamaSmallX[4] },
		{ color:'b', frames:RES.frames.TamaSmallX[5] },
		{ color:'b', frames:RES.frames.TamaSmallX[6] },
	];
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var para = d[j];
		range(1, 0.001, 1/15, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2+j*0.1, 0.1, 0, {
				color: para.color,
				frames: para.frames,
			});
			obj.anim(50, function(d) {
				if (d.age < 2000) {
					d.vx *= 0.95;
					d.vy *= 0.95;
				}
				else if (d.age > 2500) {
					var v = sqrt_sum(d.vx, d.vy);
					if (v < 0.2) {
						d.vx += d.vx / v * 0.01;
						d.vy += d.vy / v * 0.01;
					}
				}
			}, obj.data);
		});
	}, 150, ds, ds.length);
}
function newBossDanns3(from, colors) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var df = {
		'b': { color:'b', frames1:RES.frames.TamaSmallX[5], frames2:RES.frames.LongA[6], },
		'r': { color:'r', frames1:RES.frames.TamaSmallX[1], frames2:RES.frames.LongA[2], },
		'g': { color:'g', frames1:RES.frames.TamaSmallY[2], frames2:RES.frames.LongA[9], },
		'y': { color:'y', frames1:RES.frames.TamaSmallY[4], frames2:RES.frames.LongA[12], },
		'Y': { color:'y', frames1:RES.frames.TamaSmallY[5], frames2:RES.frames.LongA[14], },
		'B': { color:'b', frames1:RES.frames.TamaSmallX[5], frames2:RES.frames.TamaA[5], },
	};
	var ds = ieach(colors, function(i, c, d) {
		if (df[c]) d.push(df[c]);
	}, []);
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var para = d[j],
			dt1 = random(0.1),
			dt2 = random(0.1),
			v1 = random(0.06, 0.15),
			v2 = random(0.06, 0.15);
		range(1, 0.001, 1/20, function(f) {
			para.frames1 && newDannmaku(from, to, 0, f*PI2+dt1, v1, 0, {
				color: para.color,
				frames: para.frames1,
			});
			para.frames2 && newDannmaku(from, to, 0, f*PI2+dt2, v2, 0, {
				color: para.color,
				frames: para.frames2,
			});
		});
	}, 150, ds, ds.length);
}
function newBossDanns4(from, count) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) STORY.timeout(function(d, k) {
		c = count - k;
		array(10, function(j) {
			array(c, function(i) {
				var f = (i - (c-1) / 2)*0.015;
				newDannmaku(from, to, 0, f*PI2, 0.1+j*0.03, 0, {
					color: 'r',
					frames: RES.frames.TamaB[2],
				});
			});
		});
	}, 200, null, count);
}
function newBossDanns5(from, color, direction) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = {
		'g': RES.frames.TamaA[10],
		'b': RES.frames.TamaA[6],
		'c': RES.frames.TamaA[8],
	}[color];
	var n = 15;
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var k = 1 - j/(n-1),
			f = direction > 0 ? k - 0.2 : 0.2 - k;
		array(3, function(i) {
			newDannmaku(from, to, 0, f*0.2*PI2+i*0.05-k*0.01, 0.05+(i+0.2)*k*0.05, 0, {
				color: color,
				frames: frame,
			});
		});
	}, 30, null, n);
}
function newBossDanns6(from, color, count, angular, rad, v0, dr) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = {
		'g': RES.frames.TamaA[10],
		'r': RES.frames.LongA[2],
		'y': RES.frames.LongA[13],
	}[color || 'r'];
	if (!from.is_dying) array(count || 10, function(j) {
		range(0.501, -0.5, 1/((angular || 5) - 1), function(f) {
			newDannmaku(from, to, 0, f*(rad || 0.03)*PI2 + (dr || 0)*j, (v0 || 0.1)+j*0.03, 0, {
				color: color,
				frames: frame,
			});
		});
	});
}
function newBossDanns7(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) newLaser(from, to);
}
function newBossDanns8(from, color) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = {
		'g': RES.frames.LongA[10],
		'r': RES.frames.LongA[2],
		'b': RES.frames.LongA[6],
	}[color || 'r'];
	if (!from.is_dying) array(2, function(j) {
		var i = j;
		range(1, 0.001, 1/60, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2, 0.12+0.06*j, 0, {
				sx: from.data.x,
				sy: from.data.y,
				dv: 0.001 - j*0.00015,
				vr: 0,
				vt: i ++ % 2 ? 0.1 : -0.1,
				color: color,
				frames: frame,
			});
			obj.anim(50, function(d) {
				if (d.age < 2000) {
					d.vx *= 0.92;
					d.vy *= 0.92;
				}
				else {
					d.vr += d.dv;
					d.vt *= 0.99;
					var r = sqrt_sum(d.x - d.sx, d.y - d.sy),
						cos = (d.x - d.sx) / r,
						sin = (d.y - d.sy) / r;
					d.vx = d.vr * cos + d.vt * sin;
					d.vy = d.vr * sin - d.vt * cos;
				}
			}, obj.data);
		})
	});
}
function newBossDanns9(from, direction) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var n = 30;
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var k = 1 - j/(n-1),
			f = direction > 0 ? k - 0.2 : 0.2 - k;
		var obj = newDannmaku(from, to, 0, f*0.15*PI2, 0.1+k*0.2, 0, {
			release: 2000 + j*30,
			color: 'b',
			frames: RES.frames.TamaA[6],
		});
		obj.anim(50, function(d) {
			if (d.age < 2000) {
				d.vx *= 0.95;
				d.vy *= 0.95;
			}
			else if (d.age > d.release && d.age < 4000) {
				var e = to && to.data || { x:UTIL.getGamePosX(0.5), y:UTIL.getGamePosY(0.9) };
				d.vx += (e.x - d.x) * 2e-4;
				d.vy += (e.y - d.y) * 2e-4;
			}
		}, obj.data);
	}, 30, null, n);
}

function newEffect(from) {
	var d = from.data;
	SPRITE.newObj('Circle', {
		x: d.x,
		y: d.y,
		vx: d.vx*=0.1,
		vy: d.vy*=0.1,
		frames: {
			Enemy: RES.frames.EffEnemy,
			Player: RES.frames.EffPlayer,
		}[from.clsName],
		dh: 1,
		kh: 1/950,
		duration: 50,
	});
}
function newEffectPiece(from, color) {
	var frame = {
		'r': RES.frames.EffPieceR,
		'g': RES.frames.EffPieceG,
		'b': RES.frames.EffPieceB,
	}[color] || RES.frames.EffPiece;
	var p = SPRITE.newObj('Circle', {
		x: from.data.x + random(10),
		y: from.data.y + random(10),
		vx: random(-0.2, 0.2),
		vy: random(-0.2, 0.2),
		frames: randin(frame),
		scale: 1.5,
		opacity: 0.5,
		blend: 'lighter',
		dh: 50,
		kh: 1/random(500, 1000),
		duration: 100,
	})
	p.drawCircle = function(d) {
		d.scale = ease_in(d.ph) * 1.5 + 0.5;
		return true;
	};
	p.anim(50, function(d) {
		d.vx *= 0.97;
		d.vy *= 0.97;
	}, p.data);
	return p;
}
function newBackground(elems) {
	function updateImgs(imgs, f) {
		ieach(bg.imgs, function(i, e) {
			var v = e.val = {
				bg0: {
					persp: [900, 500],
					rotate: [50, 70],
					opacity: [1, 1],
					oriy: -50,
				},
				bg1: {
					persp: [700, 500],
					rotate: [30, 80],
					opacity: [1, 0],
					oriy: -100,
				}
			}[e.id];
			if (v) {
				var p = interp(v.persp[0], v.persp[1], f),
					r = interp(v.rotate[0], v.rotate[1], f),
					trans = 'perspective('+p+'px) rotateX('+r+'deg)',
					ori = '50% '+v.oriy+'px';
				$prefixStyle(e.style, 'Transform', trans);
				$prefixStyle(e.style, 'TransformOrigin', ori);
				e.style.opacity = interp(v.opacity[0], v.opacity[1], f);
				e.style.display = e.style.opacity > 0.05 ? 'block' : 'none';
			}
		});
	}
	var bg = SPRITE.newObj('Basic');
	bg.draw = return_nothing;
	bg.imgs = $('.bgimg');
	updateImgs(bg.imgs, 0);
	bg.elems = elems;
	ieach(elems, function(i, e) {
		e.object = bg;
		e.offset = 0;
		e.total = parseFloat($style(e, 'height')) - parseFloat($style('.game', 'height'));
		e.speed = parseFloat($attr(e, 'bg-speed') || '0');
		e.opacity = parseFloat(e.style.opacity || '1');
	});
	bg.anim(50, function(d) {
		ieach(this.elems, function(i, e) {
			e.offset += e.speed * 50;
			if (e.offset > 0)
				e.offset -= e.total;
			var trans = 'translateY(' + e.offset + 'px)',
				trans2 = trans + ' rotate(0.0001deg)';
			e.style.webkitTransform = trans2;
			e.style.msTransform = trans;
			e.style.MozTransform = trans2;
			e.style.opacity = e.opacity * bg.data.ph;
		});
		var age = bg.data.age,
			begin = 25000,
			end = 30000;
		if (age >= begin && age <= end) {
			var f = ease_in_out((age - begin) / (end - begin));
			ieach(this.imgs, function(i, e) {
				var v = e.val;
				if (v) {
					var p = interp(v.persp[0], v.persp[1], f),
						r = interp(v.rotate[0], v.rotate[1], f),
						trans = 'perspective('+p+'px) rotateX('+r+'deg)';
					$prefixStyle(e.style, 'Transform', trans);
					e.style.opacity = interp(v.opacity[0], v.opacity[1], f);
					e.style.display = e.style.opacity > 0.05 ? 'block' : 'none';
				}
			});
		}
	});
	return bg;
}
function killCls() {
	ieach(arguments, function(i, c) {
		SPRITE.eachObj(function(i, v) {
			if (!v.is_dying)
				v.die();
		}, c);
	})
}
function killObj() {
	ieach(arguments, function(i, v) {
		if (v && !v.is_dying)
			v.die();
	})
}

var STATICS = {
	max_point: 1000000,
	point: 0,
	player: 7,
	bomb: 7,
	power: 255,
	graze: 0,
	dot: 0,

	time: 0,
};

var hook = {
	init: function(n, d) {
		console.log('--> ', n)
	},
	quit: function(n, d) {
	},
	after_run: function(dt, d) {
		STATICS.time += dt;
	},
	before_on: function(e, v, d) {
		if (e == STORY.events.STORY_LOAD) {
			SPRITE.clrObj();
			newPlayer();
			newBackground($('.bg1'));
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
			SPRITE.eachObj(function(i, that) {
				that.data.collected = v;
				that.data.collected_auto = true;
			}, 'Drop');
		}
		else if (e == STORY.events.PLAYER_HIT) {
			STATICS.graze --;
			v.juesi();
			newEffect(v);
			array(8, function() {
				newEffectPiece(v, 'g');
			});
			STORY.timeout(function() {
				killCls('Dannmaku');
			}, 30, null, 20);
		}
		else if (e == STORY.events.PLAYER_GRAZE) {
			STATICS.graze ++;
		}
		else if (e == STORY.events.PLAYER_DYING) {
			var x = v.data.x,
				y = v.data.y;
			SPRITE.newObj('Drop', { vx:  -1, vy: -0.8, x:x, y:y });
			SPRITE.newObj('Drop', { vx:-0.5, vy:-0.85, x:x, y:y });
			SPRITE.newObj('Drop', { vx: 0.5, vy:-0.85, x:x, y:y });
			SPRITE.newObj('Drop', { vx:   1, vy: -0.8, x:x, y:y });
			STATICS.player --;
		}
		else if (e == STORY.events.PLAYER_DEAD) {
			newPlayer();
			STATICS.bomb = 7;
		}
		else if (e == STORY.events.PLAYER_FIRE) {
			if (!d.disable_fire && !v.is_dying)
				newBullet(v);
		}
		else if (e == STORY.events.PLAYER_BOMB) {
			if (!d.disable_fire) {
				STATICS.bomb --;
				v.bomb();
				newBomb(v);
			}
		}
		else if (e == STORY.events.ENEMY_KILL) {
			if (v.data.respawn-- <= 0)
				v.die();
			newEffect(v);
			array(8, function() {
				newEffectPiece(v, 'b');
			});
		}
		else if (e == STORY.events.DROP_COLLECTED) {
			v.die();
			STATICS.point += 10;
		}
		else if (e == STORY.events.BULLET_HIT) {
			v.die();
			v.data.vx *= 0.05;
			v.data.vy *= 0.05;
			UTIL.addFrameAnim(v, RES.frames.BulletD[v.data.to ? 1 : 0]);
			newEffectPiece(v, 'r');
		}
		else if (e == STORY.events.DANNMAKU_HIT) {
			v.die();
			v.data.vx *= 0.1;
			v.data.vy *= 0.1;

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
			text: {
				text: 'STAGE 1',
				res: 'ascii_yellow',
				map: RES.fontmap,
			}
		});
		STORY.timeout(function(d) {
			d.text = SPRITE.newObj('Basic', {
				text: {
					text: '~ Mystic Flier ~',
					font: '15px Arial',
					color: 'Silver',
				},
				sy: UTIL.getGamePosY(0.5) + 40,
			});
			d.text.drawBasic = function(d) {
				if (!this.is_dying)
					d.y = d.sy - ease_out(d.ph)*10;
				return true;
			};
		}, 400, d);
	},
	quit: function(d) {
		killObj(d.title, d.text);
	}
};
ieach([
	{ duration:1000, },
	{ init:newSec1, para:['s0A2', 5], duration:2000, },
	{ init:newSec1, para:['s0A1', 8], duration:2000, },
	{ init:newSec2, para:[0.4, 10], duration:5000, },
	{ init:newSec3, para:[1000, 5], duration:5000, },
	{ init:newSec3, para:[500, 10], duration:5000, },
	{ init:newSec4, para:[], duration:5000 },
	{ init:newSec1, para:['s0A2', 8, [[-40, 0], [0, 0]]], duration:2000 },
	{ init:newSec1, para:['s0A1', 8, [[+40, 0], [0, 0]]], duration:10000, next:'bossA' },
	{ init:newSec3, para:[1000, 20], duration:20000, name:'secH' },
	{ init:newSec1, para:['s0A2', 8, [[-40, 0], [0, 0]]], duration:2000 },
	{ init:newSec1, para:['s0A1', 8, [[+40, 0], [0, 0]]], duration:2000 },
	{ init:newSec1, para:['s0A2', 8, [[-40, 0], [0, 0]]], duration:10000, next:'diagA' },
], function(i, para, tl) {
	var c = para.name || 'sec'+i, n = para.next || 'sec'+(i+1);
	tl[c] = {
		run: UTIL.newTimeRunner(para.duration, n),
		init: function(d) {
			para.init && para.init.apply(null, para.para);
		},
	};
}, tl);
ieach([
	{ text:'x0aabbcc', face:'f0a', float:'l', name:'diagA' },
	{ text:'x0aabbcc', face:'f0b fs', float:'l', next:'bossB', },
	{ text:'y0aabbcc', face:'f3a', float:'r', },
	{ text:'x0aabbcc', face:'f0c fs', float:'l', },
	{ text:'y0aabbcc', face:'f3a fs', float:'r', name:'diagB', },
	{ text:'x0aabbcc', face:'f0b', float:'l', },
	{ text:'y0aabbcc', face:'f3a', float:'r', },
	{ text:'x0aabbcc', face:'f0c', float:'l', },
	{ text:'y0aabbcc', face:'f3a', float:'r', next:'bossC', ended:true },
], function(i, para, tl) {
	var c = para.name || 'diag'+i, n = para.next || 'diag'+(i+1);
	tl[c] = {
		init: function(d) {
			d.age = 0;
			d.disable_fire = true;
			d.text = UTIL.getOneObj('Basic', 'diag') || SPRITE.newObj('Basic', { id: 'diag', });
			d.text.data.text = para.text;

			var bg = $i('.diag'),
				fl = $i('.fl', bg),
				fr = $i('.fr', bg),
				text = $i('.text', bg),
				face = para.float == 'l' ? fl : fr;
			bg.object = d.text;
			text.innerHTML = para.text;
			$i('.face', face).className = 'face '+para.face;

			d.text.anim(50, function(d) {
				if (this.data.ph <= 1) {
					bg.style.opacity = this.data.ph;
					var dx = (1 - this.data.ph) * -64;
					fl.style.marginLeft = dx+'px';
					fr.style.marginRight = dx+'px';
				}
				ieach([fl, fr], function(i, f) {
					var dp = f == face ? 0.1 : -0.1;
					f.style.opacity = limit_between(f.style.opacity-0+dp, 0.3, 1);
					var df = 1 - f.style.opacity,
						dx = df * (f == fl ? -20 : 20),
						dy = df * 10;
					$prefixStyle(f.style, 'Transform', 'translate('+dx+'px,'+dy+'px)');
				});
			}, null, 'face');
		},
		run: function(dt, d) {
			if (d.pass || GAME.keyste.ctrlKey || (d.age+=dt) > 20000)
				return n;
		},
		quit: function(d, n) {
			if (para.ended)
				d.text.die();
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
ieach([
	{
		pathnodes: [
			{ fx:0.50, fy:0.00, v:0.2, },
			{ t:1000, fx:0.83, fy:0.28, v:0.2, },
			{ t:1000, fn:newBossDanns1, args:['b'], },
			{ t: 500, fx:0.50, fy:0.10, v:0.2, },
			{ t:2000, fn:newBossDanns2, },
			{ t: 500, fx:0.17, fy:0.28, v:0.2, },
			{ t: 500, fn:newBossDanns1, args:['g'], },
			{ t:1000, fn:newBossDanns1, args:['y'], },
			{ t: 500, fx:0.50, fy:0.10, v:0.2, },
			{ t:2000, fn:newBossDanns3, args:['brgyY'], },
			{ t: 500, fx:0.83, fy:0.28, v:0.2, },
			{ t: 500, fn:newBossDanns1, args:['b'], },
			{ t:1000, fn:newBossDanns1, args:['r'], },
			{ t: 500, fx:0.50, fy:0.10, v:0.2, },
			{ t:2000, fn:newBossDanns2, },
			{ t: 500, fx:0.17, fy:0.28, v:0.2, },
			{ t: 500, fn:newBossDanns1, args:['g'], },
			{ t:1000, fn:newBossDanns1, args:['y'], },
			{ t: 500, fx:0.50, fy:0.10, v:0.2, },
			{ t:2000, fn:newBossDanns3, args:['brgyY'], },
			{ t: 500, fx:0.83, fy:0.28, v:0.2, },
			{ t: 500, fn:newBossDanns1, args:['b'], },
		],
		duration: 25000,
		name: 'bossA',
	},
	{
		pathnodes: [
			{ v:0.3 },
			{ fx:0.5, fy:0.0 },
			{ fy:-1, v:0.3 },
		],
		next: 'secH',
		duration: 500,
		no_countdown: true,
		invinc: true,
	},
	{
		pathnodes: [
			{ fx:0.00, fy:0.00, v:0.2 },
			{ fx:0.10, fy:0.10 },
			{ fx:0.50, fy:0.18 },
		],
		duration: 2000,
		invinc: true,
		no_countdown: true,
		no_lifebar: true,
		disable_fire: true,
		name: 'bossB',
		next: 'diagB',
	},
	{
		pathnodes: [
			{ t:2000, v:0.2 },
			{ t: 500, fx:0.50, fy:0.10, v:0.2, fn:newBossDanns4, args:[5], },
			{ t: 200, fx:0.40, fy:0.30, v:0.1, },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 400, },
			{ t:1000, fx:0.60, fy:0.20, fn:newBossDanns4, args:[5], },
			{ t: 500, fx:0.60, fy:0.30, },
			{ t:1500, fn:newBossDanns3, args:['BBBBBBB'], },
			{ t: 500, fx:0.50, fy:0.10, },
			{ t: 100, fn:newBossDanns6, },
			{ t: 500, fn:newBossDanns1, args:['b', 3, 30, 0.02], },
			{ t: 200, fx:0.60, fy:0.30, },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 400, },
			{ t: 500, fx:0.50, fy:0.30, },
			{ t: 100, fn:newBossDanns6, },
			{ t: 500, fn:newBossDanns1, args:['b', 3, 30, 0.02], },
			{ t: 200, fx:0.60, fy:0.20, },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 400, },
			{ t:1000, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
			{ t: 500, fx:0.20, fy:0.20, },
			{ t:1500, fn:newBossDanns3, args:['BBBBBBB'], },
			{ t: 200, fx:0.40, fy:0.10, },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 200, fn:newBossDanns5, args:['g', 1], },
			{ t: 400, },
		],
		duration: 35000,
		name: 'bossC',
	},
	{
		pathnodes: [
			{ t:2000, v:0.1 },
			{ t: 500, fx:0.50, fy:0.20, },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t: 200, fx:0.30, fy:0.10, v:0.05, },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t: 200, fx:0.40, fy:0.30, },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t: 200, fx:0.60, fy:0.20, },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
			{ t:1000, fn:newBossDanns5, args:['b', -1], },
			{ t:1000, fn:newBossDanns5, args:['c',  1], },
		],
		duration: 25000,
		scname: 'yeque',
		background: newBossBackground,
	},
	{
		pathnodes: [
			{ v:0.05 },
			{ t: 500, fx:0.50, fy:0.10, },
			{ t: 100, fn:newBossDanns6, args:['g', 8, 7, 0.1], },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fx:0.70, fy:0.20, },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 500, },
			{ t: 500, fx:0.50, fy:0.10, },
			{ t: 100, fn:newBossDanns6, args:['y', 3, 15, 0.3, 0.05, 0.1], },
			{ t: 100, fn:newBossDanns6, args:['y', 3, 20, 0.4, 0.08, 0.1], },
			{ t: 500, },
			{ t: 200, fx:0.70, fy:0.20, },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 500, fx:0.50, fy:0.10, },
			{ t: 100, fn:newBossDanns6, args:['y', 3, 15, 0.3, 0.05, 0.1], },
			{ t: 100, fn:newBossDanns6, args:['y', 3, 20, 0.4, 0.08, 0.1], },
			{ t: 500, },
			{ t: 500, fx:0.60, fy:0.30, },
			{ t:1500, fn:newBossDanns3, args:['ggg'], },
			{ t: 500, fx:0.70, fy:0.20, },
			{ t: 100, fn:newBossDanns6, args:['g', 8, 7, 0.1], },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 200, fn:newBossDanns7, },
			{ t: 500, fx:0.60, fy:0.30, },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
			{ t: 200, fn:newBossDanns5, args:['g', -1], },
		],
		duration: 30000,
	},
	{
		pathnodes: [
			{ v:0.05 },
			{ t: NaN, fx:0.50, fy:0.20, },
			{ t:1000, fn:newBossDanns8, args:['b'], },
			{ t:1000, fn:newBossDanns8, args:['g'], },
			{ t:1000, fn:newBossDanns8, args:['r'], },
			{ t: 200, fx:0.70, fy:0.30, },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: NaN, fx:0.60, fy:0.20, },
			{ t:1000, fn:newBossDanns8, args:['b'], },
			{ t:1000, fn:newBossDanns8, args:['g'], },
			{ t:1000, fn:newBossDanns8, args:['r'], },
			{ t: 200, fx:0.30, fy:0.20, },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: NaN, fx:0.50, fy:0.30, },
			{ t:1000, fn:newBossDanns8, args:['b'], },
			{ t:1000, fn:newBossDanns8, args:['g'], },
			{ t:1000, fn:newBossDanns8, args:['r'], },
			{ t: 200, fx:0.60, fy:0.10, },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: NaN, fx:0.60, fy:0.20, },
			{ t:1000, fn:newBossDanns8, args:['b'], },
			{ t:1000, fn:newBossDanns8, args:['g'], },
			{ t:1000, fn:newBossDanns8, args:['r'], },
			{ t: 200, fx:0.50, fy:0.10, },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: 300, fn:newBossDanns9, args:[ 1], },
			{ t: 300, fn:newBossDanns9, args:[-1], },
			{ t: NaN, fx:0.60, fy:0.10, },
			{ t:1000, fn:newBossDanns8, args:['b'], },
			{ t:1000, fn:newBossDanns8, args:['g'], },
			{ t:1000, fn:newBossDanns8, args:['r'], },
		],
		duration: 25000,
		scname: 'jingjiexian',
		background: newBossBackground,
		next: 'end',
	},
], function(i, para, tl) {
	var c = para.name || 'boss'+i, n = para.next || 'boss'+(i+1);
	tl[c] = {
		init: function(d) {
			killCls('Dannmaku');
			d.age = 0;
			d.disable_fire = para.disable_fire;
			d.duration = para.duration || Inf;
			d.life = para.life || Inf;

			d.boss = UTIL.getOneObj('Enemy', 'boss') || newBoss();
			if (para.pathnodes)
				UTIL.addPathAnim(d.boss, para.pathnodes);
			if (!para.no_lifebar &&
					(!d.boss.lifebar || d.boss.lifebar.is_dying || d.boss.lifebar.finished))
				d.boss.lifebar = newLifeBar(d.boss);
			else if (para.no_lifebar &&
					(d.boss.lifebar && !d.boss.lifebar.is_dying && !d.boss.lifebar.finished))
				d.boss.lifebar.die();

			if (para.duration > 0 && !para.no_countdown)
				d.countdown = newCountDown(d);
			if (para.scname)
				d.scname = newSCName(para.scname);
			if (para.background)
				d.background = para.background(d.boss);
		},
		quit: function(d) {
			killObj(d.countdown, d.scname, d.background);
		},
		run: function(dt, d) {
			d.age += dt;
			if (para.invinc)
				d.boss.data.damage = 0;
			if (d.age > d.duration || d.boss.data.damage >= d.life || d.pass) {
				d.boss.data.damage = para.life || 0;
				return n;
			}
		},
		on: function(e, v, d) {
			if (e == STORY.events.ENEMY_KILL) {
				d.pass = true;
				SPRITE.eachObj(function(i, obj) {
					STORY.on(STORY.events.DANNMAKU_HIT, obj);
				}, 'Dannmaku');
			}
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
