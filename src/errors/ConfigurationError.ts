class ConfigurationError extends Error {
  constructor(name: string, message: string) {
    super();
    this.message = `The binding for component named ${name} is misconfigured: ${message}`;
  }

  toString() {
    return this.message;
  }
}

export default ConfigurationError;
