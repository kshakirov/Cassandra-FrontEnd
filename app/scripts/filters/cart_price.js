magento_module.filter('cart_price_filter', function ($cookies, $filter) {


  function _get_current_currency(currency_code) {
      var currencies = {1: '$'};
      return  currencies[currency_code];
  }

 
  return function (price, currency_code) {

    return  '<span class="price">' + $filter('currency')(price, _get_current_currency(currency_code), 2) + '</span>';

  };
});
