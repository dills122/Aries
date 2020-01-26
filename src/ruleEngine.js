const joi = require("@hapi/joi");
const _ = require("lodash");

const dependencies = {
  ConfigValidator: require("./configValidator").ConfigValidator
};

const schema = joi.object().keys({
  config: joi.object().required()
});
/**
 * @class Rule Engine Validator
 */
class RuleEngine {
  constructor(args = {}) {
    let validatedArgs = joi.attempt(args, schema);
    _.assign(this, validatedArgs);
  }
  /**
   * process and validate object against defined rule set
   * @param {object} toValidateObj
   * @param {object} config
   * @returns {Array<Object>}
   */
  process(toValidateObj = {}, config = {}) {
    if (_.keys(toValidateObj).length === 0) {
      throw new ReferenceError("toalidateObj is a required argument");
    }

    if (_.keys(config).length > 0) {
      this.config = config;
    }

    let validator = new dependencies.ConfigValidator({
      config: this.config
    });
    let rules = validator.validateConfig();
    let results = []; //results of the rules processing
    for (let rule of rules) {
      let {
        operand,
        dataItemPath,
        dataItemTwoPath,
        isActive,
        baseline,
        tolerance,
        upperBound,
        lowerBound
      } = rule;

      let dataItemOne = _.get(toValidateObj, dataItemPath);
      let dataItemTwo = _.get(toValidateObj, dataItemTwoPath);

      if (isActive) {
        //CompareTwo Schema in Rule Item
        if (dataItemOne && dataItemTwo) {
          results.push({
            isSuccessful: _prv.processComparisons(
              operand,
              dataItemOne,
              dataItemTwo
            ),
            ...rule
          });
          continue;
        }
        //CompareBounds Schema in Rule Item
        if (upperBound && lowerBound) {
          results.push({
            isSuccessful: _prv.processBoundedCheck(
              operand,
              lowerBound,
              upperBound,
              dataItemOne
            ),
            ...rule
          });
          continue;
        }
        //CompareBaseline Schema in Rule Item
        if (!tolerance && dataItemOne && baseline) {
          results.push({
            isSuccessful: _prv.processBaselineCheck(
              operand,
              baseline,
              dataItemOne
            ),
            ...rule
          });
          continue;
        }
        //CompareToleranceBaseline Schema in Rule Item
        if (tolerance && dataItemOne && baseline) {
          results.push({
            isSuccessful: _prv.processBaselineToleranceCheck(
              operand,
              baseline,
              tolerance,
              dataItemOne
            ),
            ...rule
          });
          continue;
        }

        results.push({
          isSuccessful: false,
          error: new Error("Not found"),
          ...rule
        }); //push a not found rule error to the results arroy
      }
    }
    return results;
  }
}

const _prv = {
  processComparisons: (operand, dataItemOne, dataItemTwo) => {
    switch (operand) {
      case "===":
        return dataItemOne === dataItemTwo;
      case "==":
        return dataItemOne == dataItemTwo;
      case ">":
        return dataItemOne > dataItemTwo;
      case "<":
        return dataItemOne < dataItemTwo;
      case "<=":
        return dataItemOne <= dataItemTwo;
      case ">=":
        return dataItemOne >= dataItemTwo;
      default:
        throw new ReferenceError("incorrect operand");
    }
  },
  processBaselineCheck: (operand, baseline, value, valueTwo = null) => {
    let isValid = true;

    isValid = _prv.processComparisons(operand, value, baseline);

    if (!isValid) {
      return isValid;
    }

    if (valueTwo) {
      isValid = _prv.processComparisons(operand, valueTwo, baseline);
    }

    return isValid;
  },
  processBoundedCheck: (operand, lowerBound, upperBound, value) => {
    operand = operand.includes("=") ? "<=" : "<";
    return (
      _prv.processComparisons(operand, lowerBound, value) &&
      _prv.processComparisons(operand, value, upperBound)
    );
  },
  processBaselineToleranceCheck: (operand, baseline, tolerance, value) => {
    let toleranceVal = _.multiply(baseline, _.divide(tolerance, 100));
    let lower = baseline - toleranceVal;
    let upper = baseline + toleranceVal;
    return _prv.processBoundedCheck(operand, lower, upper, value);
  }
};

module.exports = {
  RuleEngine,
  _prv,
  dependencies
};
