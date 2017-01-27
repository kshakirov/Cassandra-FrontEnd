magento_module.filter('tolerance', function ($rootScope, $filter, $cookies) {

    function _is_inche_unit() {
        return $cookies.getObject('inches')
    }

    function _has_any_value(input) {
        return input.value? true: false;
    }

    function _set_scale(scale) {
        return parseInt(scale)
    }

    function _get_unit_property() {
        if (_is_inche_unit())
            return 'inches'
        else
            return 'centimeters'
    }

    function _render_tolerance(input) {
        if (input.tolerance && input.tolerance.hasOwnProperty('inches')) {
            return ' &plusmn;  ' + $filter('number')(input.tolerance[_get_unit_property()], input.tolerance.scale)
        } else {
            return ""
        }
    }

    function _is_null_value(input) {
        if(input.hasOwnProperty('value') &&  input.value  &&input.value.hasOwnProperty('inches'))
            return input.value.inches == null;
        return false;
    }

    function _is_gramm_unit(input) {
        if (input.units)
            return input.units.toLowerCase() == 'grams';
        return false;
    }

    function _is_applicable(input) {
        return input.applicable
    }

    return function (input) {
        var dimension;
        var tolerance;
        if(_has_any_value(input)) {
            if (_is_applicable(input)) {
                if (_is_null_value(input)) {
                    return "<b> <font color='blue'>NULL</font></b>"
                }
                else if (_is_gramm_unit(input)) {
                    dimension = $filter('number')(input.value.inches, _set_scale(input.scale));
                }
                else if (_is_inche_unit()) {
                    dimension = $filter('number')(input.value.inches, _set_scale(input.scale));
                } else {
                    dimension = $filter('number')(input.value.centimeters, _set_scale(input.scale));
                }
                tolerance = dimension + (_render_tolerance(input));
            } else {
                tolerance = "<b> <font color='red'>N/A</font></b>"
            }
            return tolerance;
        }else{
          return "<b> <font color='blue'>NULL</font></b>"
        }
    };
});
