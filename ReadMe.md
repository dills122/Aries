# Aries

[![Build Status](https://travis-ci.com/dills122/Aries.svg?token=mGFt9GyKoDzMhi9Zvco9&branch=master)](https://travis-ci.com/dills122/Aries)

Rules suck unless when designing system because you remember that bug that was causing clients to get denied and cost you a week of sleep? Pepperidge Farm remembers.

Don't be hip be a square and make some rules now.


## Documentation

Note - **You need use the defined ruleName as the key of your rule object inside the config**

Possible comparisons method avaliable

`CompareTwo(dataItemPath, dataItemTwoPath, operand)` - Compare two values aganist eachother.

```javascript
{
    ruleName: "Bounds Example",
    ...,
    dataItemPath: 'a',
    dataItemTwoPath: 'b',
    operand: '===',
    ...
}

//When using >, <, <=, >= you should use number types, strings will use the length of the string as the comparison number
{
    ruleName: "Bounds Example",
    ...,
    dataItemPath: 'a',
    dataItemTwoPath: 'b.c',
    operand: '>',
    ...
}

```


`CompareBounds(dataItemPath, lowerBound, upperBound, operand?)` - Check if a number is within a given range

```javascript
//Examples
{
    ruleName: "Bounds Example",
    ...,
    lowerBound: 10,
    upperBound: 30,
    dataItemPath: 'a',
    operand: '>=', //for this type any of >=, <=, >, < these but it only checks for the = sign 
    ...           //it will always evaluate as lowerBound </= dataItem </= upperBound
}
```

`CompareBaseline(dataItemPath, baseline, operand)` - Compare a number or a list of numbers aganist of constant (baseline)

**Can be used on a collection (`Array<nummber>`)**

Will evaluate in this order `dataItem operand baseline` keep this in mind when defining your rule configs

```javascript
{
    ruleName: "Bounds Example",
    ...,
    dataItemPath: 'a.b', //Equal 60 here
    baseline: 100,
    operand: '<=' // dataItem <= baseline or 60 <= 100 === true
}
```


`CompareBaselineTolerance(dataItem, baseline, tolerance, operand?)` - Checks if a given value is within a given tolerance, 


Example
> `100 is greater than or equal 60 +/-10%` or in number form `54 < 100 || 66 < 100`

```javascript
{
    ruleName: "Bounds Example",
    ...,
    dataItemPath: 'a.b', //Equal 200 here
    baseline: 100,
    tolerance: 10, // will be 10%
    operand: '<=' // baseline - 10% <= dataItem <= baseline + 10% or 90 <= 200 || 110 <= 200
}
```

### Dependent Rules

If you need to compare some more complex information or just a larger number of data items you can chain existing rules together using dependent rules.

Accepted `operators`- `&&` and `||`

Example
```javascript
{
ruleName: "Test Dependent Rule",
operand: "&&", // || is the only other accepted operator,
ruleNames: ["RuleOne","RuleTwo"]
}
```

#### Background

This repo is named after my dog who recently passed away. A dog who didn't listen to shit or follow the rules and I name a rule validation, seems fitting to me.

RIP buddy 2008-2020

<p align="center">
  <img width="175" height="250" src="./Aries.JPG" alt="Logo Image">
</p>