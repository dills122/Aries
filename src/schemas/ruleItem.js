const joi = require("@hapi/joi");
const {
  operands: { whitelist }
} = require("../config");

const constRules = {
  ruleName: joi.string().required(),
  dataType: joi.string().required(),
  description: joi.string().optional(),
  isActive: joi.boolean().required(),
  isWarning: joi.boolean().default(false)
};

const compareTwo = joi.object().keys({
  dataItemPath: joi.string().required(),
  dataItemTwoPath: joi.string().required(),
  operand: joi
    .string()
    .valid(...whitelist)
    .required(),
  ...constRules
});

const compareBounds = joi.object().keys({
  dataItemPath: joi.string().required(),
  lowerBound: joi
    .number()
    .min(0)
    .required(),
  upperBound: joi
    .number()
    .min(0)
    .required(),
  operand: joi
    .string()
    .valid(">=", "<=", "<", ">")
    .required(),
  ...constRules
});

const compareBaselineTolerance = joi.object().keys({
  dataItemPath: joi.string().required(),
  baseline: joi.number().required(),
  tolerance: joi
    .number()
    .min(1)
    .max(99)
    .required(),
    operand: joi
    .string()
    .valid(">=", "<=", "<", ">")
    .required(),
  ...constRules
});

const compareBaseline = joi.object().keys({
  dataItemPath: joi.string().required(),
  baseline: joi.number().required(),
  operand: joi
  .string()
  .valid(...whitelist)
  .required(),
  ...constRules
});

module.exports = {
  schemas: [
    compareBaseline,
    compareBaselineTolerance,
    compareBounds,
    compareTwo
  ],
  compareBaseline,
  compareBaselineTolerance,
  compareBounds,
  compareTwo
};
