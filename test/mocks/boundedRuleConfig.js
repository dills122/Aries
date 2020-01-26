module.exports = {
  ["Safe Range"]: {
    ruleName: "Safe Range",
    description: "Between a given range",
    isActive: true,
    operand: ">=", // For the time being it will only use the operand to see if it is inclusive or exclusive
    dataItemPath: "d",
    dataType: "number",
    lowerBound: 20,
    upperBound: 115
  },
  ["Safe Range Two"]: {
    ruleName: "Safe Range Two",
    description: "Between a given range again",
    isActive: true,
    operand: ">", // For the time being it will only use the operand to see if it is inclusive or exclusive
    dataItemPath: "e",
    dataType: "number",
    lowerBound: 150,
    upperBound: 300
  }
};
