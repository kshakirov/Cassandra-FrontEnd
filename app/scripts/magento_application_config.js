magento_module.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('sessionInjector');
}]);


magento_module.factory('sessionInjector',  function($cookies) {
  var sessionInjector = {
    request: function(config) {

      config.headers['Authorization'] = "Bearer " +  $cookies.getObject('token');

      return config;
    }
  };
  return sessionInjector;
});
magento_module.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('sessionInjector');
}]);
