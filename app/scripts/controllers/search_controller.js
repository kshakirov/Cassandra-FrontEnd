magento_module.controller("SearchController", function ($scope,
                                                        $rootScope, $location, $window) {

    function _is_outside_of_magento() {
        var current_url = $location.absUrl();
        if (current_url.search('#') < 0)
            return true;
        else
            return false;
    }


    function _search(query) {
        if (_is_outside_of_magento())
            $window.location.assign('/#/parts/search/' + query);
        else
            $location.path('/parts/search/' + query)
    }


    $scope.searchByEnterClick = function (keyEvent, query) {
        if (keyEvent.which === 13)
            _search(query);
    };

    $scope.search_in_all_fields = function (query) {
        _search(query);
    }

})
