import ensure from './util/ensure';
import Binding from './Binding';
import Context from './Context';
import Inspector from './Inspector';
import ConfigurationError from './errors/ConfigurationError';
import ResolutionError from './errors/ResolutionError';

class Forge {

  constructor(config = {}) {
    this.bindings = {};
    this.unmangleNames = (config.unmangleNames != null) ? config.unmangleNames : true;
    this.inspector = config.inspector || new Inspector(this.unmangleNames);
  }

  bind(name) {
    ensure('name', name);
    if (!this.validateName(name)) {
      throw new ConfigurationError(name, 'Invalid name for binding');
    }
    const binding = new Binding(this, name);
    const list = this.bindings[name] ? this.bindings[name] : (this.bindings[name] = []);
    list.push(binding);
    return binding;
  }

  unbind(name) {
    ensure('name', name);
    const count = (this.bindings[name] != null) ? this.bindings[name].length : 0;
    this.bindings[name] = [];
    return count;
  }

  rebind(name) {
    ensure('name', name);
    this.unbind(name);
    return this.bind(name);
  }

  get(name, hint, args) {
    ensure('name', name);
    return this.resolve(name, new Context(), hint, false, args);
  }

  getOne(name, hint, args) {
    ensure('name', name);
    const context = new Context();
    const bindings = this.getMatchingBindings(name, hint);
    if (bindings.length === 0) {
      throw new ResolutionError(name, hint, context, 'No matching bindings were available');
    }
    if (bindings.length !== 1) {
      throw new ResolutionError(name, hint, context, 'Multiple matching bindings were available');
    }
    return this.resolveBindings(context, bindings, hint, args, false);
  }

  getAll(name, args) {
    ensure('name', name);
    const context = new Context();
    const bindings = this.bindings[name];
    if (!bindings || bindings.length === 0) {
      throw new ResolutionError(name, undefined, context, 'No matching bindings were available');
    }
    return this.resolveBindings(context, bindings, undefined, args, true);
  }

  create(type, args) {
    ensure('type', type);
    const context = new Context();
    const binding = new Binding(this, type.constructor.name).type(type);
    return this.resolveBindings(context, [binding], undefined, args, false);
  }

  getMatchingBindings(name, hint) {
    ensure('name', name);
    if (!this.bindings[name]) {
      return [];
    } else {
      return this.bindings[name].filter(binding => binding.matches(hint));
    }
  }

  resolve(name, context, hint, all, args) {
    ensure('name', name);

    if (context == null) context = new Context();
    const bindings = all ? this.bindings[name] : this.getMatchingBindings(name, hint);

    if (!bindings || bindings.length === 0) {
      throw new ResolutionError(name, hint, context, 'No matching bindings were available');
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

  validateName(name) {
    if (this.unmangleNames) {
      return /[^\d]$/.test(name);
    } else {
      return true;
    }
  }
}

export default Forge;
