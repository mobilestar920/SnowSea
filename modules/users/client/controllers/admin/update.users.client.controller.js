(function () {
  'use strict';

  angular
    .module('users')
    .controller('UpdateUsersController', UpdateUsersController);
  UpdateUsersController.$inject = ['Authentication', '$scope', '$state', '$uibModalInstance', 'params', 'Notification', 'AdminService', 'PasswordValidator', 'UsersService'];

  function UpdateUsersController(Authentication, $scope, $state, $uibModalInstance, params, Notification, AdminService, PasswordValidator, UsersService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = params.user;
    vm.setting = params.setting;

    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.passwordDetails = {
      currentPassword: '',
      newPassword: '',
      verifyPassword: ''
    };
    vm.loginDetails = {
      username: params.user.username,
      usernameOrEmail: params.user.email,
      password: ''
    };
    vm.input = params.user;

    vm.ok = function (result) {
      $uibModalInstance.close(result);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.rename = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.renameForm');

        return false;
      }

      var user = params.user;
      user = vm.input;

      user.$update(function (result) {
        // console.log(result);
        $state.go('home.manage-users', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
      $uibModalInstance.dismiss('cancel');
    };

    // Login as User
    vm.loginUser = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');
        return false;
      }

      UsersService.userSignin(vm.loginDetails)
      .then(onUserSigninSuccess)
      .catch(onUserSigninError);

    };

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.info({ message: 'Welcome ' + response.firstName });
      // And redirect to the previous or home page
      $state.go('home.machines', { state: 'dashboard' }, { reload: true });
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }

    // Change user password
    vm.changepass = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');
        return false;
      }
      var user = params.user;
      AdminService.updatePassword(user._id, vm.passwordDetails)
      .then(onChangePasswordSuccess)
      .catch(onChangePasswordError);
    };

    function onChangePasswordSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully. New Password is ' + vm.passwordDetails.newPassword });
      vm.passwordDetails = null;
      $uibModalInstance.dismiss('cancel');
    }

    function onChangePasswordError(response) {
      $uibModalInstance.dismiss('cancel');
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!' });
    }

  }
}());
