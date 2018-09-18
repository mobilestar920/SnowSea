'use strict';

/**
 * Module dependencies
 */
var options = require('../controllers/options.settings.server.controller');

module.exports = function (app) {

  // Settings routes
  app.route('/api/options')
    .get(options.read)
    .post(options.update)
    .put(options.create)
    .delete(options.delete);

};
