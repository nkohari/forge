import Arguments from '../framework/Arguments';
import Context from '../framework/Context';
import Lifecycle from '../lifecycles/Lifecycle';
import Resolver from '../resolvers/Resolver';
declare class SingletonLifecycle implements Lifecycle {
    instance: any;
    constructor();
    resolve(resolver: Resolver, context: Context, args: Arguments): any;
    toString(): string;
}
export default SingletonLifecycle;
