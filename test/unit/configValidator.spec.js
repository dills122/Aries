const mocha = require("mocha");
const { assert } = require("chai");
const _ = require("lodash");
const ConfigValidator = require("../../src/configValidator");
const {
  configs: { basic, multi, erroneousMulti }
} = require("../mocks/");

describe("Unit::", () => {
  describe("ConfigValidator::", () => {
    beforeEach(() => {});

    afterEach(() => {});

    it("Should successfully validate a basic config", done => {
      let validator = new ConfigValidator({
        config: basic
      });
      let [validatedConfig] = validator.validateConfig();
      let rule = _.values(basic)[0];

      assert.notEqual(validatedConfig.isWarning, rule);
      assert.notDeepEqual(
        validatedConfig,
        rule,
        "Should return updated config"
      );
      delete validatedConfig.isWarning;
      assert.deepEqual(validatedConfig, rule, "Should return updated config");
      assert.deepEqual(
        _.values(validator.config)[0],
        validatedConfig,
        "class instance config and returned config should be the same"
      );
      return done();
    });

    it("Should successfully validate a multi config", done => {
      let validator = new ConfigValidator({
        config: multi
      });
      let [validatedConfig, validatedConfigTwo] = validator.validateConfig();
      let [ruleOne, ruleTwo] = _.values(multi);

      assert.notEqual(validatedConfig.isWarning, ruleOne);
      assert.notDeepEqual(
        validatedConfig,
        ruleOne,
        "Should return updated config"
      );
      assert.notDeepEqual(
        validatedConfigTwo,
        ruleTwo,
        "Should return updated config"
      );
      delete validatedConfig.isWarning;
      delete validatedConfigTwo.isWarning;
      assert.deepEqual(
        validatedConfig,
        ruleOne,
        "Should return updated config"
      );
      assert.deepEqual(
        validatedConfigTwo,
        ruleTwo,
        "Should return updated config"
      );
      assert.deepEqual(
        _.values(validator.config)[0],
        validatedConfig,
        "class instance config and returned config should be the same"
      );
      return done();
    });

    it("Should update the config on the class instance when passing one into validate", done => {
      let validator = new ConfigValidator({
        config: basic
      });
      assert.deepEqual(
        validator.config,
        basic,
        "Instance config should equal same config passed in"
      );
      let [validatedConfig] = validator.validateConfig(multi);
      assert.deepEqual(
        validator.config,
        multi,
        "config should be updated to multi now"
      );
      return done();
    });

    it("Should throw with an erroneous config", done => {
      let validator = new ConfigValidator({
        config: erroneousMulti
      });
      let err = () => validator.validateConfig();
      assert.throws(err);
      return done();
    });
  });
});
