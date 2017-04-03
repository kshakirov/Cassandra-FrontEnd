magento_module.controller("LeftMenu", function ($scope,
                                                $rootScope, $http,
                                                ElasticQuery,
                                                ElasticSearch,
                                                FiltersAggregationService,
                                                LeftMenuService,
                                                FilterModel,
                                                $routeParams,
                                                UnitsService,
                                                $location, $cookies) {
    

    /******************************AUXILLARY**************************/

    function _get_stats() {
        var stats =  $cookies.getObject('stats');
        return stats;
    }
    
    function _is_query_by_manufacturer(routeParams) {
        return $routeParams.manufacturer_id;
    }

    function _is_query_by_components(routeParams, location) {
        return $routeParams.id && !(location.url().search('critical') >= 0);
    }

    function _is_query_by_clearance(routeParams) {
        return $routeParams.clearance_id;
    }

    function _is_query_by_crititcal(routeParams, location) {
        return $routeParams.id && (location.url().search('critical') >= 0);
    }

    function _is_query_by_search(routeParams) {
        return $routeParams.query;
    }

    function _is_query_by_application(routeParams) {
        return $routeParams.application_id;
    }

    function _init_criitical(part_type_id) {
        $scope.current_filters = {};
        $scope.input_filters = [];
        critical_dimensions = true;
        FilterModel.init_filters(part_type_id).then(function (p) {
            var promise = p;
            LeftMenuService.preserve_original_filters($scope.original_filters, p);
            ElasticSearch.search(ElasticQuery.getCritDimRanges(promise, part_type_id, _get_stats())).then(function (aggs_promise) {
                var filters = promise;
                var aggs = LeftMenuService.change_type_of_response(aggs_promise);
                LeftMenuService.set_min_max_for_filters(filters);
                LeftMenuService.get_aggs_ranges(aggs, filters);
                LeftMenuService.preserve_original_filters($scope.original_filters, filters);
                $scope.filters = filters;
                angular.copy($scope.filters, $scope.input_filters);
            })
        })
    };

    function _init_components(args) {
        $scope.current_filters = {};
        LeftMenuService.addPartTypeHiddenFilter(args, $scope.current_filters);
        critical_dimensions = false;
        return FilterModel.init_by_parts_product_filters(args).then(function (p) {
            LeftMenuService.preserve_original_filters($scope.original_filters, p);
            $scope.filters = p;
            LeftMenuService.reaggregate_current_integer_filters($scope.current_filters,
                $scope.original_filters, $scope.filters);
        })
    }

    function _init_manufacturers(args) {
        $scope.current_filters = {};
        LeftMenuService.addManufacturerPaTypeHiddenFilter(args, $scope.current_filters);
        critical_dimensions = false;
        return FilterModel.init_by_manufacturer_product_filters(args).then(function (p) {
            LeftMenuService.preserve_original_filters($scope.original_filters, p);
            $scope.filters = p;
            LeftMenuService.reaggregate_current_integer_filters($scope.current_filters,
                $scope.original_filters, $scope.filters);
        })
    }

    function _init_catalog_base() {
        LeftMenuService.addCatalogVisibilityHiddenFilter($scope.current_filters);
        critical_dimensions = false;
        return FilterModel.init_by_catalog_product_filters().then(function (p) {
            LeftMenuService.preserve_original_filters($scope.original_filters, p);
            $scope.filters = p;
            LeftMenuService.reaggregate_current_integer_filters($scope.current_filters, $scope.original_filters, $scope.filters);
        })
    }


    function _init_search_catalog(query) {
        $scope.current_filters = {};
        if (query) {
            LeftMenuService.addQueryStringFilter(query, $scope.current_filters);
        }
        _init_catalog_base();
    }

    function _init_application_catalog(query) {
        $scope.current_filters = {};
        if (query) {
            LeftMenuService.addApplicationFilter(query, $scope.current_filters);
        }
        _init_catalog_base();
    }

    function _init_catalog() {
        _init_catalog_base();
    }

    function _init_clearance(args) {
        $scope.current_filters = {};
        LeftMenuService.addClearanceHiddenFilter(args, $scope.current_filters);
        critical_dimensions = false;
        return FilterModel.init_by_catalog_product_filters().then(function (p) {
            LeftMenuService.preserve_original_filters($scope.original_filters, p);
            $scope.filters = p;
            LeftMenuService.reaggregate_current_integer_filters($scope.current_filters, $scope.original_filters, $scope.filters);
        })

    }

    /************************MAIN************************************/
    $scope.current_filters = {};
    $scope.original_filters = [];

    var critical_dimensions = false;

    $scope.init = function () {

        if (_is_query_by_manufacturer($routeParams)) {
            _init_manufacturers([$routeParams.manufacturer_id, $routeParams.id]);
        }
        else if (_is_query_by_components($routeParams, $location)) {
            _init_components($routeParams.id)
        }
        else if (_is_query_by_clearance($routeParams)) {
            _init_clearance($routeParams.clearance_id);
        }
        else if (_is_query_by_crititcal($routeParams, $location)) {
            _init_criitical($routeParams.id);
        }
        else if (_is_query_by_search($routeParams)) {
            _init_search_catalog($routeParams.query);
        }
        else if (_is_query_by_application($routeParams)) {
            _init_application_catalog($routeParams.application_id);
        }
        else {
            _init_catalog();
        }
    }


    $scope.integerFilterChanged = function (selected_filter_str, index) {
        if (LeftMenuService.is_blank_selected(selected_filter_str))
            $scope.removeFilterFromCurrentFilters(LeftMenuService.prepare_filter_to_remove(selected_filter_str), $scope.current_filters);
        else {
            LeftMenuService.add_selected_filter_to_current_filters(selected_filter_str, $scope.current_filters);
            LeftMenuService.reaggregate_current_integer_filters($scope.current_filters, $scope.original_filters, $scope.filters);
            $rootScope.$broadcast('intFilterChanged', $scope.current_filters);
        }
    }


    $scope.removeFilterFromCurrentFilters = function (filter_code, current_filters) {
        delete  current_filters[filter_code];
        LeftMenuService.unselect_filter_if_blank_selected(filter_code, $scope.input_filters);
        LeftMenuService.unselect_filter_if_blank_selected(filter_code, $scope.filters);
        LeftMenuService.reaggregate_current_filters($scope.current_filters, $scope.original_filters, $scope.input_filters);
        LeftMenuService.reaggregate_current_integer_filters($scope.current_filters, $scope.original_filters, $scope.filters);
        $rootScope.$broadcast('intFilterChanged', $scope.current_filters);
        $rootScope.$broadcast('filterChanged', [[], $scope.current_filters]);
    }

    $scope.removeAllFilters = function (current_filters) {
        LeftMenuService.removeAllVisibleFilters(current_filters, $scope.input_filters);
        LeftMenuService.removeAllVisibleFilters(current_filters, $scope.filters);
        LeftMenuService.reaggregate_current_filters($scope.current_filters, $scope.original_filters, $scope.input_filters);
        LeftMenuService.reaggregate_current_integer_filters($scope.current_filters, $scope.original_filters, $scope.filters);
        $rootScope.$broadcast('intFilterChanged', $scope.current_filters);
        $rootScope.$broadcast('filterChanged', [[], $scope.current_filters]);
    }


    $scope.searchByRange = function (filter) {
        console.log(filter);
        var current_filter= {
            id: filter.options.id,
            code: filter.options.code,
            max: filter.max,
            min: filter.min,
            name: filter.options.code + ': '  + filter.min + " - " + filter.max,
            type: 'price'
        };
        LeftMenuService.add_selected_deciaml_filter_to_current_filters(current_filter, $scope.current_filters);
        LeftMenuService.reaggregate_current_filters($scope.current_filters, $scope.original_filters, $scope.input_filters);
        $rootScope.$broadcast('filterChanged', [current_filter, $scope.current_filters]);
    }
    
    $scope.renderUnits = function (units) {
            return UnitsService.getCurrentUnit(units);
    }
})
