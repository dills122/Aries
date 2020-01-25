module.exports = {
  configs: {
    basic: require("./basicRuleConfig"),
    multi: require("./multiItemRuleConfig"),
    erroneousMulti: require("./erroneousRuleConfig")
  },
  unvalidatedObjects: {
    basic: require("./basicUnvalidatedObject")
  }
};
