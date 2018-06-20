/**
 * A tool for creating simple value ducks. The state consists of a value, and the reducer only responds to one kind
 * of action, one that replaces the old value with a new value.
 */
export default class ValueDuck {
  /**
   * This callback is for figuring out whether a value is valid.
   *
   * @callback valueValidityTest
   * @param {*}  A candidate value.
   * @returns {boolean}  True if the candidate is a valid value, false otherwise.
   */

  /**
   * Creates a duck.
   *
   * @param {*} actionType  The value of action.type that will trigger the reducer.
   * @param {*} defaultValue  The default value for the reducer's state.
   * @param {string} [actionValueProperty='value']  The property of the action object where the value is looked up from.
   * @param {valueValidityTest} [valueValidityTest]  A test to check that the given value is valid. Trying to set the
   * store to an invalid value will result in no change. If omitted, all values will be considered valid.
   */
  constructor(actionType, defaultValue, actionValueProperty = 'value', valueValidityTest = () => true) {
    this.actionType = actionType;
    this.defaultValue = defaultValue;
    this.actionValueProperty = actionValueProperty;
    this.valueValidityTest = valueValidityTest;
  }

  /**
   * Creates a reducer.
   * @returns {function}  The reducer.
   */
  createReducer() {
    return (state = this.defaultValue, action) => {
      if (action.type === this.actionType && this.valueValidityTest(action[this.actionValueProperty])) {
        return action[this.actionValueProperty];
      } else {
        return state;
      }
    };
  }

  /**
   * Creates an action creator.
   * @returns {function}  The action creator.
   */
  createActionCreator() {
    return (value) => ({
      type: this.actionType,
      [this.actionValueProperty]: value,
    });
  }
}
