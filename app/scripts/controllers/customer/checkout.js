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

  function create_address_options(address) {
    //var address = address.data.billing_address;
    return [
      {id: 1, name: Object.keys(address).map(function(key) {return address[key];}).join(","), value: address},
      {id: 2, name: "New Address", value: address}
    ]
  }

  function get_currency_code() {
    var currency = $cookies.getObject('ti_currency');
    if (currency && currency.hasOwnProperty('code')) {
      return currency.code;
    }
    return "USD";
  }

  function _clear_products(products) {
    return products.map(function (product) {
      delete  product.$$hashKey;
      product.sku = product.sku.toString();
      return product;
    })
  }

  function create_order_date(shipping_address, billing_address, order) {
    return {
      customer_id: null,
      order_id: null,
      billing_address: billing_address.value,
      shipping_address: shipping_address.value,
      currency_code: get_currency_code(),
      products: _clear_products(order.products),
      subtotal: order.data.base_subtotal,
      special_instructions: order.special_instructions,
      customer_purchase_order: order.customer_purchase_order,
      grand_total: order.data.base_subtotal
    }
  }

  $scope.order = {};

  $scope.newAddress = false;

  $scope.placeOrder = function () {
    var order_data = create_order_date(this.shippingAddress, this.billingAddress, this.data);
    usSpinnerService.spin('spinner-order');
    $http.post('/customer/order/save', order_data).then(function (promise) {
      $scope.orderSent = true;
      $scope.order = promise.data;
      $scope.orderCreationError = !$scope.order.mailed;
      $scope.orderCreationSuccess  = $scope.order.mailed;
      $rootScope.product_count = 0;
      usSpinnerService.stop('spinner-order');
    }, function (error) {
      $scope.orderCreationError = true;
      usSpinnerService.stop('spinner-order');
    })
  }

  $scope.toggleAddresses = function (address_code) {
    if(address_code) {
      $scope.newBillingAddress = !$scope.newBillingAddress;
    }else{
      $scope.newSippingAddress = !$scope.newSippingAddress;
    }
  };


  function _is_maiiled(response) {
    return !response.mailed;
  }

  $scope.printOrder = function (order_id) {
    console.log("PRINT")
    var w = window.open('/frontend/order/' + order_id + '/print');
    w.print();
  }

  $scope.init = function () {
    $http.get('/customer/order/new').then(function (promise) {
      $scope.panes = _init();
      $scope.data = promise.data;
      $scope.billingAddresses = create_address_options(promise.data.data.billing_address);
      $scope.shippingAddresses = create_address_options(promise.data.data.shipping_address);
      $scope.billingAddress = $scope.billingAddresses[0];
      $scope.shippingAddress = $scope.shippingAddresses[0];
    })

  }
})
