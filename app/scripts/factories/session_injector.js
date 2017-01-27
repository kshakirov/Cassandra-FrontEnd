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
magento_module.factory('sessionInjector', function ($cookies, $injector) {



  var sessionInjector = {
    request: function (config) {
        var awt = $cookies.getObject('token');

        if (angular.isUndefined(awt)) {
          var visitor_id = $cookies.getObject('visitorid');
          if(angular.isUndefined(visitor_id) && config.url.search('frontend/product') >= 0) {
            var visitorManager = $injector.get('VI');
            visitorManager.get_id().then(function (promise) {
              console.log(promise);
            })
            return config;
          }else{
            return config;
          }
        } else {
          config.headers['Authorization'] = "Bearer " + awt;
          $cookies.remove('visitorid');
          return config;
        }
      }
  };
  return sessionInjector;
});
