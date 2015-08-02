/**
 * The [this] context that is passed into the [describe/it]
 * BDD methods.
 */
export default class UIHarnessContext {
  constructor(type) {
    this.type = type
  }
}
