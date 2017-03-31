magento_module.controller("HomeController", function ($scope,
                                                      $rootScope, $http,
                                                      usSpinnerService,
                                                      $cookies) {

  function _get_stats() {
    var stats = $cookies.getObject('stats');
    return stats;
  }

  $rootScope.pageTitle = ": Home";

  function _create_string_from_array(array) {
    if (typeof array != 'string') {
      var string = false;
      angular.forEach(array, function (m, m_key) {
        if (string) {
          string = string + ',  ' + m;
        } else {
          string = m;
        }
      })
      return string || "";
    } else {
      return array
    }
  }

  function _create_turbo_model_string(turbo_models) {
    return _create_string_from_array(turbo_models);
  }

  function _create_where_used_string(whereuseds) {
    return _create_string_from_array(whereuseds);
  }

  function _create_oe_ref_urls_string(oe_ref_urls) {
    return _create_string_from_array(oe_ref_urls);
  }

  function _create_turbo_type_string(turbo_types) {
    return _create_string_from_array(turbo_types);
  }

  function _process_products(featured_products) {
    var products = featured_products;
    angular.forEach(products, function (product, product_key) {
      product.turbo_model = _create_turbo_model_string(product.turbo_model);
      product.where_used = _create_where_used_string(product.where_used);
      product.oe_ref_urls = _create_oe_ref_urls_string(product.oe_ref_urls);
      product.turbo_type = _create_turbo_type_string(product.turbo_type);
      product.sku = product.sku;
    })
    return products;
  }

  function _init_featured_products() {
    return $http.get('/frontend/menu/product/featured').then(function (promise) {
      return _process_products(promise.data.slice(0, 4));
    })
  }

  function _init_prices(products) {
    products.map(function (current_product) {
      $http.get('/customer/product/' + current_product.sku + '/price').then(function (promise) {
        current_product.price = promise.data.price
      }, function (error) {
        current_product.price = 'login';
      });
    })
  }

  function _init_new_products() {
    return $http.get('/frontend/menu/product/new').then(function (promise) {
      return _process_products(promise.data.slice(0, 4));
    })
  }

  /* ********************Main Part**********************************/
  $scope.init_new_products = function () {
    return _init_new_products().then(function (promise) {
      $scope.news = promise;
      return $scope.news;
    }).then(function (products) {
      _init_prices(products);
    });
  }

  $scope.init_featured_products = function () {
    usSpinnerService.spin('spinner-home');
    return _init_featured_products().then(function (promise) {
      $scope.featureds = promise;
      return $scope.featureds
    }).then(function (products) {
      _init_prices(products);
    });
  }

  $scope.addToCart = function (id) {
    var url = '/checkout/cart/add/product/' + id + '/';
    $http.get(url).then(function (promise) {
      console.log(promise);
    })
  }
  $scope.isTurboModelVisible = function (featured) {
    return featured.part_type == "Cartridge" || featured.part_type == "Gasket"
  }

  $scope.isTurboTypeVisible = function (featured) {
    return !(featured.part_type == "Cartridge" || featured.part_type == "Gasket")
  }
})
