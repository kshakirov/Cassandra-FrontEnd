magento_module.run(function ($rootScope, $location) {

  function _is_login_url(prevUrl) {
    if (prevUrl == "/customer/account/login/")
      return true
    return false;

  }

  $rootScope.flags = {catalog: false};
  var history = [];

  $rootScope.$on('$routeChangeSuccess', function () {
    if (history.length < 10) {
      history.push($location.$$path);
    } else {
      history = history.splice(-4);
      history.push($location.$$path);
    }
  });

  $rootScope.back = function () {
    var prevUrl = history.length > 2 ? history.splice(-3)[0] : "/";
    if (_is_login_url(prevUrl)) {
      $location.path("/");
    } else {
      $location.path(prevUrl);
    }
  };

  $rootScope.elastic_index = 'turbointernational_development'


});
