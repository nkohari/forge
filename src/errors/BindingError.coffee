class BindingError extends Error

  constructor: (name, message) ->
    @message = "Could not declare binding for component named #{name}: #{message}"
    Error.captureStackTrace(this, arguments.callee)

module.exports = BindingError
