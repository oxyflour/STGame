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
function str_endwith(s, e) {
	return s.indexOf(e, s.length - e.length) !== -1;
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
		r = fn.call(ls, i, ls[i], d);
	}
	return r === undefined ? d : r;
}
function keach(ls, fn, d) {
	for (var i in ls) {
		var r = fn.call(ls, i, ls[i], d);
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
function decrease_to_zero(v, d) {
	return (v -= d) > 0 ? v : 0;
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
function $new(t, d) {
	return keach(d, function(k, v, e) {
		if (same_type(e[k], ''))
			e[k] = v;
		else
			e.setAttribute(k, v);
	}, document.createElement(t));
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
function $readdClass(e, c) {
	e.classList.remove(c);
	// MAGIC!
	e.offsetWidth = e.offsetWidth;
	e.classList.add(c);
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
		//_t[unused.length ? unused.pop() : _t.length] = t;
		_t.push(t);
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
				var st = t.v.split(' '),
					dx = st[0] ? parseFloat(st[0]) : 0,
					dy = st[1] ? parseFloat(st[1]) : 0;
				dc.drawImage(sc.s, sc.x + dx, sc.y + dy, sc.w, sc.h,
					0, 0, sc.w, sc.h);
			}
			else if (t.k == 'scale') {
				var st = t.v.split(' '),
					sx = st[0] ? parseFloat(st[0]) : 0,
					sy = st[1] ? parseFloat(st[1]) : sx;
				dc.drawImage(sc.s, sc.x, sc.y, sc.w, sc.h,
					0, 0, sc.w * sx, sc.h * sy);
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
			else if (v.tagName == 'AUDIO') {
				v.replayTime = parseFloat($attr(v, 'replay-time') || '0');
				if ((v.replayQueueLength = parseFloat($attr(v, 'replay-queue'))) > 0) {
					var queue = [v],
						index = 0;;
					array(v.replayQueueLength, function() {
						var c = v.cloneNode();
						queue.push(c);
					});
					v.queue = queue;
					v.replay = function() {
						index = (index + 1) % queue.length;
						var a = queue[index];
						a.volume = v.volume;
						a.currentTime = v.replayTime;
						a.play();
					};
				}
				else {
					v.replay = function() {
						v.currentTime = v.replayTime;
						v.play();
					}
				}
				d[v.id] = v;
			}
			else if (v.tagName == 'IMG') {
				d[v.id] = v;
			}
			else if (v.tagName == 'SCRIPT' && $attr(v, 'type') == 'text/html') {
				d[v.id] = v.innerHTML;
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
			else if (v.tagName == 'AUDIO')
				d.push(v.complete ? 1 : 0);
		}, []);
		_t.process = sum(ls) / ls.length;
		if (_t.process == 1) {
			loaded();
			fn && fn();
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
	function loop_fn(i, ls, fn) {
		return loop(ls, fn);
	}
	function draw() {
		if (!(this.finished = this.obj.finished))
			this.obj.draw();
	}
	var _t = {
		cls: newGroupAnim(),
		layers: newGroupAnim(),
		anim: newAnimateList(),
		proto: {},
	};
	_t.newCls = function(c, f, fn) {
		var from = f.substring ? new _t.proto[f].init() : {},
			proto = f.call ? f(from) : fn(from);
		proto = fill({ clsName:c }, proto, from);
		return _t.proto[c] = proto.init.prototype = proto;
	};
	_t.newObj = function(c, d) {
		var obj = new _t.proto[c].init(d);
		_t.cls.add(obj.clsName, obj);
		_t.layers.add(obj.layer, { obj:obj, run:draw });
		return obj;
	};
	_t.eachObj = function(fn, c) {
		return c ?
			loop(_t.cls.groups[c], fn) :
			ieach(_t.cls, loop_fn, fn);
	};
	_t.clrObj = function(c) {
		_t.eachObj(function(i, v) {
			v.finished = true;
		}, c);
	};
	return _t;
})();

var STORY = (function() {
	var _t = {
		state: newStateMachine({}),
		timer: newAnimateList(),
		hook: {},
	};
	_t.events = dictflip([
		'STORY_LOAD',
		'GAME_INPUT',
		'OBJECT_OUT',
		'PLAYER_HIT',
		'PLAYER_DYING',
		'PLAYER_AUTOCOLLECT',
		'PLAYER_GRAZE',
		'PLAYER_FIRE',
		'PLAYER_BOMB',
		'PLAYER_BOMBEND',
		'DROP_COLLECTED',
		'BULLET_HIT',
		'SHIELD_HIT',
		'DANNMAKU_HIT',
		'ENEMY_KILL'
	]);
	_t.load = function(stage, hook) {
		_t.state = newStateMachine(stage);
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
		_t.timer.add(newTicker(t, function(d) {
			this.finished = _t.state.s != s || f(d, --n) || n <= 0;
		}, d));
	}
	_t.run = function(dt) {
		if (_t.hook.before_run)
			_t.hook.before_run(dt, _t.state.d, _t.state.s);
		_t.state.run(dt);
		if (_t.hook.after_run)
			_t.hook.after_run(dt, _t.state.d, _t.state.s);

		_t.timer.run(dt);
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
		'LOADING',
		'TITLE',
		'MENU',
		'SELECT',
		'SELECT_DIFF',
		'SELECT_CHAR',
		'SELECT_BOMB',
		'RUNNING',
		'PAUSE',
		'OVER',
		'ENDED',
	]);
	_t.rect = {
		l: 0,
		t: 0,
		r: DC.canvas.width,
		b: DC.canvas.height
	};
	_t.reset = function() {
		SPRITE.clrObj();
		SPRITE.anim = newAnimateList();
		STORY.timer = newAnimateList();
	}
	_t.load = function(stage) {
		if (STORY.state.set)
			STORY.state.set('quit');
		STORY.load(stage, stage.hook);
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
		SPRITE.anim.run(dt);
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
	getOneAlive: function(c, k, v) {
		return SPRITE.eachObj(function(i, obj) {
			if (obj.is_dying)
				return;
			if (!k ||
				(v !== undefined && obj.data[k] == v) ||
				(v === undefined && obj.data[k]))
				return obj;
		}, c);
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
		// only one frame ?
		if (fs.push && fs.length == 1) {
			v.data.frame = fs[0];
			v.anim(0, 0, 0, 'frame');
		}
		else v.anim(t, function(d) {
			if (d.callback)
				d.frames = d.callback(v);
			if (d.frames) {
				var f = d.frames[d.index];
				d.index = (f && f.next >= 0) ? f.next :
					(d.index + 1) % d.frames.length;
				v.data.frame = d.frames[d.index];
			}
		}, {
			callback: fs.call && fs,
			frames: fs.length >= 0 ? fs : [fs],
			index: 0,
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

var STATICS = {
};

(function() {
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
		if (this.state != GAME.state) {
			keach(GAME.states, function(k, v, body) {
				var cls = 'game-' + k.toLowerCase().replace(/_/, '-');
				GAME.state == v ? body.classList.add(cls) : body.classList.remove(cls);
			}, $i('body'));
			this.state = GAME.state;
		}
	}, [
		['ui-bind', function(e) {
			return Function('val', $attr(e, 'ui-bind-exec') || (($attr(e, 'ui-bind-attr') || 'this.innerHTML')+'=val'));
		}],
		['ui-show', function(e) {
			return function(v) {
				v ? this.classList.remove('hidden') : this.classList.add('hidden');
				this.style.zIndex = v ? 0 : -99;
			};
		}],
		['ui-focus', function(e) {
			return function(v) {
				var _t = this;
				if (v) setTimeout(function() {
					if (_t.tagName == 'FORM') {
						var ls = $('input', _t);
						var r = ieach(ls, function(i, e) {
							if (e.checked) return e;
						}, ls[0]);
						if (r) {
							r.focus();
							r.checked = true;
						}
					}
					else
						_t.focus();
				}, 5);
			};
		}],
	]);
	var counter = newCounter();
	setInterval(function() {
		var dt = GAME.tick = counter();
		if (dt > 100) dt = 100;
		gameTick.run(dt);
		uiTick.run(dt);
	}, 5);

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

			SPRITE.anim.add(t);
			t.f(t.d);
		}

		if (id) {
			var k = 'anim' + '_' + id;
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
		if (this.is_dying || that.is_dying)
			return;
		var d = this.data,
			e = that.data;
		if (that.clsName == SPRITE.proto.Drop.clsName && !that.is_dying && !that.is_creating) {
			if (circle_intersect(d, { x:e.x, y:e.y, r:10 }))
				STORY.on(STORY.events.DROP_COLLECTED, that);
			else if (circle_intersect(d, e))
				e.to = this;
		}
		else if (that.clsName == SPRITE.proto.Player.clsName) {
			if (circle_intersect(d, e))
				circles_hit(d, e)
		}
		else if (e.damage_pt) {
			var u = { x:d.x, y:d.y, r:d.h };
			if (!this.is_invinc && (that.is_line ? line_circle_intersect(e, u) : circle_intersect(e, u)))
				STORY.on(STORY.events.PLAYER_HIT, this);
			else if (!that.grazed && (that.is_line ? line_circle_intersect(e, d) : circle_intersect(e, d)))
				STORY.on(STORY.events.PLAYER_GRAZE, that.grazed = this);
		}
	},
	
	juesi: function() {
		this.is_juesi = this.conf.juesi_duration;
	},
	bomb: function() {
		this.is_bomb = this.conf.bomb_duration;
		this.is_invinc = 8000;
		if (this.is_juesi)
			this.is_juesi = 0;
	},
	runPlayer: function(dt, d) {
		var ks = GAME.keyste,
			cf = this.conf;

		this.is_invinc = this.is_invinc > 0 ? decrease_to_zero(this.is_invinc, dt) :
			this.is_creating || this.is_dying || this.is_bomb || this.is_juesi;
		this.is_slow = ks[cf.key_slow];

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
			this.is_firing = cf.fire_duration;
		}
		if (this.is_firing > 0)
			this.is_firing = decrease_to_zero(this.is_firing, dt);

		// BOMB!
		if (ks[cf.key_bomb] && !this.is_dying && !this.is_bomb)
			STORY.on(STORY.events.PLAYER_BOMB, this);
		if (this.is_bomb > 0)
			this.is_bomb = decrease_to_zero(this.is_bomb, dt);

		// JUESI!
		if (this.is_juesi > 0 && this.is_juesi <= dt)
			STORY.on(STORY.events.PLAYER_DYING, this);
		if (this.is_juesi > 0)
			this.is_juesi = decrease_to_zero(this.is_juesi, dt);
	},
	runBasic: function(dt, d) {
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
		var f = d.frame;
		f.w = f.sw * d.ph;
		f.h = f.sh * (2 - d.ph);
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

		frtick: 100,
	  	frames: function(v) {
			var fs = RES.frames.Player0;
			if (Math.abs(v.data.vx) > 0.1) {
				fs = v.data.vx < 0 ? RES.frames.PlayerL : RES.frames.PlayerR;
				if (this.frames != fs)
					this.index = 0;
			}
			else {
				if (this.frames === RES.frames.PlayerL || this.frames === RES.frames.PlayerR)
					this.index = this.frames.reset_index;
			}
			return fs;
		},
	},
	conf: {
		key_left: 37,
		key_up: 38,
		key_right: 39,
		key_down: 40,
		key_slow: 'shiftKey',
		key_fire: GAME.keychars.Z,
		key_bomb: GAME.keychars.X,
		speed_high: 0.24,
		speed_low: 0.12,
		fire_interval: 1000 / 12,
		fire_duration: 500,
		juesi_duration: 100,
		bomb_duration: 5000,
		collect_ylim: 0.3,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
		this.rect = { l:0, t:0, r:0, b:0 };
		this.is_invinc = 2000;
		if (d.conf)
			this.conf = fill(d.conf, proto.conf);
		if (this.conf.collect_ylim) this.anim(50, function(d) {
			if (d.y < UTIL.getGamePosY(this.conf.collect_ylim))
				STORY.on(STORY.events.PLAYER_AUTOCOLLECT, this);
		}, this.data);
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

	data0: {
		damage_pt: 1,
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
		damage_pt: 1,
		dh: 1/200,
		kh: 1/500,
		dx: 0,
		dy: (GAME.rect.b - GAME.rect.t)*0.2,
	},
	is_line: 1,
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
			d.damage += e.damage_pt || 1;
			if (that.clsName == SPRITE.proto.Bullet.clsName)
				STORY.on(STORY.events.BULLET_HIT, that);
			else if (that.clsName == SPRITE.proto.Shield.clsName)
				STORY.on(STORY.events.SHIELD_HIT, that);
			if (d.damage >= d.life)
				STORY.on(STORY.events.ENEMY_KILL, this);
			RES.se_damage00.replay();
		}
	},
	
	data0: {
		damage_pt: 1,
		dh: 1/100,
		kh: 1/100,
		r: 20,
		y: GAME.rect.t,
		life: 1,
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
	
	data0: {
		damage_pt: 1,
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
	drawBasic: function(d) {
		if (d.y < GAME.rect.t && d.frame_small) this.drawFrame({
			x: d.x,
			y: GAME.rect.t + 8,
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
		vy: -0.1,
	},
	init: function(d) {
		from.init.call(this, d = fill(d, proto.data0));
		this.anim(50, function(d) {
			var that = d.to;
			if (that && !that.finished && !that.is_dying) {
				redirect_object(d, that.data, d.keep ? 0.5 : sqrt_sum(d.vx, d.vy));
				d.to = d.keep ? d.to : undefined;
			}
			else {
				if (d.vy < 0.15)
					d.vy += 0.01;
				d.vx *= 0.9;
			}
		}, this.data);
	}
}
});

SPRITE.newCls('Bullet', 'Circle', function(from, proto) {
return proto =  {
	layer: 'L20',
	data0: {
		damage_pt: 1,
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
	data0: {
		damage_pt: 1,
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
function newPlayer(ext) {
	var p = SPRITE.newObj('Player', ext);
	p.pslow = newPSlow(p);
	p.anim(1000/20, function() {
		if (this.is_firing && this.is_fire_enable)
			RES.se_plst00.replay();
	})
	return p;
}
function newOnmyou(player, frames, pos1, pos2) {
	var obj = SPRITE.newObj('Basic', {
		parent: player,
		x: player.data.x,
		y: player.data.y,
		frames: RES.frames[frames],
	});
	obj.runBasic = function(dt, d) {
		var p = d.parent;
			v = p.is_slow ? 1 : -1;
		d.pos = limit_between((d.pos || 0) + 0.005*v*dt, 0, 1);
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
function newBulletA(x, y, vx, vy) {
	return SPRITE.newObj('Bullet', {
		x: x,
		y: y,
		vx: vx,
		vy: vy,
		frames: RES.frames.Bullet0,
		opacity: 0.7,
	});
}
function newBulletB(to, x, y, vx, vy) {
	var obj = SPRITE.newObj('Bullet', {
		x: x,
		y: y,
		vx: vx,
		vy: vy,
		to: to,
		frtick: 1000/36,
		frames: RES.frames.Bullet1,
		opacity: 0.7,
	})
	obj.anim(50, function(d) {
		var that = d.to,
			e = that && that.data;
		if (that && !that.finished && e.damage_pt && !this.is_dying)
			redirect_object(d, e, sqrt_sum(d.vx, d.vy), 0.4);
	}, obj.data);
	return obj;
}
function newBulletOne(from, to, rt) {
	var v = 0.7,
		t =  rt * PI / 180,
		vx = v*Math.sin(t),
		vy = -v*Math.cos(t);
	if (to !== null) {
		if (!from.onmyous) from.onmyous = {
			left: newOnmyou(from, 'OnmyouR', { x:-25, y:0 }, { x:-8, y:-28 }),
			right: newOnmyou(from, 'Onmyou', { x:+25, y:0 }, { x:+8, y:-28 }),
		};
		var onmyou = rt > 0 ? from.onmyous.right : from.onmyous.left;
		return newBulletB(to, onmyou.data.x, onmyou.data.y, vx*0.6, vy*0.6);
	}
	else {
		var dx = 0;
		if (rt > 0) dx = 3;
		if (rt < 0) dx = -3;
		return newBulletA(from.data.x + dx, from.data.y, vx, vy);
	}
}
function newBullet(from, level) {
	var to = UTIL.getNearestAlive(from, 'Enemy'),
		i = from.bullet_index = ((from.bullet_index || 0) + 1) % 6;
	if (level < 8) {
		newBulletOne(from, null, 0);
	}
	else if (level <  16) {
		newBulletOne(from, null, 0);
		if (i == 0) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
	}
	else if (level <  32) {
		newBulletOne(from, null, 2);
		newBulletOne(from, null, -2);
		if (i == 0) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
	}
	else if (level <  48) {
		newBulletOne(from, null, 0);
		newBulletOne(from, null, 6);
		newBulletOne(from, null, -6);
		if (i == 0) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
	}
	else if (level <  60) {
		newBulletOne(from, null, 0);
		newBulletOne(from, null, 6);
		newBulletOne(from, null, -6);
		if (i == 0) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
		else if (i == 3) {
			newBulletOne(from, to, 30);
			newBulletOne(from, to, -30);
		}
	}
	else if (level <  80) {
		newBulletOne(from, null, 0);
		newBulletOne(from, null, 6);
		newBulletOne(from, null, -6);
		if (i == 0) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
		else if (i == 3) {
			newBulletOne(from, to, 30);
			newBulletOne(from, to, -30);
		}
	}
	else if (level < 100) {
		newBulletOne(from, null, 0);
		newBulletOne(from, null, 6);
		newBulletOne(from, null, -6);
		if (i == 0) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
		else if (i == 2) {
			newBulletOne(from, to, 30);
			newBulletOne(from, to, -30);
		}
		else if (i == 4) {
			newBulletOne(from, to, 45);
			newBulletOne(from, to, -45);
		}
	}
	else if (level < 128) {
		newBulletOne(from, null, 0);
		newBulletOne(from, null, 6);
		newBulletOne(from, null, -6);
		if (i == 0 || i == 3) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
		else if (i == 1 || i == 4) {
			newBulletOne(from, to, 30);
			newBulletOne(from, to, -30);
		}
		else if (i == 2 || i == 5) {
			newBulletOne(from, to, 45);
			newBulletOne(from, to, -45);
		}
	}
	else {
		newBulletOne(from, null, 2);
		newBulletOne(from, null, -2);
		newBulletOne(from, null, 6);
		newBulletOne(from, null, -6);
		if (i == 0 || i == 3) {
			newBulletOne(from, to, 15);
			newBulletOne(from, to, -15);
		}
		else if (i == 1 || i == 4) {
			newBulletOne(from, to, 30);
			newBulletOne(from, to, -30);
		}
		else if (i == 2 || i == 5) {
			newBulletOne(from, to, 45);
			newBulletOne(from, to, -45);
		}
	}
}
function newBomb(player) {
	var bg = SPRITE.newObj('Shield', {
		parent: player,
		elem: $e('bg_bomb'),
		duration: player.conf.bomb_duration,
	});
	bg.draw = return_nothing;
	bg.data.elem.object = bg;
	bg.drawCircle = function(d) {
		var p = d.parent;
		d.x = p.data.x;
		d.y = p.data.y;
		d.r = this.is_dying ? 400 - d.ph*300 : d.ph * 100;
		return true;
	};
	bg.anim(50, function(d) {
		if (d.elem.object == bg) {
			var s = d.elem.style;
			s.opacity = limit_between(parseFloat(s.opacity)+d.dh*50, 0, 1);
		}
	}, bg.data);
	bg.anim(800, function(d) {
		if (!bg.is_dying)
			newShield(bg);
	});


	if (bg.scelem = $i('.sc-bomb')) {
		$readdClass(bg.scelem.parentNode, 'active');
		$readdClass(bg.scelem, 'active');
		$i('.text', bg.scelem.parentNode).innerHTML = RES.st_bomb_sc;
	}
	SPRITE.anim.add(newTicker(100, function() {
		if (bg.finished || bg.is_dying) {
			if (bg.scelem) {
				bg.scelem.classList.remove('active');
				bg.scelem.parentNode.classList.remove('active');
			}
			DC.setTransform(1, 0, 0, 1, 0, 0);
			this.finished = true;
		}
		else {
			DC.setTransform(1, 0, 0, 1, random(-3, 3), random(-3, 3));
		}
	}));

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
function newShield(bomb) {
	var p = bomb.data.parent;
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
		parent: bomb,
		damage_pt: 10,
	});
	sh.drawCircle = function(d) {
		var ph = ease_out(d.ph);
		d.r = 30 + ph * 20;
		d.scale = (10 + ph * 40) / 30;
		return true;
	};
	sh.anim(50, function(d) {
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
		if (this.is_dying) {
			newEffect(this, RES.frames.EffPlayer, 2);
			this.finished = true;
		}
	}, sh.data);
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
function newDrop(type, x, y, extra) {
	var power_pt = 0,
		point_pt = 0;
	if (type == 0)
		power_pt = 1;
	else if (type == 2)
		power_pt = 8;
	else if (type == 4)
		power_pt = 128;
	if (type == 1)
		point_pt = randin([10, 20]);
	return SPRITE.newObj('Drop', fill(extra, {
		x: x || UTIL.getGamePosX(0.5),
		y: y || GAME.rect.t,
		type: type,
		power_pt: power_pt,
		point_pt: point_pt,
		frames: RES.frames.Drops[type],
		frame_small: RES.frames.Drops[type+8],
	}));
}

function newSec1(pth, count, offset, interval, speed, rand, life) {
	STORY.timeout(function (d, n) {
		ieach(offset || [[0, 0]], function(i, v) {
			var obj = SPRITE.newObj('Enemy', {
				life: life || 1,
				frames: RES.frames.Enemy00,
				pathnodes: UTIL.pathOffset(RES.path[pth], v[0], v[1]),
			});
			STORY.timeout(function() {
				obj.anim(interval || 1500, function() {
					newDanns1(obj, speed, rand);
				});
			}, random(1500));
		});
	}, 250, null, count);
}
function newSec2(ylim, count, speed) {
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
					newDanns1(this, speed);
			}, obj.data);
		});
	}, 350, null, count);
}
function newSec3(tick, count, layers, life) {
	STORY.timeout(function (d, n) {
		var enm = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy01,
			life: life || 1,
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
				STORY.timeout(newDanns2, 300, this, layers || 2);
				UTIL.addFrameAnim(enm, RES.frames.Enemy11);
			}
			else if (d.age > 2000) {
				d.vy += d.dvy;
				d.vx = d.vx0;
			}
		}, enm.data);
	}, tick, null, count);
}
function newSec4(fn, life) {
	STORY.timeout(function (d, n) {
		var pth = RES.path[randin(['s0A1', 's0A2'])],
			ps = UTIL.pathOffset(pth, random(-200, 200), random(0, 200));
			px = ps[0].x;
		ps[0].x = ps[0].y = undefined;
		var obj = SPRITE.newObj('Enemy', {
			frames: RES.frames.Enemy00,
			life: life || 1,
			x: px,
			y: GAME.rect.t,
			pathnodes: ps,
		});
		STORY.timeout(function() {
			obj.anim(1500, fn || newDanns1, obj);
		}, random(1500));
	}, 200, null, 20);
}
function newSecEx1(rad) {
	var obj = SPRITE.newObj('Enemy', {
		frames: RES.frames.EnemyX,
		life: 30,
		x: UTIL.getGamePosX(random(0.5, rad > 0 ? 1 : 0)),
		y: 0,
		vy: 0.1,
		vx: 0,
		rt: 0,
		ri: 0,
		duration: 10000,
	});
	obj.anim(60, function(d) {
		if (d.age > 500 && !this.is_dying)
			newDannsEx1(this, Math.sin(d.rt += rad || 0.2), d.ri++ % 2 ? 0.2 : 0.15);
		if (d.age > 1000)
			d.vy = 0;
	}, obj.data);
}
function newSecEx2(fx, fy, vx, vy) {
	var obj = SPRITE.newObj('Enemy', {
		frames: RES.frames.EnemyX,
		life: 30,
		x: UTIL.getGamePosX(fx),
		y: UTIL.getGamePosX(fy),
		vx: vx,
		vy: vy,
		idx: 0,
	});
	obj.anim(60, function(d) {
		d.vy -= 0.004;
		newDannsEx2(this, vx < 0 ? 0.2 : -0.2);
	}, obj.data);
}
function newSecList() {
	ieach(arguments, function(i, v) {
		STORY.timeout(function() {
			v[0].apply(null, v[1]);
		}, v[2] || 100);
	})
}

function newDanns1(from, speed, rand) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) {
		newDannmaku(from, to, 0, rand ? random(rand) : 0, speed || 0.2, 0, {
			r: 3,
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
			if (d.age < 800) {
				d.vx *= 0.85;
				d.vy *= 0.85;
			}
			else
				return true;
		}, obj.data);
	})
}
function newDannsEx1(from, rt, v) {
	var to = UTIL.getNearestAlive(from, 'Player');
	return newDannmaku(from, to, 0, rt, v, 0, {
		r: 3,
		color: 'r',
		frames: RES.frames.TamaSmallX[1],
	})
}
function newDannsEx2(from, vt, f) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var dmk = newDannmaku(from, to, 0, 0, 0.2, 0, {
		sx: from.data.x,
		sy: from.data.y,
		color: 'w',
		frames: RES.frames.TamaB,
		vr: 0,
		vt: vt,
	});
	dmk.anim(100, function(d) {
		if (d.age < 500) {
			d.vx *= 0.9;
			d.vy *= 0.9;
		}
		else if (d.age < 2000) {
			var r = sqrt_sum(d.x - d.sx, d.y - d.sy),
				cos = (d.x - d.sx) / r,
				sin = (d.y - d.sy) / r;
			d.vx = d.vr * cos + d.vt * sin;
			d.vy = d.vr * sin - d.vt * cos;
		}
		else if (d.age < 4000) {
			to && redirect_object(d, to.data, Math.abs(vt), f || 0.2);
		}
		else {
			return true;
		}
	}, dmk.data);
	return dmk;
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
function newLaser(from, x, y, dx, dy, width) {
	var dot = SPRITE.newObj('Dannmaku', {
		r: 10,
		x: x,
		y: y,
		vx: 0,
		vy: 0,
		frame: RES.frames.TamaFire[2],
		scale: 1.5,
		blend: 'lighter',
		duration: 5000,
	});
	var obj = SPRITE.newObj('Dannmaku', {
		r: 10,
		x: x,
		y: y,
		vx: 0,
		vy: 0,
		dx: dx,
		dy: dy,
		frame: RES.frames.LaserLong[6],
		blend: 'lighter',
		duration: 4500,
		dh: 1/3000,
		kh: 1/500,
		dot: dot,
	});
	obj.is_line = true;
	obj.mkRect = function(rt, d) {
		rt.l = Math.min(d.x0, d.x, d.x + d.dx);
		rt.t = Math.min(d.y0, d.y, d.y + d.dy);
		rt.r = Math.max(d.x0, d.x, d.x + d.dx);
		rt.b = Math.max(d.y0, d.y, d.y + d.dy);
	};
	obj.runCircle = function(dt, d) {
		d.damage_pt = this.is_creating || this.is_dying ? 0 : 1;
	};
	obj.drawCircle = function(d) {
		var f = d.frame,
			w = f.w * d.scale * (this.is_creating ? Math.max(d.ph*3-2, 0.1) : d.ph);
		DC.translate(d.x, d.y);
		DC.rotate(-Math.atan2(d.dx, d.dy));
		DC.drawImage(RES[f.res],
			f.sx, f.sy, f.sw, f.sh,
			-w/2, 0, w, f.h);
	};
	return obj;
}
function newLaser2(from, to) {
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
	return newLaser(from, px, py, dx, dy);
}

function newBoss() {
	var boss = SPRITE.newObj('Enemy', {
		r: 24,
		life: 400,
		frtick: 150,
		frames: function(v) {
			var fs = RES.frames.Boss,
				vx = Math.abs(v.data.vx);
			if (vx > 0.02 || vx < -0.02) {
				fs = v.data.vx > 0 ? RES.frames.BossL : RES.frames.BossR;
				if (this.frames != fs)
					this.index = 0;
				var max = vx > 0.1 ? fs.length - 2 : fs.length - 3;
				this.index = limit_between(this.index, 0, max);
			}
			else if (v.data.is_firing && !(v.data.is_firing = false)) {
				this.index = fs.reset_index;
			}
			return fs;
		},
		respawn: Inf,
		boss: 'Rumia',
	});
	boss.effects = array(3, function(i) {
		return newBossGadgets(boss);
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
	eff.drawEffects = eff.draw;
	eff.draw = return_nothing;
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
		if (d.parent.is_dying)
			len = 0;
		else {
			var f = (p.data.life - p.data.damage) / p.data.life
			if (this.is_creating)
				len = len * f * ease_out(d.ph);
			else
				len = len * f;
		}
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
function newCountDown(duration) {
	var countdown = SPRITE.newObj('Basic', {
		x: GAME.rect.r-20,
		y: GAME.rect.t+8,
		text: {
			res: 'num',
			map: RES.nummap,
			text: '',
		},
	});
	countdown.anim(100, function(d) {
		var t = Math.max(Math.floor((duration - d.age) / 1000), 0);
		this.data.text.res = (t<5 && 'num3') || (t<10 && 'num2') || (t<20 && 'num1') || 'num0';
		this.data.text.text = (t < 10 ? '0' : '') + t;
		if (this.data.tlast != t && (this.data.tlast = t) < 10)
			RES.se_timeout.play();
	}, countdown.data);
	return countdown;
}
function newBossBackground(boss) {
	var st = STORY.state.n;
	var obj = SPRITE.newObj('Basic', {
		x: 0,
		y: 0,
		elem: $e('bg_stg1_boss'),
	})
	obj.data.elem.object = obj;
	obj.anim(50, function(d) {
		d.elem.style.opacity = d.ph;
		d.elem.style.backgroundPosition = '0 '+(-d.age*0.1)+'px';
	}, obj.data)
	return obj;
}

function newBossDanns1NoSound(from, color, count, angular, dv) {
	from.data.is_firing = true;
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
function newBossDanns1(from) {
	newBossDanns1NoSound.apply(null, arguments);
	RES.se_power1.play()
}
function newBossDanns0(from) {
	var n = STORY.state.n,
		to = UTIL.getNearestAlive(from, 'Player'),
		fs = RES.frames.ta;
	STORY.timeout(function() {
		var r = random(-0.05, 0.05);
		if (!from.is_dying) range(1, 0.001, 1/50, function(f) {
			newDannmaku(from, to, 0, f*PI2+r, 0.15, 0, {
				r: 3,
				color: 'b',
				frames: RES.frames.TamaSmallX[5],
			});
		});
	}, 500, null, Inf);
}
function newBossDanns0A(from) {
	if (!from.is_dying) ieach([1350, -1350], function(i, x) {
		var obj = newLaser(from, from.data.x, from.data.y, x, 500);
		obj.data.r = 20;
		obj.data.scale = 2;
		obj.data.dh = 1/500;
		obj.data.duration = 3000;
		obj.data.dot.data.scale = 2;
		obj.data.dot.data.duration = 3500;
		obj.anim(20, function(d) {
			if (!this.is_creating && !this.is_dying)
				d.dx += d.dx > 0 ? -10: 10;
		}, obj.data);
		obj.anim(100, function() {
			if (this.data.ph > 0.8) {
				RES.se_lazer00.replay();
				return true;
			}
		})
	});
}
function newBossDanns2(from) {
	from.data.is_firing = true;
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
				r: 3,
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
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, 5);
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
				r: 3,
				color: para.color,
				frames: para.frames1,
			});
			para.frames2 && newDannmaku(from, to, 0, f*PI2+dt2, v2, 0, {
				r: 3,
				color: para.color,
				frames: para.frames2,
			});
		});
	}, 150, ds, ds.length);
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, colors.length);
}
function newBossDanns4(from, count, color) {
	var to = UTIL.getNearestAlive(from, 'Player');
	color = color || 'r';
	var frame = RES.frames.TamaA[('k r m b c g y ow').indexOf(color = color || 'r')];
	if (!from.is_dying) STORY.timeout(function(d, k) {
		c = count - k;
		array(10, function(j) {
			array(c, function(i) {
				var f = (i - (c-1) / 2)*0.015;
				newDannmaku(from, to, 0, f*PI2, 0.1+j*0.03, 0, {
					color: color,
					frames: frame,
				});
			});
		});
	}, 200, null, count);
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, 5);
}
function newBossDanns5(from, color, direction, count) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = RES.frames.TamaA[('k r m b c g y ow').indexOf(color = color || 'r')];
	var n = 15;
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var k = 1 - j/(n-1),
			f = direction > 0 ? k - 0.2 : 0.2 - k;
		array(count || 3, function(i) {
			var obj = newDannmaku(from, to, 0, f*0.3*PI2+i*0.04-k*0.01, 0.20+(i+0.2)*k*0.15, 0, {
				color: color,
				frames: frame,
			})
			obj.anim(50, function(d) {
				if (d.age < 600) {
					d.vx *= 0.9;
					d.vy *= 0.9;
				}
				else
					return true;
			}, obj.data);
		});
	}, 30, null, n);
	STORY.timeout(function() {
		RES.se_tan00.replay();
	}, 100, null, 5);
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
				r: 3,
				color: color,
				frames: frame,
			});
		});
	});
	STORY.timeout(function() {
		RES.se_tan01.replay();
	}, 100, null, 5);
}
function newBossDanns7(from) {
	var to = UTIL.getNearestAlive(from, 'Player');
	if (!from.is_dying) {
		var obj = newLaser2(from, to);
		obj.anim(100, function() {
			if (this.data.ph > 0.8) {
				RES.se_lazer00.replay();
				return true;
			}
		})
	}
}
function newBossDanns8(from, color, count, delay, dec, dv) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var frame = {
		'g': RES.frames.LongA[10],
		'r': RES.frames.LongA[2],
		'b': RES.frames.LongA[6],
	}[color || 'r'];
	if (!from.is_dying) array(count || 2, function(j) {
		var i = j % 2 ? -1 : 1;
		range(1, 0.001, 1/60, function(f) {
			var obj = newDannmaku(from, to, 0, f*PI2, 0.3+0.1*j, 0, {
				r: 3,
				color: color,
				frames: frame,
				sx: from.data.x,
				sy: from.data.y,
				dv: (dv || 0.002) - j*0.00015,
				vr: 0,
				vt: (i *= -1)*0.1 - j*0.002,
			});
			obj.space = { l:50, r:50, t:50, b:80, };
			obj.anim(80, function(d) {
				if (d.age < (delay || 1000)) {
					d.vx *= dec || 0.8;
					d.vy *= dec || 0.8;
				}
				else {
					d.vr += d.dv;
					d.vt *= 0.99;
					var r = sqrt_sum(d.x - d.sx, d.y - d.sy),
						cos = (d.x - d.sx) / r,
						sin = (d.y - d.sy) / r;
					d.vx = d.vr * cos + d.vt * sin;
					d.vy = d.vr * sin - d.vt * cos;
					if (r < 20)
						return true;
				}
			}, obj.data);
		})
	});
	RES.se_tan02.replay();
}
function newBossDanns9(from, direction, interval) {
	var to = UTIL.getNearestAlive(from, 'Player');
	var n = 30;
	var tick = interval || 30;
	if (!from.is_dying) STORY.timeout(function(d, j) {
		var k = 1 - j/(n-1),
			f = direction > 0 ? k - 0.2 : 0.2 - k;
		var obj = newDannmaku(from, to, 0, f*0.10*PI2, 0.1+k*0.2, 0, {
			color: 'b',
			frames: RES.frames.TamaA[6],
		});
		obj.anim(90, function(d) {
			if (d.age < 2000 + j*tick) {
				d.vx *= 0.90;
				d.vy *= 0.90;
			}
			else if (d.age < 4000) {
				var e = to && to.data || { x:UTIL.getGamePosX(0.5), y:UTIL.getGamePosY(0.9) };
				d.vx += (e.x - d.x) * 2e-4;
				d.vy += (e.y - d.y) * 2e-4;
			}
			else
				return true;
		}, obj.data);
	}, tick, null, n);
	STORY.timeout(function() {
		RES.se_tan00.replay();
	}, 80, null, 10);
}
function newBossDannsEx0(from) {
	var rt = 0;
	STORY.timeout(function() {
		rt += 0.1;
		var ext = { color:'k', frames:RES.frames.TamaB[0], };
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)+0,    random(0.1, 0.15), 0, extend({}, ext));
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)+PI/2, random(0.1, 0.15), 0, extend({}, ext));
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)-PI/2, random(0.1, 0.15), 0, extend({}, ext));
		newDannmaku(from, null, 0, rt+random(-0.1, 0.1)+PI,   random(0.1, 0.15), 0, extend({}, ext));
	}, 100, null, Inf);
}
function newBossDannsEx1(from) {
	var obj = SPRITE.newObj('Enemy', {
		frames: RES.frames.EnemyX,
		life: 10,
		x: randin([GAME.rect.l, GAME.rect.r]),
		y: UTIL.getGamePosY(random(0, 0.7)),
		vy: 0.2,
		vx: 0,
		keep: random(500, 1000),
		story: STORY.state.n,
	});
	obj.anim(300, function(d) {
		if (d.story !== STORY.state.n)
			return this.die() || true;
		if (!d.to || d.to.finished)
			d.to = UTIL.getNearestAlive(from, 'Player');
		if (d.to && !this.is_dying) {
			if (d.age > d.keep || sqrt_sum(d.x - d.to.data.x, d.y - d.to.data.y) < 20) {
				var ext = { color:'y', frames:RES.frames.TamaB[12], };
				newDannmaku(this, d.to, 0, 0,     random(0.05, 0.2), 0, extend({}, ext));
				newDannmaku(this, d.to, 0, PI/2,  random(0.05, 0.2), 0, extend({}, ext));
				newDannmaku(this, d.to, 0, -PI/2, random(0.05, 0.2), 0, extend({}, ext));
				newDannmaku(this, d.to, 0, PI,    random(0.05, 0.2), 0, extend({}, ext));
			}
			redirect_object(d, d.to.data, 0.15, 0.1);
		}
	}, obj.data);
}
function newBossDannsEx2(from, count, num, speed) {
	STORY.timeout(function(x, j) {
		var to = UTIL.getNearestAlive(from, 'Player');
		var i = 0;
		range(0.5001, -0.5, 1/(num || 10), function(f) {
			var ext = i++ % 2 == 0 ?
				{ color:'y', frames:RES.frames.TamaB[12], v:speed || 0.10, }:
				{ color:'r', frames:RES.frames.LongA[2],  v:0.20, dx:randin([35, 25, -25, -35]), redirect:true, };
			var obj = newDannmaku(from, to, 0, f*PI*0.5, ext.v, 0, ext);
			if (ext.redirect) obj.anim(100, function(d) {
				if (d.age < 1000) {
					d.vx *= 0.9;
					d.vy *= 0.9;
				}
				else if (d.age < 5000) {
					to && redirect_object(d, {
						x: to.data.x + d.dx,
						y: to.data.y,
					}, sqrt_sum(d.vx, d.vy)+0.01, 0.25);
				}
				else {
					return true;
				}
			}, obj.data);
		})
	}, 200, null, count || 25);
}
function newBossDannsEx3(from) {
	function newDmk() {
		var obj = SPRITE.newObj('Dannmaku', {
			r: 20,
			x: UTIL.getGamePosX(random(1)),
			y: GAME.rect.t,
			blend: 'lighter',
			opacity: 0.8,
			story: STORY.state.n,
			frame: randin(RES.frames.TamaMax),
			dir: randin([1, -1]),
		});
		obj.anim(20, function(d) {
			if (d.story !== STORY.state.n)
				return this.die() || true;
			if (!d.to || d.to.finished)
				d.to = UTIL.getNearestAlive(this, 'Player');
			if (d.to) {
				var to = d.to.data,
					dx = d.x - to.x,
					dy = d.y - to.y,
					r = sqrt_sum(dx, dy);
				d.vx -= (1/30 - 1/r)*dx/r*2 + d.dir*dy/r*random(0.06);
				d.vy -= (1/30 - 1/r)*dy/r*2 - d.dir*dx/r*random(0.06);
				d.vx *= 0.8;
				d.vy *= 0.8;
			}
		}, obj.data);
		return obj;
	}
	if (!from.dmks_ex3)
		from.dmks_ex3 = [0, 0, 0, 0, 0];
	STORY.timeout(function() {
		ieach(from.dmks_ex3, function(i, v) {
			if (!v || v.finished)
				this[i] = newDmk();
		});
	}, 200, null, Inf);
}
function newBossDannsEx4(from) {
	STORY.timeout(function(d, j) {
		if (!from.is_dying)
			newDannsEx2(from, [-0.24, -0.08, 0.08, 0.24][j % 4], [0.3, 0.2][j % 2]);
		else
			return true;
	}, 50, null, 100);
}

