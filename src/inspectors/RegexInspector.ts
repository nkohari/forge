import Constructor from '../framework/Constructor';
import Dependency from '../framework/Dependency';
import { HINT_PROPERTY } from '../framework/inject';
import Mode from '../framework/Mode';
import Inspector from '../inspectors/Inspector';
import ensure from '../util/ensure';

class RegexInspector implements Inspector {
  getDependencies(func: Function): Dependency[] {
    ensure('func', func);
    const params = this.getParameterNames(func);
    const hints = (func as any)[HINT_PROPERTY];
    return params.map(name => {
      if (hints && hints[name]) {
        return hints[name];
      } else {
        return { name, mode: Mode.AtLeastOne, hint: undefined };
      }
    });
  }

  findConstructor(type: Constructor): Constructor {
    let candidate = type;
    while (candidate !== Function.prototype) {
      if (this.getParameterNames(candidate).length > 0) {
        return candidate;
      }
      candidate = Object.getPrototypeOf(candidate);
    }
    return type;
  }

  private getParameterNames(func: Function) {
    const regex = /(?:function|constructor)[ A-Za-z0-9]*\(([^)]*)/g;
    const matches = regex.exec(func.toString());

    if (matches == null || matches[1].length === 0) {
      return [];
    }

    return matches[1].split(/\s*,\s*/);
  }
}

export default RegexInspector;
