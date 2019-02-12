import Arguments from '../framework/Arguments';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
interface Lifecycle {
    resolve(resolver: Resolver, context: Context, args: Arguments): any;
}
export default Lifecycle;
