magento_module.service('WishlistElasticQuery', function ($cookies,
                                                          UnitsService, ApplicationService, PageSize) {
    var index =  'statistics';
    var type = 'wishlist';
    var search_query = {
        index: index,
        type: type,
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

    this.getWishlist = function () {
        return search_query;
    }

    this.deleteProductFromWishlist = function (compared_id) {
        delete_params.id = compared_id;
        return delete_params;
    }

    this.addProductToWishlist = function (sku, id) {
        index_params.body.product_id = id;
        index_params.body.sku = sku;
        return index_params;
    }
})