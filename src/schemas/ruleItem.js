const joi = require("@hapi/joi");

module.exports = joi.object().keys({
    ruleName: joi.string().min(1).required(),
    dataType: joi.string().min(1).required(),
    dataItemPath: joi.string().min(1).required(),
    isActive: joi.boolean().required(),
    isWarning: joi.boolean().default(false),
    description: joi.string().optional(),
    lowerBound: joi.number().optional(),
    upperBound: joi.number().optional(),
    baseline: joi.number().optional(),
    tolerance: joi.number().optional(),
    description: joi.string().optional()
});