function newStg2Sec1(interval, count) {
	STORY.timeout(function (d, n) {
		var fx = random(1);
		var obj = SPRITE.newObj('Enemy', {
			life: 1,
			frames: RES.frames.Enemy2A,
			x: UTIL.getGamePosX(fx),
			y: GAME.rect.t,
			vx: random(0.1) * (fx > 0.5 ? -1 : 1),
			vy: random(0.1, 0.15),
			duration: random(5000),
		});
		obj.anim(100, function(d) {
			d.vy -= (d.y - GAME.rect.t) / (GAME.rect.b - GAME.rect.t) * 0.01;
			if (this.is_dying)
				return newStg2Danns(obj, d.damage >= d.life ? 'r' : 'g') || true;
		}, obj.data)
	}, interval || 300, null, count || 30);
}
function newStg2Danns(from, color) {
	var frames = {
		r: RES.frames.LongA[2],
		g: RES.frames.LongB[9]
	}[color];
	var rt = random(PI);
	range(0.5001, -0.5, 1/10, function(f) {
		array(2, function(i) {
			newDannmaku(from, null, 0, f*PI2+rt, 0.07+i*0.03, 0, {
				color: color,
				frames: frames,
			})
		})
	})
}

function newEffect(from, frames, scale) {
	var d = from.data;
	SPRITE.newObj('Circle', {
		x: d.x,
		y: d.y,
		vx: d.vx*=0.1,
		vy: d.vy*=0.1,
		frames: frames,
		scale: scale || 1,
		dh: 1,
		kh: 1/950,
		duration: 50,
	});
}
function newEffectPiece(from, color, scale, duration) {
	var frame = {
		'r': RES.frames.EffPieceR,
		'g': RES.frames.EffPieceG,
		'b': RES.frames.EffPieceB,
		'w': RES.frames.EffPiece,
		'W': [RES.frames.EffEnemy2[0]],
	}[color] || RES.frames.EffPiece;
	var p = SPRITE.newObj('Circle', {
		x: from.data.x + random(10),
		y: from.data.y + random(10),
		vx: random(-0.2, 0.2),
		vy: random(-0.2, 0.2),
		frames: randin(frame),
		scale: scale || 1,
		opacity: 0.5,
		blend: 'lighter',
		dh: 50,
		kh: 1/random(500, 1000),
		duration: duration || 100,
	})
	p.data.scale0 = p.data.scale;
	p.drawCircle = function(d) {
		d.scale = (ease_in(d.ph) * 1.5 + 0.5) * d.scale0;
		return true;
	};
	p.anim(50, function(d) {
		d.vx *= 0.97;
		d.vy *= 0.97;
	}, p.data);
	return p;
}
function newBackground(scrollImgs) {
	var bg = SPRITE.newObj('Basic');
	bg.draw = return_nothing;
	ieach(scrollImgs, function(i, e) {
		e.object = bg;
		e.offsetX = parseFloat($attr(e, 'bg-offset-x') || '0');
		e.offsetY = parseFloat($attr(e, 'bg-offset') || '0');
		e.totalX = parseFloat($style(e, 'width')) - parseFloat($style('.game', 'width'));
		e.totalY = parseFloat($style(e, 'height')) - parseFloat($style('.game', 'height'));
		e.speedX = parseFloat($attr(e, 'bg-speed-x') || '0');
		e.speedY = parseFloat($attr(e, 'bg-speed') || '0');
	});
	bg.anim(50, function() {
		ieach(scrollImgs, function(i, e) {
			if (e.speedX || e.speedY) {
				e.offsetX += e.speedX * 50;
				if (e.offsetX > 0)
					e.offsetX -= e.totalX;
				else if (e.offsetX < -e.totalX)
					e.offsetX += e.totalX;
				if ((e.offsetY += e.speedY * 50) > 0)
					e.offsetY -= e.totalY;
				var trans = 'translate(' + e.offsetX + 'px, ' + e.offsetY + 'px)',
					trans2 = trans + ' rotate(0.0001deg)';
				$prefixStyle(e.style, 'Transform', trans2);
			}
		});
	});
	return bg;
}
function newStg1BgAnim(bg) {
	function updateBgImg(e, f) {
		if (!e.val) return;
		var v = e.val;
		var p = interp(v.persp[0], v.persp[1], f),
			r = interp(v.rotate[0], v.rotate[1], f),
			trans = 'perspective('+p+'px) rotateX('+r+'deg)',
			ori = '50% '+v.oriy+'px';
		$prefixStyle(e.style, 'Transform', trans);
		$prefixStyle(e.style, 'TransformOrigin', ori);
		e.style.opacity = interp(v.opacity[0], v.opacity[1], f);
	}

	var imgs = $('#bg_stg1_top, #bg_stg1_bottom');
	ieach(imgs, function(i, e, d) {
		e.val = d[e.id];
		updateBgImg(e, 0);
	}, {
		bg_stg1_bottom: {
			persp: [900, 500],
			rotate: [50, 70],
			opacity: [1, 1],
			oriy: -50,
		},
		bg_stg1_top: {
			persp: [700, 500],
			rotate: [30, 80],
			opacity: [1, 0],
			oriy: -100,
		}
	});
	bg.anim(50, function(d) {
		var age = d.age,
			begin = 25000,
			end = 30000;
		if (age >= begin && age <= end) {
			var f = ease_in_out((age - begin) / (end - begin));
			ieach(imgs, function(i, e) {
				updateBgImg(e, f);
			});
		}
	}, bg.data);
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

function newStgSecInit(next, para) {
	return {
		run: UTIL.newTimeRunner(3000, 'sec0'),
		init: function(d) {
			if (GAME.stgbg) GAME.stgbg.die();
			GAME.stgbg = newBackground(para.bgelem);
			para.bganim && para.bganim(GAME.stgbg);

			GAME.bgm_running = undefined;
			STORY.timeout(function(d) {
				d.title = SPRITE.newObj('Basic', {
					text: {
						text: para.title,
						res: 'ascii_yellow',
						map: RES.fontmap,
					}
				});
			}, 500, d);
			STORY.timeout(function(d) {
				d.text = SPRITE.newObj('Basic', {
					text: {
						text: para.text,
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
			}, 1000, d);
		},
		quit: function(d) {
			GAME.bgm_running = para.bgm;
			GAME.bgm_running.currentTime = 0;
			killObj(d.title, d.text);
		},
	}
}
function newStgSecNormal(next, para) {
	return {
		run: UTIL.newTimeRunner(para.duration, next),
		init: function(d) {
			para.init && para.init.apply(null, para.args);
		},
	}
}
function newStgSecDiag(next, para) {
	return {
		init: function(d) {
			d.age = 0;
			d.disable_fire = true;

			var bg = $i('.diag'),
				pos = $i(para.pos, bg),
				face = $i(para.face, pos),
				text = $i('.ft.dg .text', bg);
			var filter = function(i, e, d) {
				e === d ? e.classList.add('active') : e.classList.remove('active');
			};
			bg.classList.add('active');
			ieach($('.fr.dg, .fl.dg', bg), filter, pos);
			ieach($('.face', pos), filter, face);
			text.innerHTML = para.text || '';
		},
		run: function(dt, d) {
			if (d.pass || GAME.keyste.ctrlKey || (d.age+=dt) > (para.duration || 20000))
				return next;
		},
		quit: function(d, n) {
			if (para.ended || n != next) {
				var bg = $i('.diag');
				bg.classList.remove('active');
			}
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
}
function newStgSecBoss(next, para) {
	return {
		init: function(d) {
			killCls('Dannmaku');
			d.age = 0;
			d.disable_fire = para.disable_fire;

			d.boss = UTIL.getOneAlive('Enemy', 'boss') || newBoss();
			if (para.pathnodes)
				UTIL.addPathAnim(d.boss, para.pathnodes);
			if (!para.no_lifebar &&
					(!d.boss.lifebar || d.boss.lifebar.is_dying || d.boss.lifebar.finished))
				d.boss.lifebar = newLifeBar(d.boss);
			else if (para.no_lifebar &&
					(d.boss.lifebar && !d.boss.lifebar.is_dying && !d.boss.lifebar.finished))
				d.boss.lifebar.die();

			if (para.duration > 0 && !para.no_countdown)
				d.countdown = newCountDown(para.duration);
			if (para.background)
				d.background = para.background(d.boss);

			if (para.scname) {
				if (d.scelem = $i('.sc-boss')) {
					$readdClass(d.scelem.parentNode, 'active');
					$readdClass(d.scelem, 'active');
					$i('.text', d.scelem.parentNode).innerHTML = para.scname;
				}
				RES.se_cat00.play();
			}
			if (para.bgm)
				GAME.bgm_running = para.bgm;
		},
		quit: function(d) {
			killObj(d.countdown, d.background);
			if (d.scelem) {
				d.scelem.classList.remove('active');
				d.scelem.parentNode.classList.remove('active');
			}
		},
		run: function(dt, d) {
			d.age += dt;
			if (para.invinc)
				d.boss.data.damage = 0;
			if (d.age > para.duration || d.boss.data.damage >= para.damage || d.pass) {
				var success = d.pass || d.boss.data.damage >= para.damage,
					nextsec = (success ? para.success_next : para.fail_next) || next;
				d.boss.data.damage = para.damage || 0;
				return nextsec;
			}
		},
		on: function(e, v, d) {
			if (e == STORY.events.ENEMY_KILL) {
				if (v.data.boss) {
					d.pass = true;
					SPRITE.eachObj(function(i, obj) {
						STORY.on(STORY.events.DANNMAKU_HIT, obj);
					}, 'Dannmaku');
					if (para.scname) {
						var x = d.boss.data.x,
							y = d.boss.data.y;
						ieach([0, 0, 0, 0, 2], function(i, type) {
							newDrop(type, x, y, { vx:random(-0.2, 0.2), vy:random(-0.25, -0.3) });
						})
					}
				}
			}
		},
	}
}
function newStgSecBossKill(next, para) {
	return {
		init: function(d) {
			var boss = UTIL.getOneAlive('Enemy', 'boss') || {
				data: { x:UTIL.getGamePosX(0.5), y:UTIL.getGamePosY(0.5), vx:0, vy:0 },
			};
			killCls('Enemy', 'Dannmaku');
			STORY.timeout(function() {
				newEffectPiece(boss, 'W', 1, 800);
			}, 30, null, 50);
			STORY.timeout(function() {
				RES.se_tan00.replay();
			}, 150, null, 12)
			STORY.timeout(function() {
				newEffect(boss, RES.frames.EffPlayer, 2);
				RES.se_enep01.replay();
			}, 1500);
		},
		run: UTIL.newTimeRunner(4000, next),
	}
}
function newStgSecAskContinue(next, para) {
	return {
		init: function(d) {
			GAME.state = GAME.states.PAUSE;
			$i('.game.pause').insertBefore($new('div', {
				id: 'pause_notice',
				style: 'position:absolute;margin:1em',
				innerHTML: RES.st_ask_continue,
			}), $i('.menu-pause-text'));
		},
		run: function(dt, d) {
			newDrop(2, 0, 0, { vx:random(-0.3, 0.3), vy:random(-0.1, -0.2), });
			newDrop(2, 0, 0, { vx:random(-0.3, 0.3), vy:random(-0.1, -0.2), });
			newDrop(2, 0, 0, { vx:random(-0.3, 0.3), vy:random(-0.1, -0.2), });
			newDrop(2, 0, 0, { vx:random(-0.3, 0.3), vy:random(-0.1, -0.2), });
			return next;
		},
		quit: function(d) {
			var e = $e('pause_notice');
			e.parentNode.removeChild(e);
		}
	}
}
function newStgSecsFromList(stage, list, newStageFn, prefix) {
	ieach(list, function(i, para, prefix) {
		var name = para.name || prefix+i,
			next = para.next || prefix+(i+1);
		stage[name] = newStageFn(next, para);
	}, prefix);
}
function newStgHook() {
	return {
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
				UTIL.getOneAlive('Player', 'player', 'p1') ||  newPlayer({ player: 'p1', });
				if (GAME.double_player_mode && !(GAME.double_player_mode = false)) {
					UTIL.getOneAlive('Player', 'player', 'p2') || newPlayer({
						player: 'p2',
						conf: {
							key_left: 100,
							key_up: 104,
							key_right: 102,
							key_down: 101,
							key_fire: 36,
							key_bomb: 35,
							key_slow: 45,
						}
					});
				}
				extend(STATICS, {
					max_point: 1000000,
					bomb_reset: 3,
					point: 0,
					player: 3,
					bomb: 3,
					power: 0,
					graze: 0,
					dot: 0,

					time: 0,
				})
				if (GAME.many_lives_mode && !(GAME.many_lives_mode = false)) {
					STATICS.player = 7;
					STATICS.bomb_reset = 7;
					STATICS.bomb = STATICS.bomb_reset;
				}
			}
			else if (e == STORY.events.GAME_INPUT) {
				if (v.type == 'keyup' && v.which == 27) {
					var s = GAME.state,
						c = GAME.states;
					if (s == c.RUNNING) {
						GAME.state = c.PAUSE;
						RES.se_pause.play();
					}
				}
			}
			else if (e == STORY.events.PLAYER_AUTOCOLLECT) {
				SPRITE.eachObj(function(i, that) {
					that.data.to = v;
					that.data.keep = true;
				}, 'Drop');
			}
			else if (e == STORY.events.PLAYER_HIT) {
				STATICS.graze --;
				v.juesi();
				array(8, function() {
					newEffectPiece(v, 'g');
				});
			}
			else if (e == STORY.events.PLAYER_GRAZE) {
				STATICS.graze ++;
				RES.se_graze.play();
				newEffectPiece(v, 'w', 0.5);
			}
			else if (e == STORY.events.PLAYER_DYING) {
				v.die();
				var x = v.data.x,
					y = v.data.y;
				ieach([0, 0, 0, 0, 2], function(i, type) {
					newDrop(type, x, y, { vx:random(-0.2, 0.2), vy:random(-0.25, -0.3) });
				})
				STATICS.player --;
				STATICS.bomb = STATICS.bomb_reset;
				STATICS.power = limit_between(STATICS.power - 16, 0, 128);
				STORY.timer.add(newTicker(100, function() {
					killCls('Dannmaku');
					if (this.finished = v.finished) {
						if (STATICS.player >= 0) newPlayer({
							player: v.data.player,
							conf: v.data.conf
						});
						else
							GAME.state = GAME.states.OVER;
					}
				}));
				newEffect(v, RES.frames.EffPlayer);
				RES.se_pldead00.play();
			}
			else if (e == STORY.events.PLAYER_FIRE) {
				if (v.is_fire_enable = !d.disable_fire && !v.is_dying)
					newBullet(v, STATICS.power);
			}
			else if (e == STORY.events.PLAYER_BOMB) {
				if (!d.disable_fire && STATICS.bomb > 0) {
					STATICS.bomb --;
					v.bomb();
					newBomb(v);
					RES.se_cat00.play();
					SPRITE.anim.add(newTicker(1000, function(d) {
						RES.se_gun00.play();
						this.finished = true;
					}));
				}
			}
			else if (e == STORY.events.ENEMY_KILL) {
				if (v.data.respawn-- > 0)
					v.data.damage = 0;
				else {
					v.die();
					var type;
					if (v.data.power_pt)
						type = v.data.power_pt >= 128 ? 4 : (v.data.power_pt >= 8 ? 2 : 0);
					else
						type = random(1) > 0.8 ? 0 : 1;
					newDrop(type, v.data.x, v.data.y);
				}
				newEffect(v, RES.frames.EffEnemy);
				array(4, function() {
					newEffectPiece(v, 'b');
				});
				RES.se_enep00.replay();
			}
			else if (e == STORY.events.DROP_COLLECTED) {
				v.die();
				STATICS.point += v.data.point_pt || 10;
				if (v.data.power_pt) {
					var pt = v.data.power_pt;
					ieach([8, 16, 32, 48, 60, 80, 100, 128], function(i, c) {
						if (STATICS.power < c && STATICS.power+pt >= c) {
							RES.se_powerup.play();
							SPRITE.newObj('Basic', {
								x: v.data.x,
								y: v.data.y,
								frames: RES.frames.PowerUp,
								duration: 1000,
							})
							return true;
						}
					});
					STATICS.power = limit_between(STATICS.power+pt, 0, 128);
				}
				if (v.data.point_pt) {
					STATICS.dot ++;
					SPRITE.newObj('Basic', {
						x: v.data.x,
						y: v.data.y,
						text: {
							res: 'ascii',
							map: RES.nummap_small,
							text: '' + v.data.point_pt,
						},
						duration: 1000,
					});
				}
				RES.se_item00.replay();
			}
			else if (e == STORY.events.BULLET_HIT) {
				v.die();
				v.data.vx *= 0.05;
				v.data.vy *= 0.05;
				UTIL.addFrameAnim(v, RES.frames.BulletD[v.data.to ? 1 : 0]);
				newEffectPiece(v, 'r');
			}
			else if (e == STORY.events.SHIELD_HIT) {
				//newEffect(v, RES.frames.EffPlayer, 2);
			}
			else if (e == STORY.events.DANNMAKU_HIT) {
				v.die();
				v.data.vx *= 0.1;
				v.data.vy *= 0.1;
				newDrop(6, v.data.x, v.data.y, {
					to: UTIL.getOneAlive('Player'),
					keep: true,
				});
			}
		}
	}
}

function newStage1(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg1'),
		bganim: newStg1BgAnim,
		title: 'STAGE 1',
		text: RES.st_stg1_title,
		bgm: RES.bgm_stg1a,
	});
	newStgSecsFromList(stage, [
		{ init:newSec1, args:['s0A2', 5], duration:3000, },
		{ init:newSec1, args:['s0A1', 8], duration:2000, },
		{ init:newSec2, args:[0.4, 10], duration:4000, },
		{ init:newSec3, args:[1000, 5], duration:5000, },
		{ init:newSec3, args:[500, 10], duration:5000, },
		{ init:newSec4, args:[], duration:6000 },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]]], duration:2000 },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]]], duration:4000, next:'bossA' },
		// ...
		{ init:newSec3, args:[1000, 20], duration:16000, name:'secH' },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]]], duration:2000 },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]]], duration:2000 },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]]], duration:7000, next:'diagA' },
		// ...
		{ init:newSec3, args:[500, 30, 3, 10], duration:10000, name:'secX' },
		{ init:newSecList, args:[
			[newSec3, [500, 300, 3, 10]],
			[newSec1, ['s0A2', 8, [[0, 0]], 1000, 0.2, 0.04, 10]],
			[newSec1, ['s0A1', 8, [[0, 0]], 1000, 0.2, 0.04, 10], 2000],
			[newSec1, ['s0A2', 8, [[-40, 0], [+40, 0]], 1000, 0.2, 0.04, 10], 8000],
			[newSec1, ['s0A1', 8, [[+40, 0], [-40, 0]], 1000, 0.2, 0.04, 10], 10000],
			[newSec1, ['s0A2', 8, [[0, 0]], 1000, 0.2, 0.04, 10], 16000],
			[newSec1, ['s0A1', 8, [[0, 0]], 1000, 0.2, 0.04, 10], 18000],
		], duration:20000, },
		{ init:newSecEx1, args:[0.2], duration:100, },
		{ init:newSecEx1, args:[-0.2], duration:100, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSecEx1, args:[0.2], duration:100, },
		{ init:newSecEx1, args:[-0.2], duration:100, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A2', 8, [[-40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec1, args:['s0A1', 8, [[+40, 0], [0, 0]], 1000, 0.3], duration:1500, },
		{ init:newSec4, args:[newDanns2, 10], duration:10000, },
		{ init:newSecEx2, args:[0, 0, 0.1, 0.2], duration:100, },
		{ init:newSecEx2, args:[1, 0, -0.1, 0.2], duration:1000, },
		{ init:newSecEx2, args:[0, 0.3, 0.1, 0.12], duration:100, },
		{ init:newSecEx2, args:[1, 0.3, -0.1, 0.12], duration:1000, },
		{ init:newSecEx2, args:[0, 0.3, 0.1, 0.12], duration:100, },
		{ init:newSecEx2, args:[1, 0.3, -0.1, 0.12], duration:1000, },
		{ duration:5000, },
		{ init:newSec4, args:[newDanns2, 10], duration:10000, },
		{ duration:5000, },
		{ init:killCls, args:['Enemy', 'Dannmaku'], duration:1000, next:'diagD', },
	], newStgSecNormal, 'sec');
	newStgSecsFromList(stage, [
		{ text:RES.st_stg1_diag1,  pos:'.fl.dg', face:'.f0a', name:'diagA', },
		{ text:RES.st_stg1_diag2,  pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag3,  pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag4,  pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag5,  pos:'.fl.dg', face:'.f0b.f2', next:'bossB', },
		{ text:RES.st_stg1_diag6,  pos:'.fr.dg', face:'.f3a.f2', name:'diagB', },
		{ text:RES.st_stg1_diag7,  pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag8,  pos:'.fr.dg', face:'.f3a' },
		{ text:RES.st_stg1_diag9,  pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag10, pos:'.fr.dg', face:'.f3b.f2' },
		{ text:RES.st_stg1_diag11, pos:'.fl.dg', face:'.f0b.f2' },
		{ text:RES.st_stg1_diag12, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag13, pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag14, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag15, pos:'.fl.dg', face:'.f0b.f2', next:'bossC', ended:true, },
		{ text:RES.st_stg1_diagXX, pos:'.fr.dg', face:'.fx', name:'diagC', duration:10 },
		{ text:RES.st_stg1_diag16, pos:'.fl.dg', face:'.f0b.f2', next:'askContinue', ended:true, },
		{ text:RES.st_stg1_diag17, pos:'.fr.dg', face:'.f3a.f2', name:'diagD', },
		{ text:RES.st_stg1_diag18, pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag19, pos:'.fr.dg', face:'.f3a' },
		{ text:RES.st_stg1_diag20, pos:'.fl.dg', face:'.f0b.f2' },
		{ text:RES.st_stg1_diag21, pos:'.fr.dg', face:'.f3a.f2' },
		{ text:RES.st_stg1_diag22, pos:'.fl.dg', face:'.f0c.f2' },
		{ text:RES.st_stg1_diag23, pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag24, pos:'.fr.dg', face:'.f3a.f2' },
		{ text:RES.st_stg1_diag25, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag26, pos:'.fl.dg', face:'.f0b.f2' },
		{ text:RES.st_stg1_diag27, pos:'.fl.dg', face:'.f0b' },
		{ text:RES.st_stg1_diag28, pos:'.fr.dg', face:'.f3b.f2' },
		{ text:RES.st_stg1_diag29, pos:'.fl.dg', face:'.f0c' },
		{ text:RES.st_stg1_diag30, pos:'.fr.dg', face:'.f3b' },
		{ text:RES.st_stg1_diag31, pos:'.fl.dg', face:'.f0a' },
		{ text:RES.st_stg1_diag32, pos:'.fl.dg', face:'.f0a.f2' },
		{ text:RES.st_stg1_diag33, pos:'.fr.dg', face:'.f3a', next:'bossY', ended:true },
	], newStgSecDiag, 'diag');
	newStgSecsFromList(stage, [
		{
			pathnodes: [
				{ fx:0.50, fy:0.00, v:0.2, },
				{ t:1000, fx:0.83, fy:0.28, v:0.2, },
				{ t:1000, fn:newBossDanns1, args:['b'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:1000, fn:newBossDanns2, },
				{ t:1000, fx:0.17, fy:0.28, v:0.2, },
				{ t:1000, fn:newBossDanns1, args:['g'], },
				{ t:1000, fn:newBossDanns1, args:['y'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:2000, fn:newBossDanns3, args:['brgyY'], },
				{ t:1000, fx:0.83, fy:0.28, v:0.2, },
				{ t: 500, fn:newBossDanns1, args:['b'], },
				{ t:2000, fn:newBossDanns1, args:['r'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:1500, fn:newBossDanns2, },
				{ t: 500, fx:0.17, fy:0.28, v:0.2, },
				{ t: 500, fn:newBossDanns1, args:['g'], },
				{ t:2000, fn:newBossDanns1, args:['y'], },
				{ t:1000, fx:0.50, fy:0.10, v:0.2, },
				{ t:2000, fn:newBossDanns3, args:['brgyY'], },
				{ t: 500, fx:0.83, fy:0.28, v:0.2, },
				{ t: 500, fn:newBossDanns1, args:['b'], },
			],
			damage: 300,
			duration: 25000,
			name: 'bossA',
			fail_next: 'boss2',
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ fx:0.5, fy:0.2, },
				{ t:100, fn:newBossDanns0, },
				{ t:4000, fn:newBossDanns0A, },
				{ fx:0.7, fy:0.1, },
				{ t:4000, fn:newBossDanns0A, },
				{ fx:0.3, fy:0.1, },
				{ t:4000, fn:newBossDanns0A, },
				{ fx:0.1, fy:0.2, },
				{ t:4000, fn:newBossDanns0A, },
			],
			duration: 20000,
			scname: RES.st_stg1_sc0,
			background: newBossBackground,
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
				{ t:2000, fx:0.50, fy:0.10, v:0.2, fn:newBossDanns4, args:[5], },
				{ t:1000, fx:0.40, fy:0.30, v:0.1, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t:2000, },
				{ t:2500, fx:0.60, fy:0.20, fn:newBossDanns4, args:[5], },
				{ t:1500, fx:0.60, fy:0.30, },
				{ t:1500, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t:1500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, },
				{ t:1500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.30, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t:2000, },
				{ t: 500, fx:0.50, fy:0.30, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t:2000, },
				{ t:2500, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
				{ t: 500, fx:0.20, fy:0.20, },
				{ t:2500, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t:1000, fx:0.40, fy:0.10, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t:1000, },
			],
			duration: 35000,
			name: 'bossC',
			bgm: RES.bgm_stg1b,
		},
		{
			pathnodes: [
				{ t:2000, v:0.1 },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 200, fx:0.30, fy:0.10, v:0.05, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 200, fx:0.40, fy:0.30, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 200, fx:0.60, fy:0.20, },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
				{ t: 800, fn:newBossDanns5, args:['b', -1], },
				{ t: 800, fn:newBossDanns5, args:['c',  1], },
			],
			duration: 25000,
			scname: RES.st_stg1_sc1,
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
				{ t:1500, fn:newBossDanns7, },
				{ t: 200, fx:0.70, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t:2500, },
				{ t: 500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 15, 0.3, 0.05, 0.1], },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 20, 0.4, 0.08, 0.1], },
				{ t:2500, },
				{ t: 200, fx:0.70, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t:1200, fn:newBossDanns5, args:['g', -1], },
				{ t: 500, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 15, 0.3, 0.05, 0.1], },
				{ t: 100, fn:newBossDanns6, args:['y', 3, 20, 0.4, 0.08, 0.1], },
				{ t:2500, },
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
				{ t:2500, fx:0.60, fy:0.30, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
			],
			duration: 30000,
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ t: NaN, fx:0.50, fy:0.20, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.70, fy:0.30, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.30, fy:0.20, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.50, fy:0.30, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.60, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
				{ t: 100, fx:0.50, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: 200, fn:newBossDanns9, args:[ 1], },
				{ t: 200, fn:newBossDanns9, args:[-1], },
				{ t: NaN, fx:0.60, fy:0.10, },
				{ t:1000, fn:newBossDanns8, args:['b'], },
				{ t:1000, fn:newBossDanns8, args:['g'], },
				{ t:1000, fn:newBossDanns8, args:['r'], },
			],
			duration: 25000,
			scname: RES.st_stg1_sc2,
			background: newBossBackground,
			next: 'bossKill',
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
			name: 'bossX',
			next: 'diagD',
		},
		{
			pathnodes: [
				{ t: 800, v:0.2 },
				{ t: 800, fx:0.50, fy:0.10, v:0.2, fn:newBossDanns4, args:[5], },
				{ t: 800, fx:0.40, fy:0.30, v:0.1, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
				{ t: 800, fx:0.60, fy:0.20, fn:newBossDanns4, args:[5], },
				{ t: 800, fx:0.60, fy:0.30, },
				{ t: 800, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t: 800, fx:0.50, fy:0.10, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.30, },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 200, fn:newBossDanns5, args:['g', -1], },
				{ t: 800, },
				{ t: 500, fx:0.50, fy:0.30, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 500, fn:newBossDanns1NoSound, args:['b', 3, 30, 0.02], },
				{ t: 500, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
				{ t: 800, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
				{ t: 500, fx:0.20, fy:0.20, },
				{ t: 800, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t: 800, fx:0.40, fy:0.10, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
				{ t: 800, fx:0.50, fy:0.30, fn:newBossDanns4, args:[5], },
				{ t: 500, fx:0.20, fy:0.20, },
				{ t: 800, fn:newBossDanns3, args:['BBBBBBB'], },
				{ t: 800, fx:0.40, fy:0.10, },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 200, fn:newBossDanns5, args:['g', 1], },
				{ t: 800, },
			],
			duration: 25000,
			name: 'bossY',
		},
		{
			pathnodes: [
				{ v:0.1 },
				{ t: NaN, fx:0.50, fy:0.20, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.70, fy:0.30, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.30, fy:0.20, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.50, fy:0.30, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.60, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.60, fy:0.20, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
				{ t: 100, fx:0.50, fy:0.10, },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: 200, fn:newBossDanns9, args:[ 1, 100], },
				{ t: 200, fn:newBossDanns9, args:[-1, 100], },
				{ t: NaN, fx:0.60, fy:0.10, },
				{ t: 200, fn:newBossDanns8, args:['b', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['b', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['g', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['g', 1, 3200, 0.952, -0.002], },
				{ t: 200, fn:newBossDanns8, args:['r', 1, 1500, 0.88], },
				{ t: 800, fn:newBossDanns8, args:['r', 1, 3200, 0.952, -0.002], },
			],
			duration: 25000,
			scname: RES.st_stg1_sc_ex1,
			background: newBossBackground,
		},
		{
			pathnodes: [
				{ t:2000, v:0.05 },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 200, fx:0.30, fy:0.10, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 200, fx:0.40, fy:0.30, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 200, fx:0.60, fy:0.20, },
				{ t: 100, fn:newBossDanns6, },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
				{ t: 800, fn:newBossDanns5, args:['r', -1, 5], },
				{ t: 800, fn:newBossDanns5, args:['m',  1, 5], },
			],
			duration: 25000,
			damage: 200,
		},
		{
			pathnodes: [
				{ t:2000, v:0.05 },
				{ t: 100, fn:newBossDannsEx0, },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 200, fx:0.40, fy:0.30, },
				{ t: 600, fn:newBossDanns4, args:[3, 'o'], },
				{ t: 200, fx:0.30, fy:0.10, },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 200, fx:0.60, fy:0.20, },
				{ t: 600, fn:newBossDanns4, args:[3, 'o'], },
				{ t: 200, fx:0.50, fy:0.20, },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
				{ t: 500, fn:newBossDannsEx1, args:[], },
			],
			duration: 15000,
			scname: RES.st_stg1_sc_ex2,
			background: newBossBackground,
		},
		{
			pathnodes: [
				{ v: 0.05 },
				{ t: 100, fn:newBossDannsEx2, args:[30, 4, 0.1], },
				{ t: NaN, fx:0.5, fy:0.1, },
				{ t: NaN, fx:0.3, fy:0.2, },
				{ t: NaN, fx:0.7, fy:0.2, },
				{ t: 100, fn:newBossDannsEx2, args:[20, 8, 0.15], },
				{ t: NaN, fx:0.5, fy:0.1, },
				{ t: NaN, fx:0.4, fy:0.3, },
				{ t: 100, fn:newBossDannsEx2, args:[35, 15, 0.2], },
				{ t: NaN, fx:0.7, fy:0.4, },
			],
			duration: 20000,
		},
		{
			pathnodes: [
				{ t:2000, v:0.05 },
				{ t: 500, fx:0.50, fy:0.20, },
				{ t: 100, fn:newBossDannsEx3, args:[-1], },
				{ t: 100, fx:0.50, fy:0.60, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.20, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.80, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.80, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.20, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.60, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.20, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.80, fy:0.30, },
				{ t: 100, fn:newBossDannsEx4, },
				{ t: NaN, },
				{ t: 100, fx:0.50, fy:0.80, },
				{ t: 100, fn:newBossDannsEx4, },
			],
			life: 1000,
			duration: 40000,
			scname: RES.st_stg1_sc_ex3,
			background: newBossBackground,
			next: 'bossKill2',
		},
	], newStgSecBoss, 'boss');
	newStgSecsFromList(stage, [
		{ name:'bossKill', next:'diagC', },
		{ name:'bossKill2', next:'score', },
	], newStgSecBossKill, 'bossKill');
	stage.askContinue = newStgSecAskContinue('secX');
	stage.score = {
		init: function(d) {
			var elem = $e('bg_score');
			elem.object = d.mask = SPRITE.newObj('Basic', {
				dh: 1/1000,
				kh: 1/1000,
			});
			d.mask.anim(50, function(d) {
				elem.style.opacity = d.ph;
				var offset = (1 - d.ph) * (GAME.rect.b - GAME.rect.t);
				$prefixStyle(elem.style, 'Transform', 'translateY(' + offset + 'px)');
			}, d.mask.data);
		},
		run: function(dt, d) {
			d.age = (d.age || 0) + dt;
			if (d.pass || d.age > 4000)
				return 'ended';
		},
		quit: function(d) {
			d.mask.die();
			setTimeout(function() {
				GAME.load(newStage2());
				GAME.start('init');
			}, 10);
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
	return stage;
}
function newStage2(difficuty) {
	var stage = {};
	stage.hook = newStgHook();
	stage.init = newStgSecInit('sec0', {
		bgelem: $('.bg-stg2'),
		title: 'STAGE 2',
		text: RES.st_stg2_title,
		bgm: RES.bgm_stg1a,
	});
	newStgSecsFromList(stage, [
		{ init:newStg2Sec1, args:[120, 100], duration:12000, },
	], newStgSecNormal, 'sec');
	return stage;
}

