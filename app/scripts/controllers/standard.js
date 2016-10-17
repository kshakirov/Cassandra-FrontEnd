magento_module.controller("ByPartsProductTable", function ($scope, $rootScope,
                                                           $http, usSpinnerService,
                                                           ElasticSearch, ElasticQuery,
                                                           $routeParams, ListUtils,
                                                           Pagination, $cookies,
                                                           $q, BreadcrumbService,
                                                           ApplicationService) {


    $scope.pageSizes = [5, 10, 25, 50 ,100];
    $scope.mySlides = ['http://www.turbointernational.com/media/bannerslider/b/a/banner4.png',
    "http://www.turbointernational.com/media/bannerslider/d/e/design1.jpg"]
    $scope.data = {}
    $scope.sortingAsc = true;


    function _get_stats() {
        var stats =  $cookies.getObject('stats');
        return stats;
    }

    function init_headers(part_type) {
        return $http.get('/frontend/menu/standard/header?part_type=' + part_type).then(function (promise) {
            $scope.headers = promise.data;
            $scope.listReady = true;
            return part_type;
        })
    }

    $scope.setPageSize = function (page_size) {
        var page = {per_page: page_size, items: 0};
        ElasticQuery.setPageSize(page_size);
        var query = ElasticQuery.getByPage(page);
        $scope.pagination.per_page = page_size;
        return ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table (promise, $scope.headers);
            Pagination.render(promise);
        })
    }

    $scope.sortingDirectionChanged = function (direction, value) {
        $scope.sortingAsc = ! $scope.sortingAsc;
        var query = ElasticQuery.
        getBySortingDirection($scope.data.sorter_selected, direction);
        ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
            Pagination.render(promise);
        })
    }

    $scope.sorterChanged = function (value) {
        $scope.data.sorter_selected = value;
        var query = ElasticQuery.getBySorting(value,
            ElasticQuery.getOrderFromDirection($scope.sortingAsc));
        ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
            Pagination.render(promise);
        })
    }

    function init_sorters(part_type) {
        return $http.get('/frontend/menu/standard/sorter?part_type=' + part_type).then(function (promise) {
            $scope.sorters = promise.data;
            $scope.data.sorter_selected = $scope.sorters[0];
            return  $scope.data.sorter_selected;
        })
    }

    function _choose_query_from_parameters(params) {
        if(params.manufacturer_id) {
            $rootScope.$broadcast('initedByManufacturerProductMenu', [params.manufacturer_id, params.id]);
            $rootScope.pageTitle=": Manufacturer";
            return ElasticQuery.getByManufacturer(params.manufacturer_id, params.id)
        }
        else if(params.id) {
            $rootScope.$broadcast('initedByPartsProductMenu', params.id);
            $rootScope.pageTitle=": Component";
            return ElasticQuery.getByPartType(params.id)
        }
        else if(params.clearance_id) {
            $rootScope.$broadcast('initedByClearanceMenu', params.clearance_id);
            $rootScope.pageTitle=": Clearance";
            return ElasticQuery.getByClearance(params.clearance_id)
        }
        else if(params.application_id) {
            $rootScope.$broadcast('initedByApplicationMenu', params.application_id);
            $rootScope.pageTitle=": Application";
            return ElasticQuery.getByApplication(ApplicationService.getApplicationIds(params.application_id))
        }
        else if(params.query) {
            $rootScope.$broadcast('initedByCatalogProductMenu', 0);
            $rootScope.pageTitle=": Search";
            return ElasticQuery.getAllFields(params.query)
        }
        else {
            $rootScope.$broadcast('initedByCatalogProductMenu', 0);
            $rootScope.pageTitle=": Catalog";
            return ElasticQuery.getAll()
        }
    }



    function _prepare_promises(part_type, query) {
        var promises = [];
        promises[0] = init_sorters(part_type);
        promises[1] = init_headers(part_type);
        promises[2] = ElasticSearch.search(query)
        return promises;
    }

    function _create_initial_query(params) {
        var query = _choose_query_from_parameters(params);
        query = ElasticQuery.getBySorting(ElasticQuery.defaultSortingField());
        return query;
    }

    $scope.initTable = function () {
        $rootScope.flags.catalog = true;
        var part_type = $routeParams.id || 0;
        usSpinnerService.spin('spinner-1');
        $scope.pagination = {};
        Pagination.initialize($scope.pagination);
        ElasticQuery.clearQuery(_get_stats());
        BreadcrumbService.build_breadcrumb($routeParams);
        var query = _create_initial_query($routeParams);
        var promises = _prepare_promises(part_type,query);
        $q.all(promises).then(function(data){
            $scope.rows = ListUtils.transform_elastic_response_2_table(data[2], $scope.headers);
            Pagination.render(data[2]);
            usSpinnerService.stop('spinner-1');
        });
    }

    $scope.$on('intFilterChanged', function (event, args) {
        ElasticQuery.clearQuery(_get_stats());
        var query = ElasticQuery.getByDropDown(args);
        ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table (promise, $scope.headers);
            Pagination.render(promise);
        })

    });

    $scope.goToPage = function (page) {
        var query = ElasticQuery.getByPage(page);
        return ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table (promise, $scope.headers);
            Pagination.renderUpdated(promise, page);
        })
    }
})
