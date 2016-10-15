magento_module.service("ApplicationElasticQuery", function () {
    var query = {
        index: 'magento_product',
        size: 10,
        from: 0,
        stats: 'no stats',
        body: {
            "query": {
                "bool": {
                    "must": []
                }
            }
        }


    };

    this.clearQuery = function (stats) {
        query.stats = stats;
        query.body.query.bool.must = [];
    }

    this.create = function (make, year, model) {
        var m = {
            "term": {
                "make": make
            }
        };
        var ml = {
            "term": {
                "model": model
            }
        }
        var y = {
            "term": {
                "year": year
            }
        }
        query.body.query.bool.must = [m, ml, y];
        return query;
    }
    
    
})
