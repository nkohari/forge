"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensure;
function ensure(name, value) {
  if (value == null) throw new Error(`The argument "${name}" must have a value.`);
}
//# sourceMappingURL=ensure.js.map