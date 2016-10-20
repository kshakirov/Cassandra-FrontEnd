magento_module.service('ComparedProductsTable', function () {

    function create_tabe( products) {
        var table = [];
        angular.forEach(products[0].critical, function (value,key) {
            var row = [];
            for(var i=0; i<products.length;i++){
                row.push(products[i].critical[key]);
            }
            table.push(row);
        })
        return table;
    }

    this.createTable = function (products) {
        return create_tabe(products);


    }

})