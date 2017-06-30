magento_module.controller("ViewedProductsController", function ($scope,
                                                                $rootScope, $http, $cookies) {

  $scope.loaded = false;

  function _get_customer_products() {
    return $http.get('/customer/product/viewed').then(function (promise) {
      console.log(promise.data);
      return promise.data;
    })
  }

  function _get_visitor_products() {
    return $http.get('/frontend/product/viewed').then(function (promise) {
      console.log(promise.data);
      return promise.data;
    })
  }

  $scope.init = function () {
    var token = $cookies.getObject('token');
    if (!angular.isUndefined(token))
      return _get_customer_products().then(function (promise) {
        $scope.viewed_products = promise;
      });
    else
      return _get_visitor_products().then(function (promise) {
        $scope.viewed_products = promise;
      });
  }

})
