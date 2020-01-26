module.exports = {
  configs: {
    basic: require("./basicRuleConfig"),
    multi: require("./multiItemRuleConfig"),
    erroneousMulti: require("./erroneousRuleConfig"),
    bounded: require("./boundedRuleConfig"),
    baselineTolerance: require("./baselineToleranceConfig")
  },
  unvalidatedObjects: {
    basic: require("./basicUnvalidatedObject")
  }
};
