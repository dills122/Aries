module.exports = {
  configs: {
    basic: require('./basicRuleConfig'),
    multi: require('./multiItemRuleConfig'),
    erroneousMulti: require('./erroneousRuleConfig'),
    bounded: require('./boundedRuleConfig'),
    baselineTolerance: require('./baselineToleranceConfig'),
    dependentRule: require('./dependentRuleConfig'),
  },
  unvalidatedObjects: {
    basic: require('./basicUnvalidatedObject'),
  },
};
