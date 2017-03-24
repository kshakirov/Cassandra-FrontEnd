magento_module.controller("LoginManager", function ($scope, $http,
                                                    $rootScope, usSpinnerService,
                                                    $cookies, $location) {

  function _get_currency_symbol(currency) {
    if (currency == 'GBP')
      return '£'
    else if (currency == 'EUR')
      return '€'
    else
      return '$'
  }


  function getCurrency() {
    return $http.get(backend_path + 'currency').then(function (promise) {
      var current_currency = {
        symbol: _get_currency_symbol(promise.data.base),
        code: promise.data.base
      };
      $cookies.putObject('ti_currency', current_currency);
      $cookies.putObject('rates', promise.data)
    })
  };

  var backend_path = '/frontend/menu/';


  $scope.isAuthorized = false;
  $scope.customer = {name: " to Turbo International"};
  $scope.currencies = [{}]
  $scope.currencyOptions = [{name: 'USD'}, {name: 'EUR'}, {name: 'GBP'}];
  $scope.selectedCurrency = $scope.currencyOptions[0];

  $scope.initManager = function () {
    console.log("Hi init manager");
    getCurrency();
    return $http.get('/customer/data').then(function (promise) {
      console.log(promise.data);
      $scope.customer = promise.data;
      $scope.isAuthorized = true;
    })
  }

  $scope.logout = function () {
    $cookies.remove('token');
    console.log("Logout");
    $scope.isAuthorized = false;
    $scope.customer.name = " to Turbo International";
    $location.path('/#/');
  }

  $scope.$on('loginDone', function (event, args) {
    if (args) {
      console.log(args);
      $scope.initManager();
    }
  })

  $scope.selectCurrency = function (currency) {
    getCurrency().then(function (promise) {
      var current_currency = {
        symbol: _get_currency_symbol(currency.name),
        code: currency.name
      };
      $cookies.putObject('ti_currency', current_currency);
      $rootScope.$broadcast('currencyChanged');
    })
  }

})
