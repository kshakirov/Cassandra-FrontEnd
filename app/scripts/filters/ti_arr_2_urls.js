magento_module.filter('ti_arr_2_urls', function () {
    function _create_url_array(ti_skus, ti_part_numbers) {
        var limit = ti_skus.length;
        var urls_string = "";
        for(var i=0;i < limit; i++){
            urls_string = urls_string + '<a href="/part/sku/' + ti_skus[i] + ' ">'+  ti_part_numbers[i] + '</a>';
            if(i< limit -1){
                urls_string = urls_string + ", ";
            }
        }
        return urls_string;
    }
    return function (ti_skus, ti_part_numbers) {



       if(ti_skus.length==1 && ti_skus[0]==null){
           return "";
       }else{
           return _create_url_array(ti_skus, ti_part_numbers);
       }

    };
});
