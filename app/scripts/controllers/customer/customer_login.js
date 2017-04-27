magento_module.controller("CustomerLogin", function ($scope,
                                                     $rootScope, $http,
                                                     $cookies, $location) {

  $scope.init = function () {
    console.log("Hi Login");
  }

  $scope.error = {
    flag: false,
    msg: ''
  }

  $scope.submitPassword = function () {
    var data = {
      customer_email: $scope.customer_email,
      password: $scope.password
    };
    return $http.post("/frontend/customer/login", data)
      .then(function (promise) {
          $cookies.putObject('token', promise.data.token);
          $rootScope.$broadcast('loginDone', true);
          $scope.isNotAuthorized = false;
          $location.path("/customer/account/");
          $scope.error.flag = false;
      }, function (error) {
        $scope.error.flag = true;
        $scope.error.msg = error.data.message;
      })
  }
  $scope.createNewAccount = function () {
    var data = {
      email: $scope.new_customer_email
    };
    return $http.post("/frontend/customer/new/", data)
      .then(function (promise) {
      }, function (error) {
        $scope.error.flag = true;
        $scope.error.msg = error.data.message;
      })
  }

})
