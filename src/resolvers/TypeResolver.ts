import ConfigurationError from '../errors/ConfigurationError';
import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Constructor from '../framework/Constructor';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
import ensure from '../util/ensure';
import Forge from '../Forge';

class TypeResolver extends Resolver {
  type: Constructor;

  constructor(forge: Forge, binding: Binding, type: Constructor) {
    super(forge, binding);
    ensure('type', type);
    this.type = type;

    const constructor = this.forge.inspector.findConstructor(this.type);
    if (!constructor) {
      throw new ConfigurationError(binding.name, `Cannot resolve constructor to inject for ${this.type.name}`);
    }

    this.dependencies = this.forge.inspector.getDependencies(constructor);
  }

  resolve(context: Context, args: Arguments) {
    const callArguments = this.resolveDependencies(context, this.dependencies, args);
    return new this.type(...callArguments);
  }

  toString() {
    return `type{${this.type.name}}`;
  }
}

export default TypeResolver;
