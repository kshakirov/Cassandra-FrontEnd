magento_module.controller("CartController", function ($scope,
                                                      $rootScope, $http, $cookies){

    $scope.loaded = false;
    $scope.init = function () {
        var stats =  $cookies.getObject('stats');
        return _init_cart(stats);
    }
    function _init_cart (stats) {
        return $http.get('critical/index/cartProducts?stats=' + stats).then(function (promise) {
            $scope.cart_wigdet = promise.data;
            $scope.loaded = true;
        })
    }
})
