magento_module.controller("CustomerAddressEditController", function ($scope,
                                                                     $rootScope,
                                                                     $http,
                                                                     $routeParams,
                                                                     $location) {


  var current_address = false;

  function _get_address_type(address_id) {
    if (address_id == 1)
      return 'default_billing_address'
    return 'default_shipping_address';
  }

  $scope.init = function () {
    current_address = $routeParams.id | false;
    $http.get("/customer/account").then(function (promise) {
      $scope.customer = promise.data;
      if(current_address) {
        $scope.address = $scope.customer[_get_address_type(current_address)];
        $scope.address.region = $scope.address.region || null;
      }
      $scope.addressReady = true;
    })
  }

  $scope.save = function (customer) {
    var data = {id: customer.id, firstname: customer.firstname, lastname: customer.lastname};
    data[_get_address_type(current_address)] = customer[_get_address_type(current_address)];
    console.log(data);
    $http.put("/customer/account/", data).then(function (promise) {
      console.log("Updated");
      $location.path('customer/account/addressBook/')
    })
  }
})
