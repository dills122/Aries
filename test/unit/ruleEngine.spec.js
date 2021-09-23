const mocha = require('mocha');
const { assert, expect } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const { RuleEngine, _prv } = require('../../src/ruleEngine');
const {
  configs: {
    basic,
    multi,
    erroneousMulti,
    bounded: boundedConfig,
    baselineTolerance,
    dependentRule,
  },
  unvalidatedObjects: {
    basic: {
      valid, invalid, missingParam, bounded,
    },
  },
} = require('../mocks');

describe('Unit::', () => {
  describe('RuleEngine::', () => {
    let sandbox;
    const spies = {};
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      spies.processComparisonsStub = sandbox.spy(_prv, 'processComparisons');
      spies.processBaselineStub = sandbox.spy(_prv, 'processBaselineCheck');
    });

    afterEach(() => {
      sandbox.restore();
      sandbox.reset();
    });

    it('Should error out if no config is given to the constructor', (done) => {
      const err = () => new RuleEngine({});
      assert.throws(err);
      return done();
    });

    it('Should error out if invalid config is given to the constructor', (done) => {
      const engine = new RuleEngine({
        config: {},
      });
      const err = () => engine.process(valid);
      assert.throws(err);

      const engineTwo = new RuleEngine({
        config: erroneousMulti,
      });
      const errTwo = () => engineTwo.process(valid);
      assert.throws(errTwo);
      return done();
    });

    it('Should error out if invalid config is given to the engine', (done) => {
      const engine = new RuleEngine({
        config: {},
      });
      const err = () => engine.process(valid, {
        config: {},
      });
      assert.throws(err);
      return done();
    });

    it('Should error out if no object is given to the process method', (done) => {
      const engine = new RuleEngine({
        config: basic,
      });
      assert.deepEqual(engine.config, basic);
      const err = () => engine.process({});
      assert.throws(err);
      return done();
    });

    it('Should update config and process object', (done) => {
      const engine = new RuleEngine({
        config: basic,
      });
      assert.deepEqual(engine.config, basic);
      const result = engine.process(valid, multi);
      assert.equal(result.length, 2);
      assert.deepEqual(engine.config, multi);
      assert.isTrue(_.every(result, 'isSuccessful'));
      assert.isTrue(spies.processComparisonsStub.calledTwice);
      assert.isTrue(spies.processBaselineStub.calledOnce);
      return done();
    });

    it('Should process object and have an error results item be returnedd', (done) => {
      const engine = new RuleEngine({
        config: basic,
      });
      assert.deepEqual(engine.config, basic);
      const result = engine.process(missingParam, multi);
      assert.deepEqual(engine.config, multi);
      assert.equal(result.length, 2);
      assert.isFalse(_.every(result, 'isSuccessful'));
      assert(_.find(result, 'error'));
      assert.isTrue(spies.processComparisonsStub.calledOnce);
      return done();
    });

    it('Should process invalid object and have it fail', (done) => {
      const engine = new RuleEngine({
        config: basic,
      });
      assert.deepEqual(engine.config, basic);
      const result = engine.process(invalid);
      assert.equal(result.length, 1);
      assert.isFalse(_.every(result, 'isSuccessful'));
      assert.isObject(_.find(result, { isSuccessful: false }));
      assert.isTrue(spies.processComparisonsStub.calledOnce);
      return done();
    });

    it('Should process a bounded rule', (done) => {
      const engine = new RuleEngine({
        config: boundedConfig,
      });
      assert.deepEqual(engine.config, boundedConfig);
      const results = engine.process(bounded);
      assert.equal(results.length, 2);
      assert.isTrue(_.every(results, 'isSuccessful'));
      return done();
    });

    it('Should process a baseline tolerance rule type and fail', (done) => {
      const engine = new RuleEngine({
        config: baselineTolerance,
      });
      assert.deepEqual(engine.config, baselineTolerance);
      const boundedClone = _.clone(bounded);
      boundedClone.e = 175;
      const results = engine.process(boundedClone);
      assert.equal(results.length, 2);
      assert.isFalse(_.every(results, 'isSuccessful'));
      assert(_.find(results, { isSuccessful: false }));
      assert(_.find(results, { isSuccessful: true }));
      return done();
    });

    it('Should process a baseline tolerance rule type', (done) => {
      const engine = new RuleEngine({
        config: baselineTolerance,
      });
      const boundedClone = _.clone(bounded);
      boundedClone.d = 90;
      assert.deepEqual(engine.config, baselineTolerance);
      const results = engine.process(boundedClone);
      assert.equal(results.length, 2);
      assert.isTrue(_.every(results, 'isSuccessful'));
      assert(_.find(results, { isSuccessful: true }));
      return done();
    });

    it('Should test a dpendent rule', (done) => {
      const engine = new RuleEngine({
        config: dependentRule,
      });
      const results = engine.process(valid, dependentRule);
      assert.equal(results.length, 3);
      assert.isTrue(_.every(results, 'isSuccessful'));
      assert(_.find(results, { isSuccessful: true }));
      assert(_.find(results, (result) => result.ruleNames));
      return done();
    });

    it('Should test a dpendent rule and fail', (done) => {
      const engine = new RuleEngine({
        config: dependentRule,
      });
      const invalidValid = _.clone(valid);
      invalidValid.b = 'not test';
      const results = engine.process(invalidValid, dependentRule);
      assert.equal(results.length, 3);
      assert.isFalse(_.every(results, 'isSuccessful'));
      assert(_.find(results, { isSuccessful: false }));
      assert(_.find(results, (result) => result.ruleNames));
      return done();
    });
  });
});
