magento_module.controller("CustomerCart", function ($scope,
                                                    $rootScope,
                                                    $http,
                                                    $cookies,
                                                    $location) {


  function load_cart() {
    return $http.get('/customer/cart').then(function (promise) {
      return promise.data;
    })
  }

  function set_cart_currency(currency) {
    var data = {currency: currency};
    return $http.put('/customer/cart/currency', data).then(function (promise) {
      return promise.data;
    })
  }

  function _get_current_currency() {
    return $cookies.getObject('ti_currency');
  }

  function get_products_count() {
    return $http.get('/customer/cart/product/count').then(function (promise) {
      return promise.data.count;
    })
  }

  function is_cart_empty(cart) {
    if (cart && cart.hasOwnProperty('items'))
      return Object.keys(cart.items) == 0;
  }

  $scope.init = function () {
    return load_cart().then(function (data) {
      $scope.cart_data = data;
      $scope.emptyCart = is_cart_empty(data);
    })
  }

  $scope.removeProductFromCart = function (sku) {
    console.log(sku + " To delete");
    $http.delete('/customer/cart/product/' + sku).then(function () {
      return sku;
    }).then(function (sku) {
      load_cart().then(function (data) {
        $scope.cart_data = data;
        $scope.emptyCart = is_cart_empty(data);
      });
      get_products_count().then(function (promise) {
        $rootScope.product_count = promise;
      })
    })
  }

  $scope.checkout = function () {
    var currency = _get_current_currency();
    set_cart_currency(currency.code).then(function (promise) {
       $location.path("/customer/checkout")
    })

  }

  $scope.redirectToCatalog = function () {
    $location.path("/parts")
  }

  $scope.updateCart = function () {
    $scope.init();
  }

  $scope.reEmptyCart = function () {
    $http.delete('/customer/cart').then(function () {
      return true;
    }).then(function (result) {
      load_cart().then(function (data) {
        $scope.cart_data = data;
        $scope.emptyCart = is_cart_empty(data);
      });
      get_products_count().then(function (promise) {
        $rootScope.product_count = promise;
      })
    })
  }

  $scope.getProductsCount = function () {
    get_products_count().then(function (promise) {
      $rootScope.product_count = promise;
    })
  }

  $scope.$on('currencyChanged', function (event, args) {
    console.log("Currency Changed" );
      $scope.init().then(function () {
        $scope.cart_data.currency = _get_current_currency();
      });

    });


})
