(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'AdminService', '$uibModal', '$document', 'UsersService'];

  function UserController($scope, $state, $window, Authentication, Notification, AdminService, $uibModal, $document, UsersService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    vm.input = {
      roles: '',
      machines: ''
    };
    AdminService.query(function (data) {
      vm.users = data;
    });

    vm.openDialog = function (size, parentSelector, templateUrl, controller, params) {
      var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-group ' + parentSelector)) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: templateUrl,
        controller: controller,
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {
          params: function() {
            return params;
          }
        }
      });

      modalInstance.result.then(function (message) {
        Notification.success({ message: `<i class="glyphicon glyphicon-ok"></i> ${message}`, title: '<i class="glyphicon glyphicon-ok"></i> Success', delay: 6000 });
        vm.loadData();
      }, function () {

      });
    };

    vm.removeUser = function (user) {
      remove(user);
    };

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    vm.createUser = function(isValid) {
      if (!isValid || vm.input.password !== vm.confirm) {
        $scope.$broadcast('show-errors-check-validity', 'vm.createForm');
        Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> Please enter valid values!' });
        return false;
      } else {
        var User = new UsersService(vm.input);
        User.displayName = vm.input.firstName + ' ' + vm.input.lastName;
        User.provider = 'local';

        User.$save()
        .then(function () {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
          $state.go('home.manage-users');
        });
      }
    };

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
