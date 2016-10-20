magento_module.service('PageSize', function () {
    var default_per_page = 50;
    this.setPageSize = function (size) {
        default_per_page = size;
    }

    this.getPageSize = function () {
        return default_per_page;
    }
    
})