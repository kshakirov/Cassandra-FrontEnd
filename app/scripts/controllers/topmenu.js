magento_module.controller("Menus", function ($scope, $http,
                                             $rootScope, usSpinnerService,
                                             $cookies, $location, BreadcrumbService,
                                             $routeParams) {

   var backend_path = '/frontend/menu/';

  /*********************SCOPE ************************************/

  $scope.menu = {critical: false, component: false, manufacturer: false};



  $scope.init = function () {
    return $http.get(backend_path + 'critical').then(function (promise) {
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
  };

  $scope.getComponentListItemClass = function (item) {
    if (item[3])
      return item[3];
    return ""
  };


  $scope.getMouseOverAction = function (menu_item) {
    $scope.menu[menu_item] = true;
  };

  $scope.getMouseOutAction = function (menu_item) {
    $scope.menu[menu_item] = false;
  };

  $scope.getOverClass = function (menu_item, style) {
    if ($scope.menu[menu_item])
      return style
  };


})
