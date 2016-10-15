magento_module.controller("ComparedProductsController", function ($scope,
                                                                  $rootScope, $http,
                                                                  $cookies, ngDialog,
                                                                  ElasticSearch,
                                                                  StatisticElasticQuery,
                                                                    $timeout)
{

    function _get_stats() {
        var stats = $cookies.getObject('stats');
        return stats;
    }

    var dialog = null;
    var products_received = 0;
    $scope.loaded = false;
    $scope.reload = true;
    $scope.init = function () {
        var stats = $cookies.getObject('stats');
        return _init_compared_products(stats);
    }

    var make_compared_widget_visible = function () {
        _init_compared_products();
        $scope.reload = true;
    };

    function get_compared_products(sku, products, compared_id) {
        return $http.post('/elastic/critical/index/part', {sku: sku, stats: _get_stats()}).then(function (promise) {
            var product = promise.data;
            product.compared_id = compared_id;
            product.sku = sku;
            products.push(product);

        });
    }


    function _iterate_compared_products_response(hits) {
        $scope.products = [];
        angular.forEach(hits, function (value, key) {
            var sku = value['_source']['sku'];
            var compared_id = value['_id'];
            return get_compared_products(sku, $scope.products, compared_id);
        })
    }

    function _init_compared_products(stats) {
        var query = StatisticElasticQuery.getComparedProducts();
        return ElasticSearch.search(query).then(function (promise) {

            return _iterate_compared_products_response(promise.hits.hits)

        })
    }

    function remove_product(id, products) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].compared_id == id) {
                products.slice(i);
                return true;
            }
        }
    }


    $scope.removeItem = function (id) {
        var params = StatisticElasticQuery.deleteComparedProduct(id);
        return ElasticSearch.delete(params).then(function (promise) {
            $scope.reload = false;
            $scope.products = remove_product(id, $scope.products);
            $timeout(make_compared_widget_visible,1000);
        }, function (error) {
            console.log(error);
        })
    };


    $scope.openModal = function () {
        $scope.hello_from_parent = "Hello from parent";
        dialog = ngDialog.open({
            template: '/skin/frontend/default/default/views/compare_modal.html',
            controller: 'ComparedProductsModalController',
            scope: $scope
        });
        dialog.closePromise.then(function (data) {

        });
    }
})




