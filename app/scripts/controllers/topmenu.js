magento_module.controller("Menus", function ($scope, $http,
                                             $rootScope, usSpinnerService,
                                             $cookies, $location,BreadcrumbService,
                                             $routeParams) {

    function _get_currency_id(currency_symbol) {
        if (currency_symbol == '£')
            return 'GBP'
        else if (currency_symbol == '€')
            return 'EUR'
        else
            return 'USD'
    }
    var backend_path = '/frontend/menu/';
    /*********************SCOPE ************************************/
    $scope.init = function () {
        return $http.get(backend_path + 'part').then(function (promise) {
            usSpinnerService.spin('spinner-1');
            $rootScope.criticalParts = promise.data;
            usSpinnerService.stop('spinner-1');
        })
    }

    $scope.initComponentsSubMenus = function () {
        return $http.get(backend_path + 'part').then(function (promise) {
            $rootScope.stdParts = promise.data;
            BreadcrumbService.build_breadcrumb($routeParams);
        })
    }

    $scope.initManufacturers = function () {
        return $http.get(backend_path + 'manufacturer').then(function (promise) {
            $rootScope.manufacturers = promise.data[0];
            $rootScope.parts = promise.data[1];
            BreadcrumbService.build_breadcrumb($routeParams);
        })
    }

    $scope.toggleList = function (index) {
        $scope.current_index = index;
        $scope.isDown = !$scope.isDown;
    }

    $scope.unToggleList = function (index) {
        $scope.isDown = !$scope.isDown;
    }

    $scope.getClass = function (index) {
        if ($scope.current_index == index)
            return $scope.isDown ? "shown-sub" : ""
    }

    $scope.getComponentListItemClass = function (item) {
        if(item[3])
            return item[3];
        return ""
    }

    $scope.getStats = function (stats) {
        console.log("Statistics  => " + stats);
        $cookies.putObject('stats', stats);
    }

    $scope.getCurrency = function (currency_symbol) {
        var current_currency = {
            symbol: currency_symbol,
            code: _get_currency_id(currency_symbol)
        };
        $cookies.putObject('ti_currency', current_currency);
        $http.get(backend_path + 'currency').then(function (promise) {
            $cookies.putObject('rates', promise.data)
        })
    }

  
})
