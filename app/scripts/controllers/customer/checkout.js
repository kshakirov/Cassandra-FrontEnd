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

  function create_address_options(address){
    //var address = address.data.billing_address;
    return [
      {id: 1, name: Object.values(address).join(","), value: address},
      {id: 2, name: "New Address", value: address}
    ]
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
        customer_id : null,
        order_id: null,
        billing_address: billing_address.value,
        shipping_address: shipping_address.value,
        data:{
          base_currency_code: order.base_currency_code,
          base_subtotal: order.base_subtotal
        },
      products: _clear_products(order.products)
    }
  }

  $scope.order = {};


  $scope.placeOrder = function () {
      console.log("HI placeOrdere");
      var order_data = create_order_date(this.shippingAddress, this.billingAddress, this.data);
      console.log(order_data);
      $http.post('/customer/order/save', order_data).then(function (promise) {
        console.log(promise);
      }, function (error) {
            console.log(error);
      })
  }


  $scope.init = function () {
    console.log("Hi customer");
    $http.get('/customer/order/new').then(function (promise) {
      $scope.panes = _init();
      $scope.data = promise.data;
      $scope.billingAddresses = create_address_options(promise.data.data.billing_address);
      $scope.shippingAddresses = create_address_options(promise.data.data.shipping_address);
      $scope.billingAddress =  $scope.billingAddresses[0];
      $scope.shippingAddress =  $scope.shippingAddresses[0];
      console.log($scope.data)
    })

  }
})
