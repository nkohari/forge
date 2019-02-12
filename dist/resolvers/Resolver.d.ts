import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Context from '../framework/Context';
import Dependency from '../framework/Dependency';
import Forge from '../Forge';
declare abstract class Resolver {
    dependencies: Dependency[];
    protected binding: Binding;
    protected forge: Forge;
    constructor(forge: Forge, binding: Binding);
    abstract resolve(context: Context, args: Arguments): any;
    protected resolveDependencies(context: Context, dependencies: Dependency[], args: Arguments): any;
}
export default Resolver;
