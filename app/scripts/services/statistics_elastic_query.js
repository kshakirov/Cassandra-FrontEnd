magento_module.service('StatisticElasticQuery', function ($cookies,
                                                 UnitsService, ApplicationService, PageSize) {
    var index =  'statistics';
    var type = 'comparison';
    var search_query = {
        index: index,
        size: PageSize.getPageSize(),
        from: 0,
        body: {

            "query": {
                "match": {

                }
            },
            "sort": [
                {
                    "_uid": {
                        "order": "desc"
                    }
                }
            ]
        }
    };

    var delete_params = {
        index: index,
        type: type,
        id: null
    };

    var index_params = {
        index: index,
        type: type,
        body: {
            customer_id: null,
            product_id: null,
            sku: null,
            store_id: null,
            visitor_id: null
        }
    }

    this.getComparedProducts = function () {
        return search_query;
    }

    this.deleteComparedProduct = function (compared_id) {
        delete_params.id = compared_id;
        return delete_params;
    }
    
    this.addCompareProduct = function (sku, id) {
        index_params.body.product_id = id;
        index_params.body.sku = sku;
        return index_params;
    }
})