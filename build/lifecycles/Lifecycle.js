"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Lifecycle {

  resolve(resolver, context, args) {
    throw new Error(`You must implement resolve() on ${this.constructor.name}`);
  }

}

exports.default = Lifecycle;
//# sourceMappingURL=Lifecycle.js.map