magento_module.controller("ForgotPasswordController", function ($scope,
                                                                $rootScope, $http,
                                                                $timeout, $window) {

  $scope.action_result = {
    success: {
      flag: false,
      message: "Your password has been reset. You will receive an email with your new password."
    },
    error: {
      flag: false,
      msg: ""
    }
  }

  function _reset_password(payload) {
    return $http.post("/frontend/customer/password/reset/", payload).then(function (promise) {
      return promise;
    })
  }

  function notify_success(action_result) {
    action_result.success.flag = true;
  }

  function notify_error(action_result, error) {
    action_result.error.flag = true;
    action_result.error.message = error.data.message;
  }

  function unnotify_error(action_result) {
    action_result.error.flag = false;
  }

  function unnotify_success(action_result) {
    action_result.success.flag = false;
  }

  $scope.resetPassword = function (email_address) {
    var payload = {email: email_address.toLowerCase()};
    _reset_password(payload).then(function (promise) {
        notify_success($scope.action_result);
        unnotify_error($scope.action_result);
    }, function (error) {
      notify_error($scope.action_result, error);
      unnotify_success($scope.action_result);
    })
  }

})
