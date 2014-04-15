assert = require 'assert'
_      = require 'underscore'

class Inspector

  getNamedDependencies: (func) ->
    assert func?, 'The argument "func" must have a value'
    params = @getParameterNames(func)
    hints  = @getHints(func)
    return _.map params, (param) -> hints[param] ? param

  getParameterNames: (func) ->
    assert func?, 'The argument "func" must have a value'
    regex   = /function .*\(([^)]+)/g
    matches = regex.exec func.toString()
    return [] if !matches? or matches[1].length == 0
    return matches[1].split /[,\s]+/

  getHints: (func) ->
    assert func?, 'The argument "func" must have a value'
    regex = /"(.*?)\s*->\s*(.*?)";/g
    hints = {}
    while match = regex.exec(func.toString())
      [hint, argument, dependency] = match
      hints[argument] = dependency
    return hints

module.exports = Inspector