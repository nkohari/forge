'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ensure = require('../util/ensure');

var _ensure2 = _interopRequireDefault(_ensure);

var _Lifecycle = require('./Lifecycle');

var _Lifecycle2 = _interopRequireDefault(_Lifecycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SingletonLifecycle extends _Lifecycle2.default {

  constructor() {
    super();
    this.instance = null;
  }

  resolve(resolver, context, args) {
    (0, _ensure2.default)('resolver', resolver);
    (0, _ensure2.default)('context', context);
    if (this.instance === null) {
      this.instance = resolver.resolve(context, args);
    }
    return this.instance;
  }

  toString() {
    return 'singleton';
  }

}

exports.default = SingletonLifecycle;
//# sourceMappingURL=SingletonLifecycle.js.map