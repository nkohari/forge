class Lifecycle

  resolve: (resolver, context, args) ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

module.exports = Lifecycle
