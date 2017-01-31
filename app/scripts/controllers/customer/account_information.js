magento_module.controller("CustomerAccountInformationController", function ($scope,
                                                                            $rootScope, $http) {
  $scope.passwordVisible = false;

  $scope.init = function () {
    $http.get("/customer/account").then(function (promise) {
      $scope.customer = promise.data;
    })
  }

  $scope.setPasswordFormVisible = function () {
    $scope.passwordVisible = !$scope.passwordVisible;
  };

  function _is_password_changed(customer) {
    return customer.hasOwnProperty('newPassword_1');
  }

  function _prepare_customer_gereral_data(customer) {
    return {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname, email: customer.email,
    }
  }

  function _update(url, data) {
    $http.put(url, data).then(function (promise) {
    }, function (error) {
      console.log(error)
    })
  }


  function _add_password_data(customer, data) {
    data['password'] = customer.currentPassword;
    data['password_new'] = customer.newPassword_1;
  }

  function update_customer_data(customer) {
    var data = _prepare_customer_gereral_data(customer);
    if (_is_password_changed(customer)) {
      _add_password_data(customer, data);
      _update('/customer/account/password/', data);
    } else {
      _update('/customer/account/', data);
    }
    return data;
  }

  $scope.updateCustomer = function (customer) {

    var data = update_customer_data(customer);
    console.log(data);
  }
})