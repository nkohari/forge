assert = require 'assert'
_      = require 'underscore'

class Inspector

  getDependencies: (func) ->
    assert func?, 'The argument "func" must have a value'
    params = @getParameterNames(func)
    hints  = @getDependencyHints(func)
    return _.map params, (param) ->
      hints[param] ? {name: param, all: false, hint: undefined}

  getParameterNames: (func) ->
    assert func?, 'The argument "func" must have a value'
    regex   = /function .*\(([^)]+)/g
    matches = regex.exec func.toString()
    return [] if !matches? or matches[1].length == 0
    return matches[1].split /[,\s]+/

  getDependencyHints: (func) ->
    assert func?, 'The argument "func" must have a value'
    regex = /"(.*?)\s*->\s*(all)?\s*(.*?)";/gi
    hints = {}
    while match = regex.exec(func.toString())
      [pattern, argument, all, dependency] = match
      all = true if all?
      if dependency.indexOf(':')
        [name, hint] = dependency.split(/\s*:\s*/, 2)
      else
        name = dependency
        hint = undefined
      hints[argument] = {name, all, hint}
    return hints

  isAutoConstructor: (constructor) ->
    assert constructor?, 'The argument "constructor" must have a value'
    name = constructor.name
    body = constructor.toString()
    return body.indexOf("#{name}.__super__.constructor.apply(this, arguments);") > 0

module.exports = Inspector