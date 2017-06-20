import ensure from './util/ensure';

class Inspector {

  getDependencies(func) {
    ensure('func', func);
    const params = this.getParameterNames(func);
    const hints = this.getDependencyHints(func);
    return params.map(param => hints[param] || { name: param, all: false, hint: undefined });
  }

  getParameterNames(func) {
    ensure('func', func);

    const regex = /(?:function|constructor)[ A-Za-z0-9]*\(([^)]*)/g;
    const matches = regex.exec(func.toString());

    if (matches == null || matches[1].length === 0) {
      return [];
    }

    const args = matches[1].split(/[,\s]+/);

    if (this.unmangleNames) {
      return args.map(arg => arg.replace(/\d+$/, ''));
    } else {
      return args;
    }
  }

  getDependencyHints(func) {
    ensure('func', func);

    const regex = /"(.*?)\s*->\s*(all)?\s*(.*?)";/gi;
    const hints = {};

    let match;
    while (match = regex.exec(func.toString())) {
      const [pattern, argument, allString, dependency] = Array.from(match);
      const all = allString != null;
      if (dependency.indexOf(':')) {
        const [name, hint] = Array.from(dependency.split(/\s*:\s*/, 2));
        hints[argument] = { name, all, hint };
      } else {
        hints[argument] = { name: dependency, all, hint: undefined };
      }
    }

    return hints;
  }

  findConstructor(type) {
    ensure('type', type);

    let candidate = type;
    while (candidate !== Function.prototype) {
      if (this.getParameterNames(candidate).length > 0) {
        return candidate;
      }
      candidate = Object.getPrototypeOf(candidate);
    }

    return type;
  }

}

export default Inspector;
