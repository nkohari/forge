import ensure from '../util/ensure';
import Lifecycle from './Lifecycle';

class SingletonLifecycle extends Lifecycle {

  constructor() {
    super();
    this.instance = null;
  }

  resolve(resolver, context, args) {
    ensure('resolver', resolver);
    ensure('context', context);
    if (this.instance === null) {
      this.instance = resolver.resolve(context, args);
    }
    return this.instance;
  }

  toString() {
    return 'singleton';
  }

}

export default SingletonLifecycle;
