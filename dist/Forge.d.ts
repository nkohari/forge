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
    bind<T = unknown>(name: string): Binding<T>;
    unbind(name: string): number;
    rebind(name: string): Binding;
    get<T = unknown>(name: string, hint?: any, args?: Arguments): T;
    getOne<T = unknown>(name: string, hint?: any, args?: Arguments): T;
    getAll<T = unknown>(name: string, args?: Arguments): T[];
    resolve(name: string, context: Context, hint: any, args: Arguments, mode?: Mode): unknown;
    inspect(): string;
    private getMatchingBindings;
}
export default Forge;
