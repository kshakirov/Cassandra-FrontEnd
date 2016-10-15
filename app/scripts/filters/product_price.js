magento_module.filter('product_price_filter', function ($cookies, $filter) {


    function _get_current_currency() {
        return $cookies.getObject('ti_currency');

    }

    function _convert_to_other_currency(price, currency_code) {
        var rates = $cookies.getObject('rates');
        return price * rates.rates[currency_code];
    }

    function _is_not_default_currency(code) {
        return code != 'USD'
    }
    return function (input, row) {
        var currency_object = _get_current_currency();
        var price = input;
        if(_is_not_default_currency(currency_object.code)){
            price = _convert_to_other_currency(price, currency_object.code);
        }

        return  '<span class="price">' + $filter('currency')(price, currency_object.symbol, 2) + '</span>';

    };
});