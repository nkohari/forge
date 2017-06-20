import ensure from '../util/ensure';
import Lifecycle from './Lifecycle';

class TransientLifecycle extends Lifecycle {

  resolve(resolver, context, args) {
    ensure('resolver', resolver);
    ensure('context', context);
    return resolver.resolve(context, args);
  }

  toString() {
    return 'transient';
  }

}

export default TransientLifecycle;
