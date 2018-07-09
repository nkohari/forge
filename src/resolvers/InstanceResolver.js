import ensure from '../util/ensure';
import Resolver from './Resolver';

class InstanceResolver extends Resolver {

  constructor(forge, binding, instance) {
    super(forge, binding);
    ensure('instance', instance);
    this.instance = instance;
    this.dependencies = [];
  }

  resolve(context, contextualArgs) {
    return this.instance;
  }

  toString() {
    if (!this.instance) {
      return '<unknown instance>';
    } else if (this.instance.constructor && this.instance.constructor.name) {
      return `an instance of ${this.instance.constructor.name}`;
    } else {
      return `an instance of ${typeof(this.instance)}`;
    }
  }

}

export default InstanceResolver;
