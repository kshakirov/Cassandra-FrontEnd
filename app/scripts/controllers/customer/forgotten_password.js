magento_module.controller("ForgotPasswordController", function ($scope,
                                                                $rootScope, $http,
                                                                $timeout, $window) {

  $scope.password_reset = false;
  $scope.resetPassword = function (email_address) {
    console.log("resetPassword");
    console.log(email_address);
    var payload = {email: email_address};
    $http.post("/frontend/customer/password/reset/", payload).then(function (promise) {
      console.log(promise);
      $scope.password_reset_message = "Your Password Is Resetted Email with new credential sent to " + email_address;
      $scope.password_reset = true;
    })
  }



  // $scope.reloadRoute = function () {
  //   console.log("set to reload");
  //   $timeout(function () {
  //     console.log("reloading");
  //     $window.location.reload();
  //   }, 30000)
  //
  // }


})
