magento_module.controller("ComparedProductsController", function ($scope,
                                                                  $rootScope, $http,
                                                                  $cookies, ngDialog) {


  var dialog = null;
  $scope.loaded = false;
  $scope.reload = true;


  $scope.init = function () {
    $scope.products = [];
    return $http.get("/customer/compared_product/").then(function (promise) {
      $scope.products = promise.data;
    })
  };


  $scope.removeItem = function (id) {
    return $http.delete("/customer/compared_product/" + id).then(function (promise) {
      $scope.init();
      $scope.initCount();
    }, function (error) {
    })
  };

  $scope.removeAll = function () {
    return $http.delete("/customer/compared_product/").then(function (promise) {
      $scope.products = [];
      $rootScope.compared_product_count = 0;
    }, function (error) {
      console.log(error);
    })
  };


  $scope.openModal = function () {
    dialog = ngDialog.open({
      template: 'views/compare_modal.html',
      controller: 'ComparedProductsModalController',
      scope: $scope
    });
    dialog.closePromise.then(function (data) {
    });
  };

  $scope.initCount = function () {
    $http.get("/customer/compared_product/count/").then(function (promise) {
      $rootScope.compared_product_count = promise.data.count;
    })
  }

  $scope.initModal = function () {

    $http.get("/customer/compared_product/").then(function (promise) {
      $scope.products = promise.data;
      console.log(promise.data)
      dialog = ngDialog.open({
        template: 'views/compare_modal.html',
        controller: 'ComparedProductsModalController',
        scope: $scope
      });
      dialog.closePromise.then(function (data) {
      });
    })
  }
})




