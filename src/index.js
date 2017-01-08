"use strict";

//border, font-color, background-color except for background-image
function darkenize() {
    this.dark_theme_attribute = [
        {'type': 'background', 'value': 'background-color'}, 
        {'type': 'text', 'value': 'color'}, 
        {'type': 'border', 'value': 'border-bottom-color'}, 
        {'type': 'border', 'value': 'border-top-color'}, 
        {'type': 'border', 'value': 'border-left-color'}, 
        {'type': 'border', 'value': 'border-right-color'}
    ];

    this.color_preset = {
         'text': {'threshold': 1, 'control': 2, 'flag': 'lt'},
         'background': {'threshold': 0.4, 'control': 0.2, 'flag': 'gt'},
         'border': {'threshold': 0.3, 'control': 1.4, 'flag': 'gt'}
    };

    // svg?
    this.stop_elem = [
        'meta',
        'head',
        'link',
        'script',
        'style',
        'title',
        'svg',
        'pre'
    ];
    this.dynamic_coloring = false;
    // this.brightness_threshold = ;
    // this.brightness_control = ;
}

darkenize.prototype.autoColorize = function(node) {
    var elements;
    
    if (node) {
        elements = node;
    } else {
        if (this.stop_elem.length != 0) {
            elements = document.querySelectorAll("*:not(" + this.stop_elem.join("):not(") + ")");
        } else {
            elements = document.querySelectorAll("*");
        }
    }
    elements.forEach(function(item) {
        this.setColorForDarkTheme(item);
    }, this);
};

darkenize.prototype.setColorForDarkTheme = function(node) {
    var computedStyle;

    if (typeof window !== undefined)
        computedStyle = window.getComputedStyle(node);
    else
        throw "This method is only available in web browser";

    this.dark_theme_attribute.forEach(function(item) {
        node.style.setProperty(item.value, 
                               this.getColorForDarkTheme(computedStyle[item.value], this.color_preset[item.type]));
    }, this);
    
    return node;
};

//0 ≤ brightness_threshold ≤ 1 and 0 ≤ brightness_control ≤ 1
darkenize.prototype.getColorForDarkTheme = function(value, preset) {
    var color = darkenize.parseColor(value),
        dark_theme_color = value;

//    var _brightness_threshold = brightness_threshold || 0.5,
//        _brightness_control = brightness_control || 0.3,
//        _brightness_weight = 1;
    var _brightness_threshold = preset.threshold,
        _brightness_control = preset.control,
        _brightness_weight = 1;

    if (color.space == 'rgb') {
        var hsv_color = darkenize.rgb2hsv(color.value[0], color.value[1], color.value[2]);
        
        if (hsv_color.v > _brightness_threshold) {
//            if (brightness_control === undefined)
//                hsv_color.v *= _brightness_control;
//            else
                hsv_color.v *= (_brightness_control * _brightness_weight);
            dark_theme_color = darkenize.hsv2rgb(hsv_color.h, hsv_color.s, hsv_color.v, 'hex');
        }
    }
    else if (color.space == 'hsv') {
        if (color.value[2] > _brightness_threshold) {
//            if (brightness_control === undefined) 
//                color.value[2] *= _brightness_control;
//            else
                color.value[2] *= (_brightness_control * _brightness_weight);
            dark_theme_color = darkenize.hsv2rgb(color.value[0], color.value[1], color.value[2], 'hex');
        }
    }

    return dark_theme_color;
};

//1 ≤ r, g, b < 255
darkenize.rgb2hsv = function(r, g, b, format) {
    var _format = format || 'object',
        _color = {
            _r: r / 255,
            _g: g / 255,
            _b: b / 255
        },
        _max_key = Object.keys(_color).reduce(function(a, b){ return _color[a] > _color[b] ? a : b }),
        _min_key = Object.keys(_color).reduce(function(a, b){ return _color[a] < _color[b] ? a : b }),
        delta = _color[_max_key] - _color[_min_key],
        _h = 60;

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
darkenize.hsv2rgb = function(h, s, v, format) {
    var _format = format || 'hex',
        _h = (h < 0) ? h + 360 : h,
        _color = {
            _r: 0,
            _g: 0,
            _b: 0
        };

    var C = s * v,
        X = C * (1 - Math.abs( ((_h / 60) % 2) - 1 )),
        m = v - C;

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
        return "#" + ((1 << 24) + (Math.floor((_color._r + m) * 255) << 16) + (Math.floor((_color._g + m) * 255) << 8) + Math.floor((_color._b + m) * 255)).toString(16).slice(1);
    }
}

darkenize.parseColor = function(value) {
    var param,
        color_space;

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

window.darkenize = darkenize;
