class Lifecycle

  getInstance: (resolver) ->
    throw new Error("You must implement getInstance() on #{@constructor.name}")

module.exports = Lifecycle
