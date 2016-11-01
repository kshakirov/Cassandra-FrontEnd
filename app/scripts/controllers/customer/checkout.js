magento_module.controller("CustomerCheckoutController", function ($scope,
                                                                  $rootScope, $http,
                                                                  usSpinnerService,
                                                                  $cookies) {
  function _init() {
    return [{header: 'Billing Information ', content: "Hi Biliing"},
      {header: 'Shipping Information', content: "Hi shipping"},
      {header: 'Shipping Method', content: "Hi shipping method"},
      {header: 'Payment Information', content: "Hi payment"},
      {header: 'Order Review', content: "Hi order review"}];
  }

  function create_billing_address_options(order){
    var address = order.data.billing_address;
    return [
      {id: 1, name: Object.values(address).join(",")},
      {id: 2, name: "New Address"}
    ]
  }

  $scope.order = {};

  $scope.init = function () {
    console.log("Hi customer");
    $http.get('/customer/order/new').then(function (promise) {
      $scope.panes = _init();
      $scope.data = promise.data;
      $scope.billingAddresses = create_billing_address_options(promise.data);
      console.log($scope.data)

    })

  }
})
