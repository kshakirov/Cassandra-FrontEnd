magento_module.controller("LoginManager", function ($scope, $http,
                                                    $rootScope, usSpinnerService,
                                                    $cookies, $location) {
  $scope.isAuthorized = false;
  $scope.customer_data = {name: " to Turbo International"};

  $scope.initManager = function () {
    console.log("Hi init manager");
    return $http.get('/customer/data').then(function (promise) {
      console.log(promise.data);
      $scope.customer_data = promise.data;
      $scope.isAuthorized = true;
    })
  }

  $scope.logout = function () {
    $cookies.remove('token');
    console.log("Logout");
    $scope.isAuthorized = false;
    $scope.customer_data.name = " to Turbo International";
    $location.path('/#/');
  }

  $scope.$on('loginDone', function (event, args) {
    if(args){
      console.log(args);
      $scope.initManager();
    }
  })
})
