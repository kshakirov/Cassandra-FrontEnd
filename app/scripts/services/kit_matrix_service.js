magento_module.service("KitMatrixService", function (LexicoGraphicalSort) {

    this.hash2array = function (hash) {
            return Object.values(hash);
    };

    this.modifyHeaders = function(cols) {
        for (i = 0; i < 3; i++) {
            cols[i].title = "";
        }
        return cols;
    };
    
    this.sortByKey = function (cols, key) {
        return cols.sort(LexicoGraphicalSort.sortByKey(key));    
    }
})