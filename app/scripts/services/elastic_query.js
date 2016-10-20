magento_module.service('ElasticQuery', function ($cookies,
                                                 UnitsService, ApplicationService, PageSize) {
    var persistent_query = {
        index: 'magento_product',
        size: PageSize.getPageSize(),
        from: 0,
        stats: 'no stats',
        body: {

            "query": {
                "filtered": {
                    "query": {},
                    "filter": {
                        "bool": {
                            "must": []
                        }
                    }
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

    var query_by_part_type = false;
    var per_page = PageSize.getPageSize();


    function _capitalize_(input) {
        return (!!input) ? input.charAt(1).toUpperCase() + input.substr(2).toLowerCase() : '';
    }


    function _add_catalog_visibility(must_array) {
        must_array.push({match: {visible_in_catalog: true}});
    }

    this.clearQuery = function (stats) {

        persistent_query.stats = stats;
        persistent_query.size = per_page;
        query_by_part_type = false;
        persistent_query.from = 0;
        persistent_query.body.query.filtered.query = {};
        persistent_query.body.query.filtered.filter = {bool: {must: []}};
    }


    function _get_sort_criteria_field_name(sorting_filed) {
        if (sorting_filed.type == 'price')
            return sorting_filed.code + '.value.' + UnitsService.addCurrentUnitProperty();
        return sorting_filed.code;
    }


    function _handle_ti_part_sorting_field(sorting_filed) {

        if (sorting_filed.code == "part_number.name") {
            return "part_number.name.raw";
        }
        return _get_sort_criteria_field_name(sorting_filed);
    }

    this.getBySorting = function (sorting_field, order) {

        var sort_criteria = {};
        sort_criteria[_handle_ti_part_sorting_field(sorting_field)] = {'order': order};
        persistent_query.body.sort[0] = sort_criteria;
        persistent_query.from = 0;
        return persistent_query;
    }


    this.getBySortingDirection = function (sorting_field, order) {

        var sort_criteria = {};
        sort_criteria[_handle_ti_part_sorting_field(sorting_field)] = {'order': order};
        persistent_query.from = 0;
        persistent_query.body.sort[0] = sort_criteria;
        return persistent_query;
    }


    this.getAll = function () {

        persistent_query.body.query.filtered.query.bool
            = {must: [{match: {visible_in_catalog: true}}]};
        return persistent_query;
    }

    function _remove_non_alpha_numeric(query) {
        return query.replace(/([^a-zA-Z\d])/gmi, '');
    }

    this.getAllFields = function (query) {

        var query = '*' + _remove_non_alpha_numeric(query.toLowerCase()) + '*';
        persistent_query.body.query.filtered.query.bool
            = {
            should: [
                {wildcard: {"ti_part.ti_part_number": query}},
                {wildcard: {"oe_ref_urls.part_number": query}},
                {wildcard: {"ti_part.ti_part_number_clean": query}},
                {wildcard: {"oe_ref_urls.part_number_clean": query}},
                {wildcard: {"manufacturer.name": _capitalize_(query)}},
                {wildcard: {"turbo_type.name": query.toUpperCase()}}]
        };
        return persistent_query;
    }

    this.getByPartType = function (part_type) {
        query_by_part_type = {match: {part_type: part_type}};
        persistent_query.body.query.filtered.query.bool
            = {must: [{match: {part_type: part_type}}]};
        _add_catalog_visibility(persistent_query.body.query.filtered.query.bool.must);
        return persistent_query;
    }


    this.getByPartTypeCritical = function (part_type) {
        query_by_part_type = {match: {part_type: part_type}};
        persistent_query.body.query.filtered.query.bool
            = {must: [{match: {part_type: part_type}}]};
        return persistent_query;
    }

    this.getByClearance = function (clearance) {
        query_by_part_type = {match: {is_clearance: clearance}};
        persistent_query.body.query.filtered.query.bool
            = {must: [{match: {is_clearance: clearance}}]};
        _add_catalog_visibility(persistent_query.body.query.filtered.query.bool.must);
        return persistent_query;
    }

    this.getByApplication = function (application_id) {
        query_by_part_type = {match: {application: application_id}};
        persistent_query.body.query.filtered.query.bool
            = {should: ApplicationService.getShouldQuery(application_id)};
        return persistent_query;
    }

    this.getByManufacturer = function (manufacturer, part_type) {
        query_by_part_type = {match: {manufacturer: manufacturer}};
        persistent_query.body.query.filtered.query.bool = {
            must: [
                {
                    match: {
                        "manufacturer.code": manufacturer
                    }
                },
                {
                    match: {
                        "part_type": part_type
                    }
                }
            ]
        };
        _add_catalog_visibility(persistent_query.body.query.filtered.query.bool.must);
        return persistent_query;
    }


    function _get_all_integer_filters(filters) {
        var matches_array = [];
        angular.forEach(filters, function (filter, filter_key) {
            var m = {match: {}};
            var empty = true;
            if (filter.code == 'turbo_type' && filter.name.length > 0) {
                m.match[filter.code + "." + "name"] = filter.name;
                empty = false;
            }
            else if (filter.code == 'is_clearance' && filter.option_id.length > 0) {
                m.match[filter.code] = filter.option_id;
                empty = false;
            }
            else if (filter.code == 'query_string') {
                //m.match[filter.code] = filter.option_id;
                empty = true;
            }
            else if (filter.code == 'application') {
                //m.match[filter.code] = filter.option_id;
                empty = true;
            }
            else if (filter.code != 'part_type' && filter.option_id.length > 0) {
                m.match[filter.code + "." + "code"] = filter.option_id;
                empty = false;
            }


            else if (filter.name.length > 0 || filter.option_id.length > 0) {
                m.match[filter.code] = filter.option_id;
                empty = false;
            }

            if (!empty)
                matches_array.push(m)
        })
        return matches_array;
    }


    function _add_query_bool_field_if_necessary(persistent_query) {
        if (!persistent_query.hasOwnProperty('bool')) {
            persistent_query.body.query.filtered.query = {bool: {must: []}}
        }

    }


    function _contains_query_string(filters) {
        if (filters.hasOwnProperty('query_string'))
            return true;
        return false
    }

    function _contains_query_application(filters) {
        if (filters.hasOwnProperty('application'))
            return true;
        return false
    }

    function _add_query_string_filters(persistent_query, filters) {
        var bool = persistent_query.body.query.filtered.filter.bool;
        var query = '*' + filters.query_string.option_id.toLowerCase() + '*';
        if (bool.hasOwnProperty('must') && bool.must.size() == 0) {

        }
        bool.should =
            [{wildcard: {"ti_part.ti_part_number": query}},
                {wildcard: {"oe_ref_urls.part_number": query}},
                {wildcard: {"ti_part.ti_part_number_clean": query}},
                {wildcard: {"oe_ref_urls.part_number_clean": query}},
                {wildcard: {"manufacturer.name": _capitalize_(query)}},
                {wildcard: {"turbo_type.name": query.toUpperCase()}}]


    }

    function _add_query_application(persistent_query, filters) {
        persistent_query.body.query.filtered.filter.bool = filters.application.value.bool;
    }

    this.getByDropDown = function (filters) {

        var matches_array = _get_all_integer_filters(filters);
        persistent_query.size = per_page;
        persistent_query.from = 0;
        _add_query_bool_field_if_necessary(persistent_query);
        if (query_by_part_type)
            persistent_query.body.query.filtered.query.bool.must.push(query_by_part_type);
        angular.forEach(matches_array, function (value, key) {
            persistent_query.body.query.filtered.query.bool.must.push(value);
        })

        if (_contains_query_string(filters)) {
            _add_query_string_filters(persistent_query, filters);
        } else if (_contains_query_application(filters)) {
            _add_query_application(persistent_query, filters);
        }
        else {
            _add_catalog_visibility(persistent_query.body.query.filtered.query.bool.must);
        }

        return persistent_query;

    }

    function _add_not_applicable_filter(slider) {
        var term = {term: {}}
        term.term[slider.id + '.applicable'] = true;
        return term;
    }

    function _create_numeric_range_filter_from_sliders(sliders) {
        var ranges = [];

        angular.forEach(sliders, function (slider, slider_key) {
            var range = {range: {}}
            range.range[slider.id + '.value' + '.' + UnitsService.addCurrentUnitProperty()] = {
                gte: slider.min,
                lte: slider.max
            };
            ranges.push(range);
            var applicable = _add_not_applicable_filter(slider);
            ranges.push(applicable);
        })
        return ranges;
    }

    this.getByNumericRange = function (filter, filters) {
        persistent_query.size = per_page;
        persistent_query.from = 0;
        var bool = _create_numeric_range_filter_from_sliders(filters);
        persistent_query.body.query.filtered.filter.bool.must = [];
        persistent_query.body.query.filtered.filter.bool.must = bool;
        return persistent_query;

    }

    this.getCritDimRanges = function (filters, part_type_id, stats) {
        var query = {
            index: 'magento_product',
            size: PageSize.getPageSize(),
            from: 0,
            stats: stats,
            body: {
                aggs: {
                    "crit_dim_filter": {
                        "filter": {
                            "bool": {
                                "must": [

                                    {
                                        "term": {
                                            "part_type": part_type_id
                                        }
                                    },
                                    {
                                        "term": {
                                            "manufacturer.name": 'Turbo International'
                                        }
                                    }

                                ]
                            }
                        },
                        "aggs": {}

                    }
                }
            }
        };


        angular.forEach(filters, function (filter, key) {
            query.body.aggs.crit_dim_filter.aggs[filter.code] = {
                stats: {
                    field: filter.code + '.value' + '.' + UnitsService.addCurrentUnitProperty()
                }
            }
        })

        return query;
    }


    this.getByPage = function (page_object) {
        persistent_query.size = PageSize.getPageSize();
        persistent_query.from = page_object.items;
        return persistent_query;
    }


    this.setPageSize = function (page_size) {
        PageSize.setPageSize(page_size);
        persistent_query.size = page_size;
        per_page = page_size;
    }

    this.addManufacturerFilter = function (query, manufacturer_name) {
        var match = {
            match: {
                'manufacturer.name': manufacturer_name
            }
        };
        query.body.query.filtered.filter.bool.must.push(match);
    }

    this.defaultSortingField = function _defalt_sorting_field() {
        return {
            code: "ti_part.ti_part_number",
            name: "TI PART",
            type: 'string'
        }
    }

    this.getOrderFromDirection = function (direction) {
        var order = 'desc';
        if (direction)
            order = 'asc'
        return order;
    }

})
