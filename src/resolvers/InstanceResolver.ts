import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
import ensure from '../util/ensure';
import Forge from '../Forge';

class InstanceResolver extends Resolver {
  instance: any;

  constructor(forge: Forge, binding: Binding, instance: any) {
    super(forge, binding);
    ensure('instance', instance);
    this.instance = instance;
    this.dependencies = [];
  }

  resolve(context: Context, args: Arguments) {
    return this.instance;
  }

  toString() {
    if (!this.instance) {
      return '<unknown instance>';
    } else if (this.instance.constructor && this.instance.constructor.name) {
      return `an instance of ${this.instance.constructor.name}`;
    } else {
      return `an instance of ${typeof this.instance}`;
    }
  }
}

export default InstanceResolver;
