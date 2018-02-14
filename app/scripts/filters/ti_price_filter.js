magento_module.filter('ti_price_filter', function ($cookies, $filter) {
    function _is_not_applicable(item) {
        if (item.value.hasOwnProperty('part_number') && item.value.part_number == 'N/A')
            return true;
        return false;
    }

    function _has_ti_chra(row) {
        var has = false;
        angular.forEach(row, function (item, key) {
            if (item.code == 'ti_chra' && !_is_not_applicable(item)) {
                has = true;
            }
        })
        return has;
    }

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

    function _is_not_logged_in(input) {
        return input=='login'
    }

    function _render_login() {
        return '<a href="/customer/account/login">Login</a>';
    }

    return function (input, row) {
        if (input == null) {
            return "";
        }else if(_is_not_logged_in(input)){
           return  _render_login();
        }
        else {
            var currency_object = _get_current_currency();
            var price = input;
            if (_is_not_default_currency(currency_object.code)) {
                price = _convert_to_other_currency(price, currency_object.code);
            }
            var price = '<span class="price">' + $filter('currency')(price, currency_object.symbol, 2) + '</span>';
            if (_has_ti_chra(row))
                return "<span class='price-label'>CHRA: </span>" + price;
            else
                return price;
        }
    };
});
