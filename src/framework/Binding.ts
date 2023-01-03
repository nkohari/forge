import ConfigurationError from '../errors/ConfigurationError';
import ResolutionError from '../errors/ResolutionError';
import Lifecycle from '../lifecycles/Lifecycle';
import SingletonLifecycle from '../lifecycles/SingletonLifecycle';
import TransientLifecycle from '../lifecycles/TransientLifecycle';
import Resolver from '../resolvers/Resolver';
import FunctionResolver from '../resolvers/FunctionResolver';
import InstanceResolver from '../resolvers/InstanceResolver';
import TypeResolver from '../resolvers/TypeResolver';
import ensure from '../util/ensure';
import Forge from '../Forge';
import Arguments from './Arguments';
import Constructor from './Constructor';
import Context from './Context';
import Predicate from './Predicate';

class Binding<T = unknown> {
  forge: Forge;
  name: string;
  lifecycle: Lifecycle;
  resolver: Resolver;
  predicate: Predicate;
  arguments: { [name: string]: any };

  constructor(forge: Forge, name: string) {
    ensure('forge', forge);
    ensure('name', name);
    this.forge = forge;
    this.name = name;
    this.lifecycle = new SingletonLifecycle();
    this.arguments = {};
  }

  type(target: Constructor<T>) {
    ensure('target', target);
    this.resolver = new TypeResolver(this.forge, this, target);
    return this;
  }

  function(target: (...args: any[]) => T) {
    ensure('target', target);
    this.resolver = new FunctionResolver(this.forge, this, target);
    return this;
  }

  instance(target: T) {
    ensure('target', target);
    this.resolver = new InstanceResolver(this.forge, this, target);
    return this;
  }

  singleton() {
    this.lifecycle = new SingletonLifecycle();
    return this;
  }

  transient() {
    this.lifecycle = new TransientLifecycle();
    return this;
  }

  with(args: Arguments) {
    ensure('args', args);
    this.arguments = args;
    return this;
  }

  when(condition: Predicate | any) {
    ensure('condition', condition);
    if (condition instanceof Function) {
      this.predicate = condition;
    } else {
      this.predicate = hint => hint == condition;
    }
    return this;
  }

  get to() {
    return this;
  }

  get as() {
    return this;
  }

  matches(hint: any) {
    return this.predicate ? this.predicate(hint) : true;
  }

  resolve(context: Context, hint: any, args: Arguments = {}): T {
    ensure('context', context);

    if (this.lifecycle == null) {
      throw new ConfigurationError(this.name, 'No lifecycle defined');
    }

    if (this.resolver == null) {
      throw new ConfigurationError(this.name, 'No resolver defined');
    }

    if (context.has(this)) {
      throw new ResolutionError(this.name, hint, context, 'Circular dependencies detected');
    }

    context.push(this);
    const result = this.lifecycle.resolve(this.resolver, context, args);
    context.pop();

    return result;
  }

  toString() {
    const tokens = [];
    if (this.predicate) {
      tokens.push('(conditional)');
    }

    tokens.push(this.name);
    tokens.push('->');
    tokens.push(this.resolver ? this.resolver.toString() : '<undefined resolver>');
    tokens.push(`(${this.lifecycle.toString()})`);

    if (this.resolver && this.resolver.dependencies && this.resolver.dependencies.length > 0) {
      const deps = this.resolver.dependencies.map(dep => (dep.hint ? `${dep.name}:${dep.hint}` : dep.name));
      tokens.push(`depends on: [${deps.join(', ')}]`);
    }

    return tokens.join(' ');
  }
}

export default Binding;
