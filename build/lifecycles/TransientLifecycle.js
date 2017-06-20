'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('../util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _Lifecycle = require('./Lifecycle');

var _Lifecycle2 = _interopRequireDefault(_Lifecycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransientLifecycle extends _Lifecycle2.default {

  resolve(resolver, context, args) {
    (0, _ensure2.default)('resolver', resolver);
    (0, _ensure2.default)('context', context);
    return resolver.resolve(context, args);
  }

  toString() {
    return 'transient';
  }

}

exports.default = TransientLifecycle;
//# sourceMappingURL=TransientLifecycle.js.map