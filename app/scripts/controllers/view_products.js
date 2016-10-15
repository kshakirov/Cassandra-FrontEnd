magento_module.controller("ViewedProductsController", function ($scope,
                                                                $rootScope, $http, $cookies){

    $scope.loaded = false;
    $scope.init = function () {
        var stats =  $cookies.getObject('stats');
        console.log("Initing viewed products");
        return _init_viewed_products(stats);
    }
    function _init_viewed_products (stats) {
        return $http.get('critical/index/viewedProducts?stats=' + stats).then(function (promise) {
            console.log(promise.data);
            $scope.viewedProducts = promise.data;
            $scope.loaded = true;
        })
    }
})
