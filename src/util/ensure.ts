export default function ensure(name: string, value: any) {
  if (value == null) throw new Error(`The argument "${name}" must have a value.`);
}
