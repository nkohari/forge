"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

class ConfigurationError extends _extendableBuiltin(Error) {

  constructor(name, message) {
    super();
    this.message = `The binding for component named ${name} is misconfigured: ${message}`;
  }

  toString() {
    return this.message;
  }

}

exports.default = ConfigurationError;
//# sourceMappingURL=ConfigurationError.js.map