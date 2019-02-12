import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
import Forge from '../Forge';
declare class FunctionResolver extends Resolver {
    func: Function;
    constructor(forge: Forge, binding: Binding, func: Function);
    resolve(context: Context, args: Arguments): any;
    toString(): string;
}
export default FunctionResolver;
