magento_module.service("ApplicationService", function () {
    this.transfomAggsBucketsToOptions = function (aggs_response) {
        var options = [];
        var buckets = aggs_response.aggregations.application.application_type.buckets;
        angular.forEach(buckets, function (bucket, bucket_key) {
            options.push(bucket.key);
        })
        return options;
    }

    this.getApplicationIds = function (string) {
        var ids = string.split("-");
        if (ids.length > 1) {
            ids.pop();
        }
        return ids;
    }

    this.getShouldQuery = function (ids) {
        var should_array = [];
        angular.forEach(ids, function (id, key) {
            var match = {match: {application: id}}
            should_array.push(match);
        })
        return should_array;
    }

    this.getShouldFilter = function (ids) {
        var filter = {
            code: 'application', option_id: "",
            name: "application", hidden: true,
            value: {bool: {}}
        };
        filter.value.bool.should = [];
        angular.forEach(ids, function (id, key) {
            var match = {match: {application: id}}
            filter.value.bool.should.push(match);
        })
        return filter;
    }


})
