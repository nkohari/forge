export default function ensure(name, value) {
  if (value == null) throw new Error(`The argument "${name}" must have a value.`)
}
