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

  function _format_address(address) {
      return address.street + ", " + address.city + ", " + address.region_id + ", "
        + address.country_id + ", " + address.postcode
  }


  function create_address_options(address) {
    var new_address = {};
    angular.copy(address, new_address);
    return [
      {
        id: 1, name: _format_address(address), value: new_address},
      {id: 2, name: "New Address", value: new_address}
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

  function _set_actual_address(addresses, index) {
    return addresses[index];
  }

  function prepare_task_data(order, customer_data) {
    return {
      order_id: order.order_id,
      email: customer_data.data.email
    }
  }

  function add_order_email_task(data) {
      $http.post('/customer/order/email', data).then(function (promise) {
        return promise
      }, function (error) {
        console.log(error)
      })
  }

  $scope.order = {};
  $scope.newBillingAddressFlag = false;
  $scope.newShippingAddressFlag = false;



  $scope.placeOrder = function () {
    var order_data = create_order_date(this.shippingAddress, this.billingAddress, this.data);
    usSpinnerService.spin('spinner-order');
    $http.post('/customer/order/save', order_data).then(function (promise) {
      $scope.orderSent = true;
      $scope.order = promise.data;
      $rootScope.product_count = 0;
      usSpinnerService.stop('spinner-order');
      return $scope.order;
    }, function (error) {
      $scope.orderCreationError = true;
      usSpinnerService.stop('spinner-order');
    }).then(function (promise) {
        var data = prepare_task_data(promise, $scope.data);
        add_order_email_task(data)
    })
  }



  $scope.toggleBillingAddress = function () {
    $scope.newBillingAddressFlag = !$scope.newBillingAddressFlag;
    $scope.applyAddress = true;
    if ($scope.newBillingAddressFlag) {
      $scope.billingAddress = _set_actual_address($scope.billingAddresses, 1);
    } else {
      $scope.billingAddress = _set_actual_address($scope.billingAddresses, 0);
    }
    $scope.applyAddress = false
  };

  $scope.toggleShippingAddress = function () {
    $scope.newShippingAddressFlag = !$scope.newShippingAddressFlag;
    $scope.applyAddress = true;
    if ($scope.newShippingAddressFlag) {
      $scope.shippingAddress = _set_actual_address($scope.shippingAddresses, 1);
    } else {
      $scope.shippingAddress = _set_actual_address($scope.shippingAddresses, 0);
    }
    $scope.applyAddress = false
  };

  $scope.printOrder = function (order_id) {
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
