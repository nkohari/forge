declare class ConfigurationError extends Error {
    constructor(name: string, message: string);
    toString(): string;
}
export default ConfigurationError;
