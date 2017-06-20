'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('../util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _Resolver = require('./Resolver');

var _Resolver2 = _interopRequireDefault(_Resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InstanceResolver extends _Resolver2.default {

  constructor(forge, binding, instance) {
    super(forge, binding);
    (0, _ensure2.default)('instance', instance);
    this.instance = instance;
    this.dependencies = [];
  }

  resolve(context, contextualArgs) {
    return this.instance;
  }

  toString() {
    if (!this.instance) {
      return '<unknown instance>';
    } else if ((this.instance.constructor != null ? this.instance.constructor.name : undefined) != null) {
      return `an instance of ${this.instance.constructor.name}`;
    } else {
      return `an instance of ${typeof this.instance}`;
    }
  }

}

exports.default = InstanceResolver;
//# sourceMappingURL=InstanceResolver.js.map