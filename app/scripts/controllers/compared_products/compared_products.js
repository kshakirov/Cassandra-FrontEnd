magento_module.controller("ComparedProductsController", function ($scope,
                                                                  $rootScope, $http,
                                                                  $cookies, ngDialog) {

  function _get_stats() {
    var stats = $cookies.getObject('stats');
    return stats;
  }

  var make_compared_widget_visible = function () {
    $scope.products = [];
    _init_compared_products_all(_get_stats, $scope.products);
    $scope.reload = true;
  };

  var dialog = null;
  $scope.loaded = false;
  $scope.reload = true;


  $scope.init = function () {
    var stats = $cookies.getObject('stats');
    $scope.products = [];
    return  $http.get("/customer/compared_product/").then(function (promise) {
      $scope.products = promise.data;
      console.log(promise.data)
    })
  };



  function remove_product(id, products) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].sku == id) {
        products.slice(i);
        return true;
      }
    }
  }


  $scope.removeItem = function (id) {
    return $http.delete("/customer/compared_product/" + id).then(function (promise) {
      $scope.reload = false;
      $scope.products = remove_product(id, $scope.products);
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




