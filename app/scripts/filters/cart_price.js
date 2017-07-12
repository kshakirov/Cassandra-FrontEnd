magento_module.filter('cart_price_filter', function ($cookies, $filter) {


  function _get_current_currency(currency_code, scale) {
      var currencies = {'USD': '$',
      'GBP' : '£', "EUR" : "€"};
      return  currencies[currency_code];
  }


  return function (price, currency_code, scale) {
    var default_scale = 2;
    if(scale != null){
        default_scale = scale;
    }
    return  '<span class="price">' + $filter('currency')(price, _get_current_currency(currency_code), default_scale) + '</span>';

  };
});
