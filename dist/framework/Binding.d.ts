import Lifecycle from '../lifecycles/Lifecycle';
import Resolver from '../resolvers/Resolver';
import Forge from '../Forge';
import Constructor from './Constructor';
import Predicate from './Predicate';
declare class Binding {
    forge: Forge;
    name: string;
    lifecycle: Lifecycle;
    resolver: Resolver;
    predicate: Predicate;
    arguments: {
        [name: string]: any;
    };
    constructor(forge: Forge, name: string);
    type(target: Constructor): this;
    function(target: Function): this;
    instance(target: any): this;
    singleton(): this;
    transient(): this;
    with(args: any): this;
    when(condition: Predicate | any): this;
    readonly to: this;
    readonly as: this;
    matches(hint: any): boolean;
    resolve(context: any, hint: any, args?: {}): any;
    toString(): string;
}
export default Binding;
