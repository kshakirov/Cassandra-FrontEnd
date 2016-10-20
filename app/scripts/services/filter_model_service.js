magento_module.service("FilterModel", function ($http) {
    this.init_filters = function (part_type) {
        return $http.get('/frontend/menu/critical/filter?part_type=' + part_type).then(function (promise) {
            return promise.data;
        })
    }

    this.init_by_parts_product_filters = function (part_type) {
        return $http.get('/elastic/critical/index/partsfilters?part_type=' + part_type).then(function (promise) {
            return promise.data;
        })
    }

    this.init_by_manufacturer_product_filters = function (args) {
        return $http.get('/elastic/critical/index/manufacturersfilters?part_type=' + args[1] + '&manufacturer=' + args[0]).then(function (promise) {
            return promise.data;
        })
    }

    this.init_by_catalog_product_filters = function () {
        return $http.get('frontend/menu/standard/filter').then(function (promise) {
            return promise.data;
        })
    }
})
