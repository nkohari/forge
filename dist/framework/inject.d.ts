import Dependency from './Dependency';
export declare const HINT_PROPERTY = "__FORGE_DEPENDENCY_HINTS__";
declare function inject<T = any>(hints: {
    [name: string]: string | Partial<Dependency>;
}): (target: T) => T;
export default inject;
