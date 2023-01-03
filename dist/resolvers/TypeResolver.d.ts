import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Constructor from '../framework/Constructor';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
import Forge from '../Forge';
declare class TypeResolver extends Resolver {
    type: Constructor;
    constructor(forge: Forge, binding: Binding, type: Constructor);
    resolve(context: Context, args: Arguments): unknown;
    toString(): string;
}
export default TypeResolver;
