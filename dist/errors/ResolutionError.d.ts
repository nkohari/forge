import Context from '../framework/Context';
declare class ResolutionError extends Error {
    constructor(name: string, hint: any, context: Context, message: string);
    toString(): string;
}
export default ResolutionError;
