(function (app) {
  'use strict';

  app.registerModule('users', ['core', 'ui.bootstrap', 'chart.js', 'users.admin']);
  app.registerModule('users.services');
  app.registerModule('users.routes', ['ui.router', 'core.routes', 'users.services', 'users.admin']);
  app.registerModule('users.admin', ['core', 'ui.bootstrap', 'chart.js']);
  app.registerModule('users.admin.routes', ['ui.router', 'core.routes', 'users.admin.services']);
  app.registerModule('users.admin.services');

}(ApplicationConfiguration));
