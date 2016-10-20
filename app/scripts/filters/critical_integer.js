magento_module.filter('critical_integer', function () {
    function _has_any_value(input) {
        return input.value ? true : false;
    }

    function _is_null_value(input) {
        if (input.hasOwnProperty('value') && input.value)
            return input.value == null;
        return false;
    }

    function _is_applicable(input) {
        return input.applicable
    }

    return function (input) {
        if (_has_any_value(input)) {
            if (_is_applicable(input)) {
                if (_is_null_value(input)) {
                    return "<b> <font color='blue'>NULL</font></b>"
                }
                else {
                    return input.value;
                }
            } else {
                return "<b> <font color='red'>N/A</font></b>"
            }
        }else{
            return " - ";
        }
    };
});