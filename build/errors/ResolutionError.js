'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

class ResolutionError extends _extendableBuiltin(Error) {

  constructor(name, hint, context, message) {
    super();

    const lines = [];
    lines.push(`Could not resolve component named ${name}: ${message}`);
    if (hint != null) {
      lines.push('  With resolution hint:');
      lines.push(`    ${_util2.default.inspect(hint)}`);
    }
    lines.push('  In resolution context:');
    lines.push(context.toString());
    lines.push('  ---');
    this.message = lines.join('\n');
  }

  toString() {
    return this.message;
  }

}

exports.default = ResolutionError;
//# sourceMappingURL=ResolutionError.js.map