import Arguments from './framework/Arguments';
import Binding from './framework/Binding';
import Config from './framework/Config';
import Context from './framework/Context';
import Mode from './framework/Mode';
import Inspector from './inspectors/Inspector';
declare class Forge {
    bindings: {
        [name: string]: Binding[];
    };
    inspector: Inspector;
    constructor(config?: Config);
    bind(name: string): Binding;
    unbind(name: string): number;
    rebind(name: string): Binding;
    get<T = any>(name: string, hint?: any, args?: Arguments): T;
    getOne<T = any>(name: string, hint?: any, args?: Arguments): T;
    getAll<T = any>(name: string, args?: Arguments): T[];
    resolve(name: string, context: Context, hint: any, args: Arguments, mode?: Mode): any;
    inspect(): string;
    private getMatchingBindings;
}
export default Forge;
