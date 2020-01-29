const joi = require("@hapi/joi");
const _ = require("lodash");
const hashMap = require("hashmap");

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
    this.ruleMap = new hashMap();
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
    let nonDependent = _.filter(
      rules,
      rule => rule.ruleName && !rule.ruleNames
    );
    let dependent = _.filter(rules, rule => rule.ruleName && rule.ruleNames);

    for (let rule of nonDependent) {
      console.log(rule);
      let {
        ruleName,
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
          this.ruleMap.set(ruleName, {
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
          this.ruleMap.set(ruleName, {
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
          this.ruleMap.set(ruleName, {
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
          this.ruleMap.set(ruleName, {
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

        this.ruleMap.set(ruleName, {
          isSuccessful: false,
          error: new Error("Not found"),
          ...rule
        }); //push a not found rule error to the results arroy
      }
    }
    if (dependent.length > 0) {
      this.processDependentRules(dependent);
    }

    return this.ruleMap.values();
  }

  processDependentRules(rules) {
    rules.forEach(rule => {
      let { ruleName, ruleNames, operand } = rule;
      console.log(operand);
      switch (operand) {
        case "&&":
          this.ruleMap.set(ruleName, {
            isSuccessful: ruleNames.every((ruleNameStr, index, arry) => {
              if (index === 0) {
                return true && this.ruleMap.get(ruleNameStr).isSuccessful;
              }
              let previous = arry[index - 1];
              return (
                this.ruleMap.get(previous).isSuccessful &&
                this.ruleMap.get(ruleNameStr).isSuccessful
              );
            }),
            ...rule
          });
          break;
        case "||":
          this.ruleMap.set(ruleName, {
            isSuccessful: ruleNames.some((ruleNameStr, index, arry) => {
              if (index === 0) {
                return true && this.ruleMap.get(ruleNameStr).isSuccessful;
              }
              let previous = arry[index - 1];
              return (
                this.ruleMap.get(previous).isSuccessful &&
                this.ruleMap.get(ruleNameStr).isSuccessful
              );
            }),
            ...rule
          });
          break;
        default:
          throw new TypeError("Not supported operand");
      }
    });
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
    return (
      _prv.processComparisons(operand, value, lower) ||
      _prv.processComparisons(operand, value, upper)
    );
  }
};

module.exports = {
  RuleEngine,
  _prv,
  dependencies
};
