magento_module.run(function($rootScope, $location) {
  $rootScope.flags = {catalog: false};
  var history = [];

  $rootScope.$on('$routeChangeSuccess', function() {
    if(history.length < 10) {
      history.push($location.$$path);
    }else{
      history = history.splice(-4);
      history.push($location.$$path);
    }
  });

  $rootScope.back = function () {
    var prevUrl = history.length > 2 ? history.splice(-3)[0] : "/";
    $location.path(prevUrl);
  };


});
