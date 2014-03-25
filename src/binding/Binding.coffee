class Binding

  constructor: (@container, @name) ->

  resolve: ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

module.exports = Binding
