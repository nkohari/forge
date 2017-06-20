'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('../util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _ConfigurationError = require('../errors/ConfigurationError');

var _ConfigurationError2 = _interopRequireDefault(_ConfigurationError);

var _Resolver = require('./Resolver');

var _Resolver2 = _interopRequireDefault(_Resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TypeResolver extends _Resolver2.default {

  constructor(forge, binding, type) {
    super(forge, binding);
    (0, _ensure2.default)('type', type);
    this.type = type;

    const constructor = this.forge.inspector.findConstructor(this.type);
    if (!constructor) {
      throw new _ConfigurationError2.default(binding.name, `Cannot resolve constructor to inject for ${this.type.name}`);
    }

    this.dependencies = this.forge.inspector.getDependencies(constructor);
  }

  resolve(context, args) {
    const callArguments = this.resolveDependencies(context, this.dependencies, args);
    return new this.type(...callArguments);
  }

  toString() {
    return `type{${this.type.name}}`;
  }

}

exports.default = TypeResolver;
//# sourceMappingURL=TypeResolver.js.map