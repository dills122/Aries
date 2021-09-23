const joi = require('@hapi/joi');
const _ = require('lodash');
const { schemas } = require('./schemas/ruleItem');

const schema = joi.object().keys({
  config: joi.object().required(),
});
/**
 * @class Rule config validator
 * used to validate rule definition configs
 */
class ConfigValidator {
  constructor(args = {}) {
    const validatedSchema = joi.attempt(args, schema);
    _.assign(this, validatedSchema);
  }

  /**
   * Validate a rules config's items to ensure data integretity
   * @param {object} config
   * @returns {Array<Object>}
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
   * @returns {Array<Object>}
   */
  static validate(config) {
    const configItems = _.values(config);

    const allConfigs = joi.array().items(...schemas);

    const collection = joi.attempt(configItems, allConfigs);

    if (_.isArray(collection) && collection.length === 0) {
      throw new Error('Empty rule collection, need to have rules to validate');
    }

    return collection;
  }
}

module.exports = {
  ConfigValidator,
};
