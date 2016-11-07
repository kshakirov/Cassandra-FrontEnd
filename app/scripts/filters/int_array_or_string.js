magento_module.filter('int_array_or_string', function () {
    return function (input) {
        if (input && typeof (input) == "object") {
            return  input.join(", ");
        } else if (typeof input == "boolean") {
            return ""
        }
        else {
            return input;
        }
        b
    };
});
