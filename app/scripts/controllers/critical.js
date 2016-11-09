magento_module.controller("CriticalController", function ($scope, $rootScope,
                                                          $http, usSpinnerService,
                                                          ElasticSearch, ElasticQuery,
                                                          $routeParams, ListUtils,
                                                          Pagination, $cookies,
                                                          $location, $route, $q,
                                                          BreadcrumbService) {

    $scope.data = {};
    $scope.sortingAsc = true;
    $scope.headers = ['Ti', 'OE REF', 'Description', 'C/E DIA'];
    $scope.pageSizes = [5, 10, 25, 50, 100];


    function _get_stats() {
        var stats = $cookies.getObject('stats');
        return stats;
    }

    $scope.setPageSize = function (page_size) {
        var page = {per_page: page_size, items: 0};
        ElasticQuery.setPageSize(page_size);
        var query = ElasticQuery.getByPage(page);
        return ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
            Pagination.render(promise);
        })
    }

    function init_table(part_type) {
        return $http.get('/frontend/menu/critical/header?part_type=' + part_type).then(function (promise) {
            usSpinnerService.spin('spinner-1');
            $scope.headers = promise.data;
            $scope.listReady = true;
            usSpinnerService.stop('spinner-1');
            return part_type;
        })
    }

    function init_sorters(part_type) {
        return $http.get('/frontend/menu/critical/sorter?part_type=' + part_type).then(function (promise) {
            $scope.sorters = promise.data;
            $scope.data.sorter_selected = $scope.sorters[0];
            return $scope.data.sorter_selected;
        })
    }

    $scope.sortingDirectionChanged = function (direction, sorting_field) {
        $scope.sortingAsc = ! $scope.sortingAsc;
        var query = ElasticQuery.getBySortingDirection(sorting_field, direction);
        ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
            Pagination.render(promise);
        })
    }

    $scope.sorterChanged = function (value) {

        $scope.data.sorter_selected = value;
        var query = ElasticQuery.getBySorting($scope.data.sorter_selected,
            ElasticQuery.getOrderFromDirection($scope.sortingAsc));
        ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
        })
    }

    function _prepare_promises(part_type, query) {
        var promises = [];
        promises[0] = init_sorters(part_type);
        promises[1] = init_table(part_type);
        promises[2] = ElasticSearch.search(query)
        return promises;
    }

    function _create_initial_query(part_type) {
        var query = ElasticQuery.getByPartTypeCritical(part_type);
        query = ElasticQuery.getBySorting(ElasticQuery.defaultSortingField());
        ElasticQuery.addManufacturerFilter(query, 'Turbo International');
        return query;
    }

    $scope.initTable = function () {
        $rootScope.pageTitle=": Critical";
        $rootScope.flags.catalog = true;
        var part_type = $routeParams.id;
        $scope.pagination = {};
        Pagination.initialize($scope.pagination);
        ElasticQuery.clearQuery(_get_stats());
        $scope.sorter_parttype = part_type;
        var query = _create_initial_query(part_type);
        var promises = _prepare_promises(part_type,query);
        BreadcrumbService.build_breadcrumb($routeParams);
        $q.all(promises).then(function(data){
            $scope.rows = ListUtils.transform_elastic_response_2_table(data[2], $scope.headers);
            Pagination.render(data[2]);
        });
    };

    $scope.$on('filterChanged', function (event, args) {
        var query = ElasticQuery.getByNumericRange(args[0], args[1]);
        ElasticQuery.addManufacturerFilter(query, 'Turbo International');
        ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
            Pagination.render(promise);
        })
    });

    $scope.goToPage = function (page) {
        var query = ElasticQuery.getByPage(page);
        return ElasticSearch.search(query).then(function (promise) {
            $scope.rows = ListUtils.transform_elastic_response_2_table(promise, $scope.headers);
            Pagination.renderUpdated(promise, page);
        })
    }

    function _toggle_unit_button(units) {
        units.inches = !units.inches;
        if (!units.inches) {
            return 'Show in inch';
        } else {
            return 'Show in mm';
        }
    }

    $scope.initButton = function () {
        $inches = $cookies.getObject('inches');
        if (!$inches) {
            $scope.units = {inches: false}
            $scope.unitsButton = 'Show in  inch.';
        } else {
            $scope.units = {inches: true}
            $scope.unitsButton = 'Show in mm.';
        }
    }

    $scope.toggleMesurements = function () {
        $scope.unitsButton = _toggle_unit_button($scope.units, $scope.unitsButton);
        $cookies.putObject('inches', $scope.units.inches);
        $route.reload();
    };

})
