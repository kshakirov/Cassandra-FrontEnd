magento_module.service("VI", function ($http, $cookies) {
  function generate_visitor_id() {
    return $http.get('/frontend/visitor/id/').then(function (promise) {
      var data = promise.data;
      $cookies.putObject('visitorid', data.visitor_id);
      return true;
    })
  }
  this.get_id = generate_visitor_id;
})
magento_module.factory('sessionInjector', function ($cookies, $rootScope) {



  var sessionInjector = {
    request: function (config) {
        var awt = $cookies.getObject('token');
          config.headers['Authorization'] = "Bearer " + awt;
          config.headers['X-Visitor'] = $rootScope.fingerprint || "test";
          return config;
      }
  };
  return sessionInjector;
});
