class TypeWithHints

  constructor: (@dep1, @dep2) ->
    "dep1->foo"
    "dep2->bar"

module.exports = TypeWithHints
