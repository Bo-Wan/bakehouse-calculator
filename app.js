(function () {
  "use strict";

  const BakehouseCalculator = require("./bakehouseCalculator.js");
  var orderTotals = {'VS5': 10, 'MB11': 14, 'CF': 13};
  var orderBreakdowns = BakehouseCalculator.breakdownOrders(orderTotals);
  BakehouseCalculator.printOrders(orderBreakdowns, orderTotals);
})();
