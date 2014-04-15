class Lifecycle

  resolve: (resolver) ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

module.exports = Lifecycle
