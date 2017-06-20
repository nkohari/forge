'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ensure = require('./util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Inspector {

  getDependencies(func) {
    (0, _ensure2.default)('func', func);
    const params = this.getParameterNames(func);
    const hints = this.getDependencyHints(func);
    return params.map(param => hints[param] || { name: param, all: false, hint: undefined });
  }

  getParameterNames(func) {
    (0, _ensure2.default)('func', func);

    const regex = /(?:function|constructor)[ A-Za-z0-9]*\(([^)]*)/g;
    const matches = regex.exec(func.toString());

    if (matches == null || matches[1].length === 0) {
      return [];
    }

    const args = matches[1].split(/[,\s]+/);

    if (this.unmangleNames) {
      return args.map(arg => arg.replace(/\d+$/, ''));
    } else {
      return args;
    }
  }

  getDependencyHints(func) {
    (0, _ensure2.default)('func', func);

    const regex = /"(.*?)\s*->\s*(all)?\s*(.*?)";/gi;
    const hints = {};

    let match;
    while (match = regex.exec(func.toString())) {
      var _Array$from = Array.from(match),
          _Array$from2 = _slicedToArray(_Array$from, 4);

      const pattern = _Array$from2[0],
            argument = _Array$from2[1],
            allString = _Array$from2[2],
            dependency = _Array$from2[3];

      const all = allString != null;
      if (dependency.indexOf(':')) {
        var _Array$from3 = Array.from(dependency.split(/\s*:\s*/, 2)),
            _Array$from4 = _slicedToArray(_Array$from3, 2);

        const name = _Array$from4[0],
              hint = _Array$from4[1];

        hints[argument] = { name, all, hint };
      } else {
        hints[argument] = { name: dependency, all, hint: undefined };
      }
    }

    return hints;
  }

  findConstructor(type) {
    (0, _ensure2.default)('type', type);

    let candidate = type;
    while (candidate !== Function.prototype) {
      if (this.getParameterNames(candidate).length > 0) {
        return candidate;
      }
      candidate = Object.getPrototypeOf(candidate);
    }

    return type;
  }

}

exports.default = Inspector;
//# sourceMappingURL=Inspector.js.map