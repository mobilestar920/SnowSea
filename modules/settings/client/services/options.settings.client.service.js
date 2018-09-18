(function () {
  'use strict';

  // Settings service used for communicating with the settings REST endpoint
  angular
    .module('settings.services')
    .factory('OptionsService', OptionsService);

  OptionsService.$inject = ['$resource'];

  function OptionsService($resource) {
    var Options = $resource('/api/options', {}, {
      readOptions: {
        method: 'GET',
        url: '/api/options/:info',
        params: {
          info: '@info'
        },
        isArray: true
      },
      updateOption: {
        method: 'POST',
        url: '/api/options/:info',
        params: {
          info: '@info'
        }
      },
      createOptions: {
        method: 'PUT'
      }
    });

    angular.extend(Options, {
      getOptions: function(infoKey) {
        return this.readOptions({ info: infoKey }).$promise;
      },
      createOption: function(input) {
        return this.createOptions({ input: input }).$promise;
      }
    });

    return Options;
  }
}());
