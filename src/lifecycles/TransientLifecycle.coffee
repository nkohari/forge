Lifecycle = require './Lifecycle'

class TransientLifecycle extends Lifecycle

  getInstance: (resolver) ->
    return resolver.resolve()

module.exports = TransientLifecycle
