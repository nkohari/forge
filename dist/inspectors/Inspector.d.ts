import Constructor from '../framework/Constructor';
import Dependency from '../framework/Dependency';
interface Inspector {
    getDependencies(func: Function): Dependency[];
    findConstructor(func: Constructor): Constructor;
}
export default Inspector;
