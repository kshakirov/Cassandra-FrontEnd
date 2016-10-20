magento_module.service('ApplicationAggregationService', function () {

    var query = {
        index: 'magento_product',
        size: 0,
        from: 0,
        body: {}
    };


    var aggs = {
        "aggs": {
            "application": {
                "filter": {
                    "bool": {
                        "must": []
                    }
                },
                "aggs": {
                    "application_type": {}
                }
            }
        }
    }


    this.createMakeAggsQuery = function () {
        var local_aggs = {};
        var local_query = {};
        angular.copy(aggs, local_aggs);
        angular.copy(query, local_query);
        local_aggs.aggs.application.aggs.application_type = {
            "terms": {
                "field": "make",
                "size": 1000,
                "order" : { "_term" : "asc" }
            }
        }
        local_query.body = local_aggs;
        return local_query;
    }


    this.createYearAggsQuery = function (make_query) {
        var local_aggs = {};
        var local_query = {};
        angular.copy(aggs, local_aggs);
        angular.copy(query, local_query);
        var t = {term: {make: make_query}};
        local_aggs.aggs.application.filter.bool.must.push(t);
        local_aggs.aggs.application.aggs.application_type = {
            "terms": {
                "field": "year",
                "size": 1000,
                "order" : { "_term" : "asc" }
            }
        }
        local_query.body = local_aggs;
        return local_query;
    }

    this.createModelAggsQuery = function (make_query, year_query) {
        var local_aggs = {};
        var local_query = {};
        angular.copy(aggs, local_aggs);
        angular.copy(query, local_query);
        var t1 = {term: {make: make_query}};
        var t2 = {term: {year: year_query}};
        local_aggs.aggs.application.filter.bool.must.push(t1);
        local_aggs.aggs.application.filter.bool.must.push(t2);
        local_aggs.aggs.application.aggs.application_type = {
            "terms": {
                "field": "model",
                "size": 1000,
                "order" : { "_term" : "asc" }
            }
        }
        local_query.body = local_aggs;
        return local_query;
    }

})


