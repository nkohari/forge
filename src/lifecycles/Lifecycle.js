class Lifecycle {

  resolve(resolver, context, args) {
    throw new Error(`You must implement resolve() on ${this.constructor.name}`);
  }

}

export default Lifecycle;
