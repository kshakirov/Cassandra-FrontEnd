magento_module.controller("CustomerLogin", function ($scope,
                                                     $rootScope, $http,
                                                     $cookies, $location) {

  $scope.init = function () {
    $http.get("/customer/account").then(function (promise) {
      $location.path('/customer/account/')
    }, function (error) {
      console.log("Login page")
    })
  };

  $scope.error = {
    flag: false,
    msg: ''
  }


  function _submitPassword(data) {
    return $http.post("/frontend/customer/login", data)
      .then(function (promise) {
        $cookies.putObject('token', promise.data.token);
        $rootScope.$broadcast('loginDone', true);
        $scope.isNotAuthorized = false;
        $scope.error.flag = false;
      }, function (error) {
        $scope.error.flag = true;
        $scope.error.msg = error.data.message;
      })
  }


  $scope.submitPasswordByEnterClick = function (event, customer_email, password) {
    if (event.which === 13) {
      var data = {
        customer_email: customer_email,
        password: password
      };
      return _submitPassword(data);
    }
  }

  $scope.submitPassword = function () {
    var data = {
      customer_email: $scope.customer_email,
      password: $scope.password
    };
    return _submitPassword(data);
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
