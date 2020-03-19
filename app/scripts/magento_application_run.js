magento_module.run(function ($rootScope, $location) {

    function _is_login_url(prevUrl) {
      if (prevUrl == "/customer/account/login/")
        return true
      return false;

    }

    function _get_prev_url(history) {
      if (history.length == 2) {
        return history[0];
      } else if (history.length > 2) {
        return history.splice(-3)[0]
      }

      else {
        return '/'
      }
    }

    $rootScope.flags = {catalog: false};
    var history = [];

    $rootScope.fingerprint = new Fingerprint({screen_resolution: true}).get();

    $rootScope.$on('$routeChangeSuccess', function () {
      if (history.length < 10) {
        history.push($location.$$path);
      } else {
        history = history.splice(-4);
        history.push($location.$$path);
      }
    });


    $rootScope.back = function () {
      var prevUrl = _get_prev_url(history);
      if (_is_login_url(prevUrl)) {
        $location.path("/");
      } else {
        $location.path(prevUrl);
      }
    };

    $rootScope.elastic_index = 'turbointernational_production'


  }
);
