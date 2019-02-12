import Binding from './Binding';

class Context {
  bindings: Binding[];

  constructor() {
    this.bindings = [];
  }

  has(binding: Binding): boolean {
    return this.bindings.indexOf(binding) !== -1;
  }

  push(binding: Binding): number {
    return this.bindings.push(binding);
  }

  pop(): Binding {
    return this.bindings.pop();
  }

  toString(indent: number = 4): string {
    const spaces = Array(indent + 1).join(' ');
    const lines = this.bindings.map((binding, index) => `${spaces}${index + 1}: ${binding.toString()}`);
    return lines.reverse().join('\n');
  }
}

export default Context;
