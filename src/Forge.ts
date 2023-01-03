import ResolutionError from './errors/ResolutionError';
import Arguments from './framework/Arguments';
import Binding from './framework/Binding';
import Config from './framework/Config';
import Context from './framework/Context';
import Mode from './framework/Mode';
import Inspector from './inspectors/Inspector';
import RegexInspector from './inspectors/RegexInspector';
import ensure from './util/ensure';

class Forge {
  bindings: { [name: string]: Binding[] };
  inspector: Inspector;

  constructor(config: Config = {}) {
    this.bindings = {};
    this.inspector = config.inspector || new RegexInspector();
  }

  bind<T = unknown>(name: string): Binding<T> {
    ensure('name', name);
    const binding = new Binding(this, name);
    const list = this.bindings[name] ? this.bindings[name] : (this.bindings[name] = []);
    list.push(binding);
    return binding as Binding<T>;
  }

  unbind(name: string): number {
    ensure('name', name);
    const count = this.bindings[name] != null ? this.bindings[name].length : 0;
    this.bindings[name] = [];
    return count;
  }

  rebind(name: string): Binding {
    ensure('name', name);
    this.unbind(name);
    return this.bind(name);
  }

  get<T = unknown>(name: string, hint: any = null, args: Arguments = null): T {
    ensure('name', name);
    return this.resolve(name, new Context(), hint, args, Mode.AtLeastOne) as T;
  }

  getOne<T = unknown>(name: string, hint: any = null, args: Arguments = null): T {
    ensure('name', name);
    return this.resolve(name, new Context(), hint, args, Mode.AtMostOne) as T;
  }

  getAll<T = unknown>(name: string, args: Arguments = null): T[] {
    ensure('name', name);
    return this.resolve(name, new Context(), undefined, args, Mode.All) as T[];
  }

  resolve(name: string, context: Context, hint: any, args: Arguments, mode: Mode = Mode.AtLeastOne): unknown {
    ensure('name', name);

    let bindings: Binding[];
    if (mode === Mode.All) {
      bindings = this.bindings[name];
    } else {
      bindings = this.getMatchingBindings(name, hint);
    }

    if (!bindings || bindings.length === 0) {
      throw new ResolutionError(name, hint, context, 'No matching bindings were available');
    }
    if (mode == Mode.AtMostOne && bindings.length !== 1) {
      throw new ResolutionError(name, hint, context, 'Multiple matching bindings were available');
    }

    const results = bindings.map(binding => binding.resolve(context, hint, args));

    if (mode !== Mode.All && results.length === 1) {
      return results[0];
    } else {
      return results;
    }
  }

  inspect(): string {
    const lines = [];
    Object.keys(this.bindings).forEach(name => {
      this.bindings[name].forEach(binding => {
        lines.push(binding.toString());
      });
    });
    return lines.join('\n');
  }

  private getMatchingBindings(name: string, hint?: string): Binding[] {
    ensure('name', name);
    if (!this.bindings[name]) {
      return [];
    } else {
      return this.bindings[name].filter(binding => binding.matches(hint));
    }
  }
}

export default Forge;
