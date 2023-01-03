import Lifecycle from '../lifecycles/Lifecycle';
import Resolver from '../resolvers/Resolver';
import Forge from '../Forge';
import Arguments from './Arguments';
import Constructor from './Constructor';
import Context from './Context';
import Predicate from './Predicate';
declare class Binding<T = unknown> {
    forge: Forge;
    name: string;
    lifecycle: Lifecycle;
    resolver: Resolver;
    predicate: Predicate;
    arguments: {
        [name: string]: any;
    };
    constructor(forge: Forge, name: string);
    type(target: Constructor<T>): this;
    function(target: (...args: any[]) => T): this;
    instance(target: T): this;
    singleton(): this;
    transient(): this;
    with(args: Arguments): this;
    when(condition: Predicate | any): this;
    readonly to: this;
    readonly as: this;
    matches(hint: any): boolean;
    resolve(context: Context, hint: any, args?: Arguments): T;
    toString(): string;
}
export default Binding;
