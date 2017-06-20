import ensure from '../util/ensure';

class Resolver {

  constructor(forge, binding) {
    ensure('forge', forge);
    ensure('binding', binding);
    this.forge = forge;
    this.binding = binding;
  }

  resolve(context, args) {
    throw new Error(`You must implement resolve() on ${this.constructor.name}`);
  }

  resolveDependencies(context, dependencies, args) {
    return dependencies.map(dep => {
      if (dep.name === 'forge') return this.forge;
      if (args[dep.name]) return args[dep.name];
      if (this.binding.arguments[dep.name]) return this.binding.arguments[dep.name];
      return this.forge.resolve(dep.name, context, dep.hint, dep.all);
    });
  }

}

export default Resolver;
