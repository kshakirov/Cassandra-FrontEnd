magento_module.controller("ComparedProductsModalController", function ($scope,
                                                                       $rootScope, $http, $cookies,
                                                                       StatisticElasticQuery,
                                                                       ElasticSearch,
                                                                       ComparedProductsTable) {

    function _is_of_one_type(products) {
        var current = false;
        for (var i = 0; i < products.length; i++) {
            if (!current) {
                current = products[i].part_type;
            } else {
                if (current != products[i].part_type)
                    return false;
            }
        }
        return true;
    };


    $scope.init = function () {
        if (_is_of_one_type($scope.products)) {
            $scope.comparedTable = ComparedProductsTable.createTable($scope.products);
        }
    }
})