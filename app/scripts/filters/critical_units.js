magento_module.filter('critical_units', function ($rootScope, $filter, $cookies) {
    function _is_inche_unit() {
        return $cookies.getObject('inches')
    }
    function _has_unit(input) {
        return input.unit ? true : false;
    }


    function _is_gramm_unit(input) {
        if (input.unit)
            return input.unit.toLowerCase() == 'grams';
        return false;
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
        if(_has_unit(input)){
            if(_is_gramm_unit(input)){
                return input.label + " (grams) ";
            }else if(_is_inche_unit(input)){
                return input.label + " (inches) "
            }else{
                return input.label + " (mm) "
            }
        }else{
            return input.label;
        }

    };
});