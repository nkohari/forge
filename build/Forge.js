'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('./util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _Binding = require('./Binding');

var _Binding2 = _interopRequireDefault(_Binding);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Inspector = require('./Inspector');

var _Inspector2 = _interopRequireDefault(_Inspector);

var _ResolutionError = require('./errors/ResolutionError');

var _ResolutionError2 = _interopRequireDefault(_ResolutionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Forge {

  constructor(config = {}) {
    this.bindings = {};
    this.inspector = config.inspector || new _Inspector2.default();
  }

  bind(name) {
    (0, _ensure2.default)('name', name);
    const binding = new _Binding2.default(this, name);
    const list = this.bindings[name] ? this.bindings[name] : this.bindings[name] = [];
    list.push(binding);
    return binding;
  }

  unbind(name) {
    (0, _ensure2.default)('name', name);
    const count = this.bindings[name] != null ? this.bindings[name].length : 0;
    this.bindings[name] = [];
    return count;
  }

  rebind(name) {
    (0, _ensure2.default)('name', name);
    this.unbind(name);
    return this.bind(name);
  }

  get(name, hint, args) {
    (0, _ensure2.default)('name', name);
    return this.resolve(name, new _Context2.default(), hint, false, args);
  }

  getOne(name, hint, args) {
    (0, _ensure2.default)('name', name);
    const context = new _Context2.default();
    const bindings = this.getMatchingBindings(name, hint);
    if (bindings.length === 0) {
      throw new _ResolutionError2.default(name, hint, context, 'No matching bindings were available');
    }
    if (bindings.length !== 1) {
      throw new _ResolutionError2.default(name, hint, context, 'Multiple matching bindings were available');
    }
    return this.resolveBindings(context, bindings, hint, args, false);
  }

  getAll(name, args) {
    (0, _ensure2.default)('name', name);
    const context = new _Context2.default();
    const bindings = this.bindings[name];
    if (!bindings || bindings.length === 0) {
      throw new _ResolutionError2.default(name, undefined, context, 'No matching bindings were available');
    }
    return this.resolveBindings(context, bindings, undefined, args, true);
  }

  create(type, args) {
    (0, _ensure2.default)('type', type);
    const context = new _Context2.default();
    const binding = new _Binding2.default(this, type.constructor.name).type(type);
    return this.resolveBindings(context, [binding], undefined, args, false);
  }

  getMatchingBindings(name, hint) {
    (0, _ensure2.default)('name', name);
    if (!this.bindings[name]) {
      return [];
    } else {
      return this.bindings[name].filter(binding => binding.matches(hint));
    }
  }

  resolve(name, context, hint, all, args) {
    (0, _ensure2.default)('name', name);

    if (context == null) context = new _Context2.default();
    const bindings = all ? this.bindings[name] : this.getMatchingBindings(name, hint);

    if (!bindings || bindings.length === 0) {
      throw new _ResolutionError2.default(name, hint, context, 'No matching bindings were available');
    }

    return this.resolveBindings(context, bindings, hint, args, all);
  }

  resolveBindings(context, bindings, hint, args, all) {
    const results = bindings.map(binding => binding.resolve(context, hint, args));
    if (!all && results.length === 1) {
      return results[0];
    } else {
      return results;
    }
  }

  inspect() {
    const lines = [];
    Object.keys(this.bindings).forEach(name => {
      this.bindings[name].forEach(binding => {
        lines.push(binding.toString());
      });
    });
    return lines.join('\n');
  }

}

exports.default = Forge;
//# sourceMappingURL=Forge.js.map