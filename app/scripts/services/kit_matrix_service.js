magento_module.service("KitMatrixService", function (LexicoGraphicalSort) {

    this.hash2array = function (hash) {
        var keys = Object.keys(hash);
        return keys.map(function (key) {
          return hash[key];
        })
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
