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

  function _update_cart(cart_data) {
    var data = {cart: cart_data};
    return $http.post('/customer/cart/', data).then(function (promise) {
      return promise;
    })
  }

  function _recalculate_rows(cart_items) {
    var items = {};
    var ks_vs = Object.keys(cart_items).map(function (key) {
      var current = cart_items[key];
      current.subtotal = parseInt(current.qty) * parseFloat(current.unit_price);
      current.subtotal = current.subtotal.toFixed(2);
      return [key, current]
    });
    angular.forEach(ks_vs, function (value, key) {
      items[value[0]] = value[1];
    })
    return items;
  }

  function _recalcultae_grand_total(items) {
    var subtotals = Object.keys(items).map(function (key) {
      var item = items[key]
      return parseFloat(item.subtotal);
    })
    return subtotals.reduce(function (grand_total, subtotal) {
      return grand_total + subtotal;
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
    _update_cart(this.cart_data).then(function (promise) {
      set_cart_currency(currency.code).then(function (promise) {
        $location.path("/customer/checkout")
      })
    })
  }

  $scope.redirectToCatalog = function () {
    $location.path("/parts")
  }

  $scope.updateCart = function () {
    _update_cart(this.cart_data).then(function (promise) {
      get_products_count().then(function (promise) {
        $rootScope.product_count = promise;
      })
    });

  };

  $scope.reEmptyCart = function () {
    $http.delete('/customer/cart').then(function () {
      return true;
    }).then(function (result) {
      load_cart().then(function (data) {
        $scope.cart_data = data;
        $scope.emptyCart = is_cart_empty(data);
      });
      get_products_count().then(function (promise) {
        $rootScope.product_count = promise || 0;
      })
    })
  };

  $scope.getProductsCount = function () {
    get_products_count().then(function (promise) {
      $rootScope.product_count = promise;
    })
  };

  $scope.recalculateCart = function (item, qty) {
    item.qty = qty;
    this.cart_data.items = _recalculate_rows(this.cart_data.items)
    this.cart_data.subtotal = _recalcultae_grand_total(this.cart_data.items);
  };

  $scope.$on('currencyChanged', function (event, args) {
    console.log("Currency Changed");
    $scope.init().then(function () {
      $scope.cart_data.currency = _get_current_currency();
    });

  });


});
