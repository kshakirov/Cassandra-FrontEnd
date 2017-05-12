magento_module.controller("CustomerAddressBookController", function ($scope,
                                                                     $rootScope, $http,
                                                                     usSpinnerService,
                                                                     $location) {
  $scope.init = function () {
    usSpinnerService.spin('spinner-account');
    $http.get("/customer/account").then(function (promise) {
      console.log(promise);
      $scope.customer = promise.data;
      usSpinnerService.stop('spinner-account');
    })
  }

  $scope.createNewAddress = function () {
    $location.path('/customer/account/address/new/');
  }
})
