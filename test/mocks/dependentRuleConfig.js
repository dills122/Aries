const multiRuleItem = require('./multiItemRuleConfig');

module.exports = {

  'Test dependent rule': {
    ruleName: 'Test dependent rule',
    ruleNames: ['Test rule', 'Test rule two'],
    operand: '&&',
  },
  ...multiRuleItem,
};
