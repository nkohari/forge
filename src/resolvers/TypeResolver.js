import ensure from '../util/ensure';
import ConfigurationError from '../errors/ConfigurationError';
import Resolver from './Resolver';

class TypeResolver extends Resolver {

  constructor(forge, binding, type) {
    super(forge, binding);
    ensure('type', type);
    this.type = type;

    const constructor = this.forge.inspector.findConstructor(this.type);
    if (!constructor) {
      throw new ConfigurationError(binding.name, `Cannot resolve constructor to inject for ${this.type.name}`);
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

export default TypeResolver;
