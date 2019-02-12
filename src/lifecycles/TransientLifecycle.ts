import Arguments from '../framework/Arguments';
import Context from '../framework/Context';
import Lifecycle from '../lifecycles/Lifecycle';
import Resolver from '../resolvers/Resolver';
import ensure from '../util/ensure';

class TransientLifecycle implements Lifecycle {
  resolve(resolver: Resolver, context: Context, args: Arguments) {
    ensure('resolver', resolver);
    ensure('context', context);
    return resolver.resolve(context, args);
  }

  toString() {
    return 'transient';
  }
}

export default TransientLifecycle;
