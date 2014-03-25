Lifecycle = require './Lifecycle'

class SingletonLifecycle extends Lifecycle

  getInstance: (resolver) ->
    @instance = resolver.resolve() unless @instance?
    return @instance

module.exports = SingletonLifecycle
