magento_module.service("FiltersAggregationService", function ($cookies, $rootScope) {
  var query = {
    index: $rootScope.elastic_index,
    size: 0,
    from: 0,
    body: {}
  }

  var manufacturer_query = {
    "aggs": {
      "manufacturer_type": {
        "filter": {},
        "aggs": {
          "turbo_type": {
            "terms": {
              "field": "turbo_type.name",
              "size": 1000
            }
          }
        }
      }
    }
  }


  function _capitalize_(input) {
    return (!!input) ? input.charAt(1).toUpperCase() + input.substr(2).toLowerCase() : '';
  }

  function _create_manufacturer_scheleton(filters, limitations) {
    var local_query = {};
    angular.copy(manufacturer_query, local_query);
    local_query.aggs.manufacturer_type.filter.term = {};
    local_query.aggs.manufacturer_type.filter.term["manufacturer.code"] = limitations
    return local_query;
  }


  function _create_catalog_scheleton(filters) {
    var local_query = {};
    angular.copy(manufacturer_query, local_query);
    local_query.aggs.manufacturer_type.filter = {}
    return local_query;
  }


  function _create_component_scheleton(filters, limitations) {
    var local_query = {};
    angular.copy(manufacturer_query, local_query);
    local_query.aggs.manufacturer_type.filter.term = {};
    local_query.aggs.manufacturer_type.filter.term["part_type"] = limitations
    return local_query;


  }


  function _add_visibility_filter() {
    return {term: {"visible_in_catalog": true}};
  }

  function _add_ti_manufacturer_filter() {
    return {term: {"manufacturer.name": 'Turbo International'}};
  }

  function _add_aggregation_filters(limitations) {
    var terms = [];
    terms.push(_add_visibility_filter());
    angular.forEach(limitations, function (value, key) {
      var t = {term: {}};
      var empty = true;
      if (value.code == "turbo_type" && value.name.length > 0) {
        t.term["turbo_type.name"] = value.name;
        empty = false;
      }
      else if (value.code == "query_string" && value.option_id.length > 0) {
        var query = '*' + value.option_id.toLowerCase() + '*';
        t = {
          bool: {
            should: [{wildcard: {"ti_part.ti_part_number": query}},
              {wildcard: {"oe_ref_urls.part_number": query}},
              {wildcard: {"manufacturer.name": _capitalize_(query)}},
              {wildcard: {"ti_part.ti_part_number_clean": query}},
              {wildcard: {"oe_ref_urls.part_number_clean": query}},
              {wildcard: {"turbo_type.name": query.toUpperCase()}}]
          }
        };
        empty = false;
      }
      else if (value.code == "manufacturer" && value.option_id > 0) {
        t.term["manufacturer.code"] = value.option_id;
        empty = false;
      }
      else if (value.code == "part_type" && value.option_id.length > 0) {
        t.term["part_type"] = value.option_id;
        empty = false;
      }
      else if (value.code == "is_clearance" && value.option_id.length > 0) {
        t.term["is_clearance"] = value.option_id;
        empty = false;
      }
      else if (value.code == 'application') {
        t = value.value;
        empty = false;
      }
      if (!empty)
        terms.push(t);
    })
    return terms
  }


  function _add_units_measurements() {
    var inches = $cookies.getObject('inches');
    if (inches)
      return 'inches'
    else
      return 'centimeters'
  }

  function _check_ranges_available(ranges) {
    if (!angular.isNumber(ranges.lte)) {
      delete ranges.lte;
    }
    if (!angular.isNumber(ranges.gte)) {
      delete  ranges.gte;
    }
  }

  function _add_ranges_aggregation_filters(limitations) {
    var musts = [];
    angular.forEach(limitations, function (limitation, limitation_key) {
      var added = false;
      var r;
      if (limitation.type == 'price') {
        r = {range: {}};
        var key = limitation.id + '.value' + '.' + _add_units_measurements();
        r.range[key] = {
          gte: limitation.min,
          lte: limitation.max
        };
        _check_ranges_available(r.range[key]);
        added = true;
      } else {

      }
      if (added) {
        musts.push(r)
      }
    })
    return musts;
  }


  function _add_aggregation_subject(subject) {
    var f = {"field": "", "size": 1000}
    if (subject.code == "turbo_type") {
      f.field = "turbo_type.name";
    }
    else if (subject.code == "manufacturer") {
      f.field = "manufacturer.code";
    }
    else if (subject.code == "part_type") {
      f.field = "part_type";
    }

    return f

  }

  this.createManufactureQuery = function (filters, limitations) {
    query.body = _create_manufacturer_scheleton(filters, limitations);
    return query
  }


  this.createCatalogQuery = function (filters) {

    query.body = _create_catalog_scheleton(filters);
    return query
  }

  this.createComponentQuery = function (filters, limitations) {
    query.body = _create_component_scheleton(filters, limitations);
    return query
  }

  this.createMultiFilterQuery = function (filter, limitations) {
    var local_query = {};
    angular.copy(manufacturer_query, local_query);
    local_query.aggs.manufacturer_type.filter = {bool: {must: []}};
    local_query.aggs.manufacturer_type.filter.bool.must = _add_aggregation_filters(limitations);
    local_query.aggs.manufacturer_type.aggs.turbo_type.terms = _add_aggregation_subject(filter);
    query.body = local_query;
    return query;

  }

  this.createCritDimFilterQuery = function (filter, limitations) {
    var local_query = {
      index:  $rootScope.elastic_index,
      size: 0,
      from: 0,
      body: {
        aggs: {}
      }
    };
    local_query.body.aggs.manufacturer_type = {};
    local_query.body.aggs.manufacturer_type.filter = {bool: {must: []}};
    local_query.body.aggs.manufacturer_type.filter.bool.must = _add_ranges_aggregation_filters(limitations);
    local_query.body.aggs.manufacturer_type.filter.bool.must.push(_add_ti_manufacturer_filter());
    local_query.body.aggs.manufacturer_type.aggs = {};
    local_query.body.aggs.manufacturer_type.aggs[filter.code] = {
      stats: {
        field: filter.code + '.value' + "." + _add_units_measurements()
      }
    };

    return local_query;
  }

  function _add_aggs_key(filters) {
    var agg = {};
    angular.forEach(filters, function (filter) {
      if (filter.type == 'price') {
        agg[filter.code] = {
          stats: {
            field: filter.code + '.value' + "." + _add_units_measurements()
          }
        };
      }
    })
    return agg;
  }


  this.createCritDimFilterQueryBatch = function (filters, limitations) {
    var local_query = {
      index:  $rootScope.elastic_index,
      size: 0,
      from: 0,
      body: {
        aggs: {}
      }
    };
    local_query.body.aggs.manufacturer_type = {};
    local_query.body.aggs.manufacturer_type.filter = {bool: {must: []}};
    local_query.body.aggs.manufacturer_type.filter.bool.must = _add_ranges_aggregation_filters(limitations);
    local_query.body.aggs.manufacturer_type.filter.bool.must.push(_add_ti_manufacturer_filter());
    local_query.body.aggs.manufacturer_type.aggs = {};
    local_query.body.aggs.manufacturer_type.aggs = _add_aggs_key(filters);

    return local_query;
  }


})


