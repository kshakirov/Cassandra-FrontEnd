magento_module.filter('chra_2_links', function () {

    function is_not_applicable(chras) {
        if(chras && chras.hasOwnProperty('part_number') && chras.part_number=='N/A')
            return true;
        return false;
    }

    return function (chras) {
        var output = false;
        if (is_not_applicable(chras)) {
            return  output = '<b><font color="red"> N/A </font></b>';
        } else {
            angular.forEach(chras, function (chra) {
                if (output) {
                    output += ', ' + '<a href="' + chra.url + '">' + chra.part_number + '</a>';
                } else {
                    output = '<a href="' + chra.url + '">' + chra.part_number + '</a>';
                }
            })
            return output ? output : ""
        }
        ;
    }
});

