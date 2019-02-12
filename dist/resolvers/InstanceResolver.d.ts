import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Context from '../framework/Context';
import Resolver from '../resolvers/Resolver';
import Forge from '../Forge';
declare class InstanceResolver extends Resolver {
    instance: any;
    constructor(forge: Forge, binding: Binding, instance: any);
    resolve(context: Context, args: Arguments): any;
    toString(): string;
}
export default InstanceResolver;
