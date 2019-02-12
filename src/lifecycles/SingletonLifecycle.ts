import Arguments from '../framework/Arguments';
import Context from '../framework/Context';
import Lifecycle from '../lifecycles/Lifecycle';
import Resolver from '../resolvers/Resolver';
import ensure from '../util/ensure';

class SingletonLifecycle implements Lifecycle {
  instance: any;

  constructor() {
    this.instance = null;
  }

  resolve(resolver: Resolver, context: Context, args: Arguments): any {
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
