magento_module.service('ListUtils', function () {
    function _parse_oe_ref_obj(attribute_name, attribute_value) {
        if (attribute_name == 'oe_ref_urls') {
            var parsed = attribute_value;
            return parsed;
        } else {
            return attribute_value;
        }
    }


    function _replace_custom_url(attribute_name, attribute_value, product) {
        if (attribute_name == 'part_number') {
            var value = attribute_value;
            value[0].url =  product['_id'];
            return value;
        } else {
            return attribute_value;
        }
    }

    function _change_type_of_response(response) {
        if(typeof response=='string'){
            return JSON.parse(response)
        }else
            return response
    }

    function _add_sku_to_part_number(header, value) {
        if(header.name.toLowerCase()=='ti part'){
            return  value['_source']['sku'];
        }
        return null;
    }

    this.transform_elastic_response_2_table = function (r, headers) {
        var rows = [];
        var response = _change_type_of_response(r);
        angular.forEach(response.hits.hits, function (value, key) {
            var row = [];
            angular.forEach(headers, function (header, header_key) {
                if (value['_source'].hasOwnProperty(header.code)) {
                    var td = {};
                    td.code = header.code;
                    td.value = value['_source'][header.code];
                    td.value = _parse_oe_ref_obj(td.code, td.value);
                    td.value = _replace_custom_url(td.code, td.value, value);
                    td.sku = _add_sku_to_part_number(header, value);
                    row.push(td);
                    found = true;
                } else {
                    var td = {};
                    td.code = header.code;
                    td.value = "";

                    row.push(td);
                }
            })
            row.push({price: value['_source'].price});
            rows.push(row);
        })
        return rows;
    }
});
