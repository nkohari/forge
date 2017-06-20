'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('../util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Resolver {

  constructor(forge, binding) {
    (0, _ensure2.default)('forge', forge);
    (0, _ensure2.default)('binding', binding);
    this.forge = forge;
    this.binding = binding;
  }

  resolve(context, args) {
    throw new Error(`You must implement resolve() on ${this.constructor.name}`);
  }

  resolveDependencies(context, dependencies, args) {
    return dependencies.map(dep => {
      if (dep.name === 'forge') return this.forge;
      if (args[dep.name]) return args[dep.name];
      if (this.binding.arguments[dep.name]) return this.binding.arguments[dep.name];
      return this.forge.resolve(dep.name, context, dep.hint, dep.all);
    });
  }

}

exports.default = Resolver;
//# sourceMappingURL=Resolver.js.map