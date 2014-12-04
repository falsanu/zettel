'use strict';

/**
 * Checks if given TipId is in users betslip
 * if true we return the given active class
 * @type {{helper: helper}}
 */
exports.isTipInBetslip = {
  helper: function (tipId, betslip, activeClass) {
    activeClass = activeClass ? activeClass : 'active';
    return betslip.isTipInBetslip(tipId) ? activeClass : '';
  }
};

/**
 * Returns the type of a ticket (system, combi, single)
 * @type {{helper: helper}}
 */
exports.getTicketType = {
  helper: function (combinationsSelected, combinationsOutOf) {
    if (combinationsSelected !== combinationsOutOf) {
      return 'system';
    }
    if (combinationsSelected === 1) {
      // since values must be equal, check first if they're 1
      return 'single';
    }
    return 'combi';
  }
};