'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('../util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _Resolver = require('./Resolver');

var _Resolver2 = _interopRequireDefault(_Resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FunctionResolver extends _Resolver2.default {

  constructor(forge, binding, func) {
    super(forge, binding);
    (0, _ensure2.default)('func', func);
    this.func = func;
    this.dependencies = this.forge.inspector.getDependencies(this.func);
  }

  resolve(context, args) {
    const callArguments = this.resolveDependencies(context, this.dependencies, args);
    return this.func(...callArguments);
  }

  toString() {
    return 'function';
  }

}

exports.default = FunctionResolver;
//# sourceMappingURL=FunctionResolver.js.map