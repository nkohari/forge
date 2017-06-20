import ensure from '../util/ensure';
import Resolver from './Resolver';

class FunctionResolver extends Resolver {

  constructor(forge, binding, func) {
    super(forge, binding);
    ensure('func', func);
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

export default FunctionResolver;
