'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('./util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _FunctionResolver = require('./resolvers/FunctionResolver');

var _FunctionResolver2 = _interopRequireDefault(_FunctionResolver);

var _InstanceResolver = require('./resolvers/InstanceResolver');

var _InstanceResolver2 = _interopRequireDefault(_InstanceResolver);

var _TypeResolver = require('./resolvers/TypeResolver');

var _TypeResolver2 = _interopRequireDefault(_TypeResolver);

var _SingletonLifecycle = require('./lifecycles/SingletonLifecycle');

var _SingletonLifecycle2 = _interopRequireDefault(_SingletonLifecycle);

var _TransientLifecycle = require('./lifecycles/TransientLifecycle');

var _TransientLifecycle2 = _interopRequireDefault(_TransientLifecycle);

var _ConfigurationError = require('./errors/ConfigurationError');

var _ConfigurationError2 = _interopRequireDefault(_ConfigurationError);

var _ResolutionError = require('./errors/ResolutionError');

var _ResolutionError2 = _interopRequireDefault(_ResolutionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Binding {

  constructor(forge, name) {
    (0, _ensure2.default)('forge', forge);
    (0, _ensure2.default)('name', name);
    this.forge = forge;
    this.name = name;
    this.lifecycle = new _SingletonLifecycle2.default(); // default
    this.arguments = {};
  }

  type(target) {
    (0, _ensure2.default)('target', target);
    this.resolver = new _TypeResolver2.default(this.forge, this, target);
    return this;
  }

  function(target) {
    (0, _ensure2.default)('target', target);
    this.resolver = new _FunctionResolver2.default(this.forge, this, target);
    return this;
  }

  instance(target) {
    (0, _ensure2.default)('target', target);
    this.resolver = new _InstanceResolver2.default(this.forge, this, target);
    return this;
  }

  singleton() {
    this.lifecycle = new _SingletonLifecycle2.default();
    return this;
  }

  transient() {
    this.lifecycle = new _TransientLifecycle2.default();
    return this;
  }

  with(args) {
    (0, _ensure2.default)('args', args);
    this.arguments = args;
    return this;
  }

  when(condition) {
    (0, _ensure2.default)('condition', condition);
    if (condition instanceof Function) {
      this.predicate = condition;
    } else {
      this.predicate = hint => hint == condition;
    }
    return this;
  }

  matches(hint) {
    return this.predicate ? this.predicate(hint) : true;
  }

  resolve(context, hint, args = {}) {
    (0, _ensure2.default)('context', context);

    if (this.lifecycle == null) {
      throw new _ConfigurationError2.default(this.name, 'No lifecycle defined');
    }

    if (this.resolver == null) {
      throw new _ConfigurationError2.default(this.name, 'No resolver defined');
    }

    if (context.has(this)) {
      throw new _ResolutionError2.default(this.name, hint, context, 'Circular dependencies detected');
    }

    context.push(this);
    const result = this.lifecycle.resolve(this.resolver, context, args);
    context.pop();

    return result;
  }

  toString() {
    const tokens = [];
    if (this.predicate) {
      tokens.push('(conditional)');
    }

    tokens.push(this.name);
    tokens.push('->');
    tokens.push(this.resolver ? this.resolver.toString() : '<undefined resolver>');
    tokens.push(`(${this.lifecycle.toString()})`);

    if (this.resolver && this.resolver.dependencies && this.resolver.dependencies.length > 0) {
      const deps = this.resolver.dependencies.map(dep => dep.hint ? `${dep.name}:${dep.hint}` : dep.name);
      tokens.push(`depends on: [${deps.join(', ')}]`);
    }

    return tokens.join(' ');
  }

}

// <binding>.to.type() and <binding>.as.singleton() are really just syntactic sugar.
const sweeten = function sweeten(type, property) {
  return Object.defineProperty(type.prototype, property, {
    get() {
      return this;
    }
  });
};

sweeten(Binding, 'to');
sweeten(Binding, 'as');

exports.default = Binding;
//# sourceMappingURL=Binding.js.map