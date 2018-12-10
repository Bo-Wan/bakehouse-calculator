'use strict'

// Test utility function for getting number of minimal pack count
function minPackCount(packs, total) {
  // Set initial sub problem
  var count = [0];

  // Loop from 1 to total
  for(var i = 1; i <= total; i ++) {
    // Max int means no solution yet
    count.push(Number.MAX_SAFE_INTEGER)

    // Check if each problem can be solved by solving a sub problem
    for(var key in packs) {
      var pack = packs[key];
      var subTotal = i - pack;
      // If sub problem "current problem minus one pack" can be solved
      // then current problem is solved by sub problem + one pack
      if(subTotal >= 0 && count[subTotal] < Number.MAX_SAFE_INTEGER
        && count[subTotal] + 1 < count[i])
        count[i] = count[subTotal] + 1;
    }
  }
  return count[total];
}

module.exports.minPackCount = minPackCount;
