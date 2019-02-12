import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
import ensure from '../util/ensure';
import Forge from '../Forge';

class FunctionResolver extends Resolver {
  func: Function;

  constructor(forge: Forge, binding: Binding, func: Function) {
    super(forge, binding);
    ensure('func', func);
    this.func = func;
    this.dependencies = this.forge.inspector.getDependencies(this.func);
  }

  resolve(context: Context, args: Arguments) {
    const callArguments = this.resolveDependencies(context, this.dependencies, args);
    return this.func(...callArguments);
  }

  toString() {
    return 'function';
  }
}

export default FunctionResolver;
