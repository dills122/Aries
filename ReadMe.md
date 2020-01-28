# Aries

[![Build Status](https://travis-ci.com/dills122/what-a-square.svg?token=mGFt9GyKoDzMhi9Zvco9&branch=master)](https://travis-ci.com/dills122/what-a-square)

Rules suck unless when designing system because you remember that bug that was causing clients to get denied and cost you a week of sleep? Pepperidge Farm remembers.

Don't be hip be a square and make some rules now.


## Documentation

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