import util from 'util';

class ResolutionError extends Error {

  constructor(name, hint, context, message) {
    super();

    const lines = [];
    lines.push(`Could not resolve component named ${name}: ${message}`);
    if (hint != null) {
      lines.push('  With resolution hint:');
      lines.push(`    ${util.inspect(hint)}`);
    }
    lines.push('  In resolution context:');
    lines.push(context.toString());
    lines.push('  ---');
    this.message = lines.join('\n');
  }

  toString() {
    return this.message;
  }

}

export default ResolutionError;
