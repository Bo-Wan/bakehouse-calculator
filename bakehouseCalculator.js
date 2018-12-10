'use strict'

// Main total order breakdown function
function breakdownOrders(orderTotals) {
  const CONSTANTS = require("./constants.js");

  // Get product pack types and target amounts
  var vs5Packs = Object.keys(CONSTANTS.VS5.PACKS).map(Number);
  var vs5Total = orderTotals[CONSTANTS.VS5.CODE];

  var mb11Packs = Object.keys(CONSTANTS.MB11.PACKS).map(Number);
  var mb11Total = orderTotals[CONSTANTS.MB11.CODE];

  var cfPacks = Object.keys(CONSTANTS.CF.PACKS).map(Number);
  var cfTotal = orderTotals[CONSTANTS.CF.CODE];

  // Get result using min pack finder using dynamic planning algorithm
  return {
    [CONSTANTS.VS5.CODE]: (new minPackFinder(vs5Packs)).findMinPack(vs5Total),
    [CONSTANTS.MB11.CODE]: (new minPackFinder(mb11Packs)).findMinPack(mb11Total),
    [CONSTANTS.CF.CODE]: (new minPackFinder(cfPacks)).findMinPack(cfTotal)
  };
}

// Dynamic planning algorithm to calculate minimal packs
function minPackFinder(packs) {
  var packs = packs;
  var solutions = {};

  // Recursive function to get sub-solutions and save to solutions cache
  this.findMinPack = function(total) {
    if(!total)
      return [];

    // If solution already exists
    if(solutions[total])
      return solutions[total];

    var combination = [], previousCombination, previousTotal;

    // Recursiely solve / lookup solutions for sub problems of one packs
    for(var i = 0;  i < packs.length; i++) {
      var pack  = packs[i];
      previousTotal = total - pack;
      if(previousTotal >= 0) {
        previousCombination = this.findMinPack(previousTotal);

        // If revious combo is a valid solution or is 0 and "current combination
        // solutiondoes not exist in the cache, or previous solution presents a
        // better path (uses less number of packs)" then update current solution
        if((previousCombination.length || !previousTotal)
            && (previousCombination.length < combination.length -1
                || !combination.length)) {
          combination = [pack].concat(previousCombination);
        }
      }
    }

    // Update solution cache
    solutions[total] = combination;
    return combination;
  }
}

// Utility function to print orders
function printOrders(orders, totals) {
  const CONSTANTS = require("./constants.js");
  var table = [];

  for (var code in orders){
    var orderList = orders[code];
    var quantity = totals[code];

    if(orderList.length) {
      var packCount = {}, cost = 0, description = '';

      // Count occurences of each pack type
      for (var i = 0; i < orderList.length; i++) {
        var pack = orderList[i];
        packCount[pack] = packCount[pack] ? packCount[pack] + 1 : 1;
      }

      // Get cost and description
      for(pack in packCount) {
        var quantity = packCount[pack];
        var unitPrice = CONSTANTS[code].PACKS[pack];
        cost += quantity * unitPrice;
        description += quantity + ' x ' + pack + ' @ ' + unitPrice + ' | ';
      }
      table.push({ 'Code' : code, 'Quantity' : quantity, 'Total Cost': '$'
          + cost.toFixed(2), 'Breakdown': description.slice(0, -3)});
    } else {
      table.push({ 'Code' : code, 'Quantity' : quantity, 'Total Cost': 'N/A',
          'Breakdown': 'Not Available: No possible combination' });
    }
  }

  console.table(table);
}

module.exports.breakdownOrders = breakdownOrders;
module.exports.printOrders = printOrders;
