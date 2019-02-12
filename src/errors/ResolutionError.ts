import Context from '../framework/Context';

class ResolutionError extends Error {
  constructor(name: string, hint: any, context: Context, message: string) {
    super();

    const lines = [];
    lines.push(`Could not resolve component named ${name}: ${message}`);
    if (hint) {
      lines.push('  With resolution hint:');
      lines.push(`    ${hint}`);
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
