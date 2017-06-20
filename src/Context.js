class Context {

  constructor() {
    this.bindings = [];
  }

  has(binding) {
    return this.bindings.indexOf(binding) !== -1;
  }

  push(binding) {
    return this.bindings.push(binding);
  }

  pop() {
    return this.bindings.pop();
  }

  toString(indent = 4) {
    const spaces = Array(indent + 1).join(' ');
    const lines = this.bindings.map((binding, index) => `${spaces}${index+1}: ${binding.toString()}`);
    return lines.reverse().join('\n');
  }

}

export default Context;
