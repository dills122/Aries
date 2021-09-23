module.exports = {
  'Safe Range': {
    ruleName: 'Safe Range',
    description: 'Between a given range',
    isActive: true,
    operand: '>=', // For the time being it will only use the operand to see if it is inclusive or exclusive
    dataItemPath: 'e',
    dataType: 'number',
    baseline: 200,
    tolerance: 10,
  },
  'Safe Range Two': {
    ruleName: 'Safe Range Two',
    description: 'Between a given range again',
    isActive: true,
    operand: '>', // For the time being it will only use the operand to see if it is inclusive or exclusive
    dataItemPath: 'd',
    dataType: 'number',
    baseline: 80,
    tolerance: 15,
  },
};
