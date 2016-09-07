"use strict";

//border, font-color, background-color except for background-image
function color_dark_theme() {
}

color_dark_theme.prototype.autoScaling = function() {
};

color_dark_theme.prototype.parameterizedScaling = function() {
};

color_dark_theme.prototype.getColorForDarkTheme = function(value, brightness_threshold, brightness_control) {
    var color = color_dark_theme.parseColor(value);
    var dark_theme_color = value;

    var _brightness_threshold = brightness_threshold || 0.5;
    var _brightness_control = brightness_control || 0.6;

    if (color.space == 'rgb') {
        var hsv_color = color_dark_theme.rgb2hsv(color.value[0], color.value[1], color.value[2]);
        
        if (hsv_color.v > _brightness_threshold) {
            hsv_color.v *= _brightness_control;
            dark_theme_color = color_dark_theme.hsv2rgb(hsv_color.h, hsv_color.s, hsv_color.v, 'hex');
        }
    }
    else if (color.space == 'hsv') {
        if (color.value[2] > _brightness_threshold) {
            color.value[2] *= brightness_control;
            dark_theme_color = color_dark_theme.hsv2rgb(color.value[0], color.value[1], color.value[2], 'hex');
        }
    }

    return dark_theme_color;
};

//1 ≤ r, g, b < 255
color_dark_theme.rgb2hsv = function(r, g, b, format) {
    var _format = format || 'object';
    var _color = {
        _r: r / 255,
        _g: g / 255,
        _b: b / 255
    };

    var _max_key = Object.keys(_color).reduce(function(a, b){ return _color[a] > _color[b] ? a : b });
    var _min_key = Object.keys(_color).reduce(function(a, b){ return _color[a] < _color[b] ? a : b });
    var delta = _color[_max_key] - _color[_min_key];
    var _h = 60;

    if (_max_key == "_r") {
        _h *= ( ((_color._g - _color._b) / delta) % 6 );
    }
    else if (_max_key == "_g") {
        _h *= ( ((_color._b - _color._r) / delta) + 2 );
    }
    else if (_max_key == "_b") {
        _h *= ( ((_color._r - _color._g) / delta) + 4 );
    }

    if (_format == 'object')
        return {
            h: (delta == 0) ? 0 : _h,
            s: (_color[_max_key] == 0) ? 0 : delta / _color[_max_key],
            v: _color[_max_key]
        };
}

//0 ≤ h < 360, 0 ≤ s ≤ 1 and 0 ≤ v ≤ 1
color_dark_theme.hsv2rgb = function(h, s, v, format) {
    var _format = format || 'hex';
    var _h = (h < 0) ? h + 360 : h;
    var _color = {
        _r: 0,
        _g: 0,
        _b: 0
    };

    var C = s * v;
    var X = C * (1 - Math.abs( ((_h / 60) % 2) - 1 ));
    var m = v - C;

    if (_h >= 0 && _h < 60) {
        _color._r = C;
        _color._g = X;
    }
    else if (_h >= 60 && _h < 120) {
        _color._r = X;
        _color._g = C;
    }
    else if (_h >= 120 && _h < 180) {
        _color._g = C;
        _color._b = X;
    }
    else if (_h >= 180 && _h < 240) {
        _color._g = X;
        _color._b = C;
    }
    else if (_h >= 240 && _h < 300) {
        _color._r = X;
        _color._b = C;
    }
    else if (_h >= 300 && _h < 360) {
        _color._r = C;
        _color._b = X;
    }

    if (_format == 'object')
        return {
            r: (_color._r + m) * 255,
            g: (_color._g + m) * 255,
            b: (_color._b + m) * 255
        }
    else if (_format == 'hex') {
        return "#" + ((1 << 24) + (((_color._r + m) * 255) << 16) + (((_color._g + m) * 255) << 8) + (_color._b + m) * 255).toString(16).slice(1);
    }
}

color_dark_theme.parseColor = function(value) {
    var param;
    var color_space;

    if (value.indexOf('#') == 0) {
        color_space = 'rgb';

        //shorthand hex
        if (value.length == 4) {
            value = value.replace(/\w/g, function(m) {
                return m+m;
            });
        }

        var result = parseInt(value.substr(1), 16);
        param = [
            (result >> 16) & 255,
            (result >> 8) & 255,
            result & 255
        ];
    }
    else if (value.indexOf('rgb' || 'rgba')) {
        color_space = 'rgb';
        param = value.match(/([0-9]*[.])?[0-9]+/g).map(function(item) {
            return parseFloat(item);
        });
    }
    else if (value.indexOf('hsv' || 'hsvl')) {
        color_space = 'hsv';
        param = value.match(/([0-9]*[.])?[0-9]+/g).map(function(item) {
            return parseFloat(item);
        });
    }

    return {
        'space': color_space,
        'value': param
    }
}

module.exports = color_dark_theme;
