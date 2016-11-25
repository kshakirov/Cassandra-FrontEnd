magento_module.controller("CustomerAccountInformationController", function ($scope,
                                                                            $rootScope, $http) {
  $scope.passwordVisible = false;

  $scope.init = function () {
    $http.get("/customer/account").then(function (promise) {
      $scope.customer = promise.data;
    })
  }

  $scope.setPasswordFormVisible = function () {
    $scope.passwordVisible = !$scope.passwordVisible;
  }

  $scope.updateCustomer = function (customer) {
    var data = {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname, email: customer.email,
      password: customer.currentPassword,
      password_new: customer.newPassword_1
    }
    console.log(data);
    $http.put("/customer/account/password/", data).then(function (promise) {
      console.log(promise);
    }, function (error) {
        console.log(error)
    })
  }
})
