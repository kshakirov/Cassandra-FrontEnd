magento_module.controller("CustomerAccountController", function ($scope,
                                                                 $rootScope, $http,
                                                                 usSpinnerService,
                                                                 $cookies) {
  $scope.init = function () {
    console.log("Hi customer");
    usSpinnerService.spin('spinner-account');
    $http.get("/customer/account").then(function (promise) {
      console.log(promise);
      $scope.customer_data = promise.data;
      usSpinnerService.stop('spinner-account');
    })
  }
})

magento_module.controller("CustomerAccountInformationController", function ($scope,
                                                                            $rootScope, $http,
                                                                            usSpinnerService,
                                                                            $cookies) {
  $scope.passwordVisible = false;
  $scope.init = function () {
    console.log("Hi customer");
    usSpinnerService.spin('spinner-account-info');
    $http.get("/customer/account").then(function (promise) {
      console.log(promise);
      $scope.customer_data = promise.data;
      usSpinnerService.stop('spinner-account-info');
    })
  }

  $scope.setPasswordFormVisible = function () {
    $scope.passwordVisible = !$scope.passwordVisible;
  }

  function save_data(customer_data) {
    $http.post('/critical/index/updateCustomerInfo/', customer_data).then(function (promise) {
      console.log(promise)
    })
  }

  $scope.updateCustomerData = function () {
    console.log($scope.customer_data);
    save_data($scope.customer_data);
  }
})


magento_module.controller("CustomerAddressBookController", function ($scope,
                                                                     $rootScope, $http,
                                                                     usSpinnerService,
                                                                     $cookies) {
  $scope.init = function () {
    console.log("Hi customer");
    usSpinnerService.spin('spinner-account');
    $http.get("/customer/account").then(function (promise) {
      console.log(promise);
      $scope.customer_data = promise.data;
      usSpinnerService.stop('spinner-account');
    })
  }
})


magento_module.controller("CustomerOrdersController", function ($scope,
                                                                $rootScope, $http,
                                                                usSpinnerService,
                                                                $cookies) {
  $scope.init = function () {
    console.log("Hi customer");
    usSpinnerService.spin('spinner-orders');
    $http.get("/critical/index/customerOrders/").then(function (promise) {
      console.log(promise);
      $scope.orders = promise.data;
      usSpinnerService.stop('spinner-orders');
    })
  }
})


magento_module.controller("CustomerWishlistController", function ($scope,
                                                                  $rootScope, $http,
                                                                  usSpinnerService,
                                                                  ElasticSearch,
                                                                  $cookies,
                                                                  WishlistElasticQuery) {
  function _get_stats() {
    var stats = $cookies.getObject('stats');
    return stats;
  }

  function get_wishlist_products(sku, products, compared_id) {
    return $http.post('/elastic/critical/index/part', {sku: sku, stats: _get_stats()}).then(function (promise) {
      var product = promise.data;
      product.wishlist_id = compared_id;
      product.sku = sku;
      products.push(product);

    });
  }


  function _iterate_wishlist_products_response(hits) {
    $scope.products = [];
    var products = hits[0]['_source']['products'];
    angular.forEach(products, function (value, key) {
      var sku = value['sku'];
      var wishlist_id = value['_id'];
      return get_wishlist_products(sku, $scope.products, wishlist_id);
    })
  }


  $scope.init = function () {
    console.log("Hi wishlist");
    usSpinnerService.spin('spinner-orders');
    var query = WishlistElasticQuery.getWishlist();
    return ElasticSearch.search(query).then(function (promise) {
      usSpinnerService.stop('spinner-orders');
      return _iterate_wishlist_products_response(promise.hits.hits);

    })
  }
})

magento_module.controller("CustomerCheckoutController", function ($scope,
                                                                  $rootScope, $http,
                                                                  usSpinnerService,
                                                                  $cookies) {
  function _init() {
    return [{header: 'Billing Information ', content: "Hi Biliing"},
      {header: 'Shipping Information', content: "Hi shipping"},
      {header: 'Shipping Method', content: "Hi shipping method"},
      {header: 'Payment Information', content: "Hi payment"},
      {header: 'Order Review', content: "Hi order review"}];
  }

  $scope.init = function () {
    console.log("Hi customer");
    $scope.panes = _init();
  }
})

magento_module.controller("CustomerLogin", function ($scope,
                                                     $rootScope, $http,
                                                     $cookies) {

  $scope.init = function () {
    console.log("Hi Login");
  }

  $scope.submitPassword = function () {
    var data = {
      customer_email: $scope.customer_email,
      password: $scope.password
    };
    return $http.post("/frontend/customer/login", data)
      .then(function (promise) {
        if(promise.data.result=='success'){
          console.log(promise);
          $cookies.putObject('token', promise.data.token)
        }

      }, function (error) {
        console.log('Error')
      })
  }

})
