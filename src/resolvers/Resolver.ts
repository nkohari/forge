import Arguments from '../framework/Arguments';
import Binding from '../framework/Binding';
import Context from '../framework/Context';
import Dependency from '../framework/Dependency';
import ensure from '../util/ensure';
import Forge from '../Forge';

abstract class Resolver {
  dependencies: Dependency[];
  protected binding: Binding;
  protected forge: Forge;

  constructor(forge: Forge, binding: Binding) {
    ensure('forge', forge);
    ensure('binding', binding);
    this.forge = forge;
    this.binding = binding;
  }

  abstract resolve(context: Context, args: Arguments): any;

  protected resolveDependencies(context: Context, dependencies: Dependency[], args: Arguments): any {
    return dependencies.map(dep => {
      if (dep.name === 'forge') return this.forge;
      if (args && args[dep.name]) return args[dep.name];
      if (this.binding.arguments[dep.name]) return this.binding.arguments[dep.name];
      return this.forge.resolve(dep.name, context, dep.hint, null, dep.mode);
    });
  }
}

export default Resolver;
