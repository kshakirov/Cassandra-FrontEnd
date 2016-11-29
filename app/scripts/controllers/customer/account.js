magento_module.controller("CustomerAccountController", function ($scope,
                                                                 $rootScope, $http,
                                                                 usSpinnerService,
                                                                 $location) {
  $scope.init = function () {
    usSpinnerService.spin('spinner-account');
    $http.get("/customer/account").then(function (promise) {
      $scope.customer = promise.data;
      usSpinnerService.stop('spinner-account');
      $rootScope.customerSideBar =1;
    })
  }

  $scope.changePassword = function () {
      $location.path('/customer/account/information')
  }

  $scope.editAddress = function (id) {
    $location.path('/customer/account/address/edit/' + id)
  }
})


magento_module.controller("CustomerAccountSideBarController", function ($scope,
                                                                 $rootScope) {
  $scope.init = function () {
    console.log("CustomerAccountSideBarController")
  };

  $scope.getClassByMenuItem = function (id) {
    if($rootScope.customerSideBar == id)
      return '';
    else
      return '';
  }

})





magento_module.controller("CustomerOrdersController", function ($scope,
                                                                $rootScope, $http,
                                                                usSpinnerService,
                                                                $cookies) {
  $scope.init = function () {
    console.log("Hi customer");
    usSpinnerService.spin('spinner-orders');
    $http.get("/customer/order").then(function (promise) {
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



magento_module.controller("CustomerLogin", function ($scope,
                                                     $rootScope, $http,
                                                     $cookies, $location) {

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
        if (promise.data.result == 'success') {
          console.log(promise);
          $cookies.putObject('token', promise.data.token);
          $rootScope.$broadcast('loginDone', true);
          $scope.isNotAuthorized = false;
          $location.path("/customer/account/");
        }else{
          $scope.isNotAuthorized = true;
        }

      }, function (error) {
          $scope.isNotAuthorized = true;
        console.log('Error')
      })
  }

})


magento_module.controller("CustomerOrderViewController", function ($scope,
                                                                $routeParams, $http,
                                                                usSpinnerService,
                                                                $cookies) {
  $scope.init = function () {
    console.log("Hi customer");
    var id = $routeParams.id;
    usSpinnerService.spin('spinner-order');
    $http.get("/customer/order/" + id).then(function (promise) {
      console.log(promise);
      $scope.order = promise.data;
      usSpinnerService.stop('spinner-order');
    })
  }

  $scope.printOrder = function (order_id) {
    console.log("PRINT")
    var w = window.open('/frontend/order/' + order_id + '/print');
    w.print();
    // $http.get('/customer/order/' + order_id + '/print').then(function (promise) {
    //  console.log(promise);
    // })
  }
})


var compareTo = function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        console.log(modelValue);
        console.log("RRRRR");
        console.log(scope.otherModelValue);
        //return modelValue == scope.otherModelValue;
        return true;
      };

      scope.$watch("otherModelValue", function() {
        var result  = ngModel.$validate();
        console.log(result);
      });
    }
  };
};

magento_module.directive("compareTo", compareTo);
