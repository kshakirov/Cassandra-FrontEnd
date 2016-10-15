magento_module.service('UnitsService', function ($cookies) {

    function _is_grams(units) {
            return (units.toLowerCase()=='grams');
    }

    function _is_inches_or_mm(units) {
        return  (units.toLowerCase()=='inches');
    }
    function _add_inche_mms(units) {
        var inches = $cookies.getObject('inches');
        if(inches)
            return " in."
        else
            return ' mm.'
    }

    function _add_grams() {
        return "g"
    }

    function _add_units_measurement_property() {
        var inches = $cookies.getObject('inches');
        if(inches)
            return 'inches'
        else
            return 'centimeters'
    }

    function _add_units_measurement_by_unit_type(units) {
        if(units){
            if(_is_grams(units)){
                return _add_grams();
            }else if(_is_inches_or_mm(units)){
                return _add_inche_mms();
            }
        }
        return "";
    }

    this.getCurrentUnit = _add_units_measurement_by_unit_type;

    this.addCurrentUnitProperty = _add_units_measurement_property;
})
