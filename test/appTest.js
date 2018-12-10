'use strict'

const fs = require("fs");
const assert = require('chai').assert;
const CONSTANTS = require('../constants.js');
const breakdownOrders = require('../bakehouseCalculator.js').breakdownOrders;
const minPackCount = require('./testUtil.js').minPackCount

describe('breakdownOrders()', function() {

  // Read prameterised unit test data
  var tests = JSON.parse(fs.readFileSync("./test/testData.json", "utf8"));

  // Parameterised unit test logic
  tests.forEach(function(test) {
    // Get orderBreakdowns using our API
    var orders = breakdownOrders(test);

    // Match solution sum with target sum
    it('Valid solution should adds up to the targets', function() {
      // Test for each product
      for(var key in test) {
        // Handle invalid test data
        if(!CONSTANTS[key])
          return;
        else if(test[key] < 0)
          return;

        var total = test[key]; // target total products
        var order = orders[key]; // order breakdown solution result

        if(order.length) {
          var solutionTotal = order.reduce((a, b) => a + b);
          assert.equal(solutionTotal, total);
        }
      }
    });

    it('Solution should be either impossible or using minimal packs', function(){
      // Test for each product
      for(var key in test) {
        // Handle invalid test data
        if(!CONSTANTS[key])
          return;
        else if(test[key] < 0)
          return;

        var packs = Object.keys(CONSTANTS[key].PACKS).map(Number); // available packs
        var total = test[key]; // target total products
        var order = orders[key]; // order breakdown solution result

        // Another simple dynamic planning alghrithm to decide minimal packs
        // needed for a given available pack and total count
        var minPackPossbile = minPackCount(packs, total);

        // If breakdown is not possible, solution should be empty
        if(minPackPossbile === Number.MAX_SAFE_INTEGER)
          assert.isEmpty(order)
        // If breakdown is possbie, solution should use minimal packs
        else
          assert.equal(order.length, minPackPossbile);
      }
    });
  });
})
