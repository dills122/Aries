const joi = require("@hapi/joi");
const { schemas } = require("./schemas/ruleItem");
const _ = require("lodash");

const schema = joi.object().keys({
  config: joi.object().required()
});

module.exports = class ConfigValidator {
  constructor(args = {}) {
    let validatedSchema = joi.attempt(args, schema);
    _.assign(this, validatedSchema);
  }

  /**
   * Validate a rules config's items to ensure data integretity
   * @param {object} config
   */
  validateConfig(config = {}) {
    if (_.keys(config).length > 0) {
      this.config = _.cloneDeep(config);
    }

    return ConfigValidator.validate(this.config);
  }
  /**
   * Validate a rules config to ensure it has proper form
   * @param {object} config
   */
  static validate(config) {
    let configItems = _.values(config);

    let allConfigs = joi.array().items(...schemas);

    return joi.attempt(configItems, allConfigs);
  }
}
