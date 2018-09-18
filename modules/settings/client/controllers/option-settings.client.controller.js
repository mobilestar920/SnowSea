(function () {
  'use strict';

  angular
    .module('settings')
    .controller('OptionSettingsController', OptionSettingsController);

  OptionSettingsController.$inject = ['$scope', '$state', 'OptionsService', 'Authentication', 'Notification'];

  function OptionSettingsController($scope, $state, OptionsService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;

    vm.state = $state.params.state;
    vm.init = function() {
      $(`#${vm.state}-option-link`).click();

      $('#core-clock-form').validator();
      $('#memory-clock-form').validator();
      $('#fan-speed-form').validator();
      $('#power-form').validator();
      $('#mass-reboot-form').validator();

      vm.input = {
        info: vm.state,
        display: '',
        value: ''
      };

      vm.options = OptionsService.query({ state: vm.state });

    };

    $scope.$on('$viewContentLoaded', function (event) {
      // code that will be executed ...
      // every time this view is loaded
      vm.init();

    });

    vm.setState = function(state) {
      $state.go('home.option-settings', { state: state }).then(function() {

      });
    };
    vm.addOption = function(isValid) {
      if (!isValid) {
        Notification.error({ message: 'Invalid Form', title: '<i class="glyphicon glyphicon-remove"></i> No Setting!' });
      } else {
        OptionsService.createOption(vm.input)
        .then(function(options) {
          if (options) {
            vm.input = {
              info: vm.state,
              display: '',
              value: ''
            };
            vm.options = OptionsService.query({ state: vm.state });
          } else {
            Notification.error({ message: 'Unknown Error', title: '<i class="glyphicon glyphicon-remove"></i> No Setting!' });
          }
        })
        .catch(function(err) {
          Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> No Setting!' });
        });
      }
    };


    // SettingsService.getSetting(vm.user.username)
    //   .then(function(settings) {
    //     vm.settings = settings;
    //   })
    //   .catch(function(err) {
    //     Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> No Setting!' });
    //   });

    // vm.changeSettings = function(message) {
    //   SettingsService.updateSetting(vm.user.username, vm.settings.info)
    //     .then(function(settings) {
    //       vm.settings = settings;
    //       Notification.success({ message: `<i class="glyphicon glyphicon-ok"></i> ${message}`, title: '<i class="glyphicon glyphicon-ok"></i> Success!', delay: 6000 });
    //     })
    //     .catch(function(err) {
    //       Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
    //     });
    // };
  }

}());
