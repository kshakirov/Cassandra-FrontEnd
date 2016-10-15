magento_module.controller("ApplicationController", function ($scope, $cookies,
                                                             ElasticSearch, ApplicationAggregationService,
                                                             ApplicationService, ApplicationElasticQuery,
                                                             $location, $rootScope) {
    $scope.breadcrumb = "Application";
  
    function _get_stats() {
        var stats = $cookies.getObject('stats');
        return stats;
    }

    function _get_application_id(promise) {
        var ids = ""
        var hits = promise.hits.hits;
        angular.forEach(hits, function (hit, key) {
                 ids += hit['_id'] + '-' ;
            })
        return ids;
    }
    
    
    function _create_human_readable_app_params() {
       return $scope.make_selected + ' / ' +  $scope.model_selected + ' / ' + $scope.year_selected;
    }

    $scope.init = function () {
        var query = ApplicationAggregationService.createMakeAggsQuery();
        ElasticSearch.search(query).then(function (promise) {
            $scope.makes = ApplicationService.transfomAggsBucketsToOptions(JSON.parse(promise));
        })

    }

    $scope.aggregateYearsByMake = function () {
        var query = ApplicationAggregationService.createYearAggsQuery($scope.make_selected);
        ElasticSearch.search(query).then(function (promise) {
            $scope.years = ApplicationService.transfomAggsBucketsToOptions(JSON.parse(promise));
        })

    }

    $scope.aggregateModelsByMakeAndYear = function () {
        var query = ApplicationAggregationService.createModelAggsQuery($scope.make_selected, $scope.year_selected);
        console.log($scope.make_selected);
        console.log($scope.year_selected);
        ElasticSearch.search(query).then(function (promise) {
            console.log(JSON.parse(promise));
            $scope.models = ApplicationService.transfomAggsBucketsToOptions(JSON.parse(promise));
        })
    }
    $scope.queryApplication = function () {
        ApplicationElasticQuery.clearQuery(_get_stats());
        var query = ApplicationElasticQuery.create($scope.make_selected,
            $scope.year_selected, $scope.model_selected);
        $rootScope.application_search_parameters = _create_human_readable_app_params();
        ElasticSearch.search(query).then(function (promise) {
            var id = _get_application_id(JSON.parse(promise));
            console.log(id);
            $location.path('/parts/application/' + id);
        })
    }
})
