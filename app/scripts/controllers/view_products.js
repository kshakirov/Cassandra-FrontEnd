magento_module.controller("ViewedProductsController", function ($scope,
                                                                $rootScope, $http, $cookies) {

  $scope.loaded = false;

  function _get_customer_products() {
    return $http.get('/customer/product/viewed').then(function (promise) {
      console.log(promise.data);
      $scope.viewedProducts = promise.data;
      $scope.loaded = true;
    })
  }

  function _get_visitor_products() {
    return $http.get('/frontend/product/viewed').then(function (promise) {
      console.log(promise.data);
      $scope.viewedProducts = promise.data;
      $scope.loaded = true;
    })
  }

  $scope.init = function () {
    var token = $cookies.getObject('token');
    var visitor_id = $cookies.getObject('visitorid');
    if (!angular.isUndefined(token))
      return _get_customer_products();
    else if (!angular.isUndefined(visitor_id))
      return _get_visitor_products();
  }

})
