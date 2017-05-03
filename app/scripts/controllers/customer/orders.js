magento_module.controller("CustomerOrdersController", function ($scope,
                                                                $rootScope, $http,
                                                                usSpinnerService,
                                                                NgTableParams) {
  $scope.init = function () {
    usSpinnerService.spin('spinner-orders');
    $http.get("/customer/order").then(function (promise) {
      $scope.orders = promise.data;
      $scope.ordersTableParams = new NgTableParams({sorting: {order_id: "asc"}, count: 25},  {dataset: promise.data});
      usSpinnerService.stop('spinner-orders');
    })
  }
})
