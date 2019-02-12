import Constructor from '../framework/Constructor';
import Dependency from '../framework/Dependency';
import Inspector from '../inspectors/Inspector';
declare class RegexInspector implements Inspector {
    getDependencies(func: Function): Dependency[];
    findConstructor(type: Constructor): Constructor;
    private getParameterNames;
}
export default RegexInspector;
