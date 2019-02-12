import Binding from './Binding';
declare class Context {
    bindings: Binding[];
    constructor();
    has(binding: Binding): boolean;
    push(binding: Binding): number;
    pop(): Binding;
    toString(indent?: number): string;
}
export default Context;
