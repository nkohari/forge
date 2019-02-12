import Arguments from '../framework/Arguments';
import Context from '../framework/Context';
import Lifecycle from '../lifecycles/Lifecycle';
import Resolver from '../resolvers/Resolver';
declare class TransientLifecycle implements Lifecycle {
    resolve(resolver: Resolver, context: Context, args: Arguments): any;
    toString(): string;
}
export default TransientLifecycle;
