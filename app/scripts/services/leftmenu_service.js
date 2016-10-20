magento_module.service("LeftMenuService", function (FiltersAggregationService,
                                                    ElasticSearch, UnitsService,
                                                    ApplicationService) {

    function _change_type_of_response(response) {
        if (typeof response == 'string') {
            return JSON.parse(response)
        } else
            return response
    }

    this.change_type_of_response = _change_type_of_response;

    function _rearange_decimal_filters(bucket, filter) {
        filter.min = bucket.min;
        filter.max = bucket.max;
        filter.options.floor = bucket.min;
        filter.options.ceil = bucket.max;
        return filter;
    }


    function _rearange_integer_filters(buckets, filter) {
        var options = [];
        angular.forEach(filter.options, function (option, option_key) {
            var empty_exist = false;
            angular.forEach(buckets, function (bucket, bucket_key) {
                if (option.name.toLowerCase() == bucket.key) {
                    options.push(option);
                }

                if (option.name == bucket.key) {
                    options.push(option);
                }
                else if (option.option_id == bucket.key) {
                    options.push(option);
                }
                else if (option.name == "" && !empty_exist) {
                    console.log("EMPTY");
                    empty_exist = true;
                    options.push(option);
                }
            })
        })

        filter.options = options;
        return filter;
    }


    function _rearrangeFiltersByAggregation(original_filter, aggregated_filter_str) {
        var filter = {};
        var aggregated_filter = _change_type_of_response(aggregated_filter_str);
        angular.copy(original_filter, filter);
        if (aggregated_filter.aggregations.manufacturer_type.hasOwnProperty('turbo_type')) {
            var buckets = aggregated_filter.aggregations.manufacturer_type.turbo_type.buckets;
            return _rearange_integer_filters(buckets, filter);
        } else {
            var bucket = aggregated_filter.aggregations.manufacturer_type[filter.code];
            return _rearange_decimal_filters(bucket, filter);

        }

    }

    function _find_filter_key_by_code(filters, sliderid) {
        var key = 0;
        for(var i =0; i< filters.length; i++){
            if(filters[i].code==sliderid){
                key = i;
                break;
            }
        }
        return key;
    }

    this.rearrangeFiltersByAggregation = _rearrangeFiltersByAggregation;

    function _set_min_max_for_filters(filters) {
        angular.forEach(filters, function (value, key) {
            
            value.min = 0;
            value.max = 0;
            value.options = {
                floor: 0,
                ceil: 0,
                step: 0.001,
                precision: parseInt(value.scale),
                id: value.code,
                code: value.name,
                units: value.units,
                translate: function (value, sliderid ) {
                    var key = _find_filter_key_by_code(filters, sliderid);
                    var  units = filters[key].units;
                    var measurement= UnitsService.getCurrentUnit(units);
                    return value + measurement;
                }
            }
        })
    }

    this.set_min_max_for_filters = _set_min_max_for_filters;

    function _get_aggs_ranges(aggs, filters) {
        angular.forEach(aggs.aggregations.crit_dim_filter, function (aggregation, key) {
            angular.forEach(filters, function (filter, filter_key) {
                if (key == filter.options.id) {
                    filter.options.floor = aggregation.min;
                    filter.options.ceil = aggregation.max;
                    filter.max = aggregation.max;
                    filter.min = aggregation.min;

                }
            })
        })
    }

    this.get_aggs_ranges = _get_aggs_ranges;

    function _add_selected_filter_to_current_filters(selected_filter, current_filters) {
        var filter = JSON.parse(selected_filter);
        current_filters[filter.code] = filter;
    }

    this.add_selected_filter_to_current_filters = _add_selected_filter_to_current_filters;

    function _add_selected_deciaml_filter_to_current_filters(selected_filter, current_filters) {
        current_filters[selected_filter.code] = selected_filter;
    }

    this.add_selected_deciaml_filter_to_current_filters = _add_selected_deciaml_filter_to_current_filters;

    function _get_not_changed_current_filters(selected_filters, original_filters) {
        var not_changed_filters = [];
        angular.forEach(original_filters, function (original, original_key) {
            var found = false;
            angular.forEach(selected_filters, function (selected, selected_key) {
                if (original.code == selected_key) {
                    found = true;
                }
            })
            if (!found) {
                not_changed_filters.push(original);
            }
        })
        return not_changed_filters;
    }


    function _get_filters_for_aggregation_query(selected_filters) {
        var filters = [];
        angular.forEach(selected_filters, function (filter, key) {
        })
        return filters;
    }


    function _replace_filter_with_reaggregated(filters, reaggregated_filter) {
        angular.forEach(filters, function (filter, key) {
            if (filter.code == reaggregated_filter.code && !reaggregated_filter.options.hasOwnProperty('precision')) {
                filter.options = reaggregated_filter.options;
            } else if (filter.code == reaggregated_filter.code && reaggregated_filter.options.hasOwnProperty('precision')) {
                filter.max = reaggregated_filter.max;
                filter.min = reaggregated_filter.min;
                filter.options = reaggregated_filter.options;
            }
        })
    }

    function _reaggregate_current_filters(selected_filters, original_filters, current_filters) {
        var not_changed_filters = _get_not_changed_current_filters(selected_filters, original_filters);
        var aggs_query = '';
        angular.forEach(not_changed_filters, function (ncf, key) {
            if (ncf.type != 'price') {
                aggs_query = FiltersAggregationService.createMultiFilterQuery(ncf, selected_filters);
                ElasticSearch.search(aggs_query).then(function (promise) {
                    var reaggregated_filter = _rearrangeFiltersByAggregation(ncf, promise);
                    _replace_filter_with_reaggregated(current_filters, reaggregated_filter);
                }, function (error) {
                })
            } else {
                aggs_query = FiltersAggregationService.createCritDimFilterQuery(ncf, selected_filters);
                ElasticSearch.search(aggs_query).then(function (promise) {
                    var reaggregated_filter = _rearrangeFiltersByAggregation(ncf, promise);
                    _replace_filter_with_reaggregated(current_filters, reaggregated_filter);
                })
            }


        })

    }

    this.reaggregate_current_filters = _reaggregate_current_filters;


    function _preserve_original_filters(original_filters, promise) {
        angular.copy(promise, original_filters);
    }

    this.preserve_original_filters = _preserve_original_filters;


    function _is_blank_selected(selected_filter) {
        var filter = JSON.parse(selected_filter);
        if (filter.name == "" && filter.option_id == "")
            return true
        else
            return false
    }

    this.is_blank_selected = _is_blank_selected;

    function _prepare_filter_to_remove(selected_filter_str) {
        var selected_filter = JSON.parse(selected_filter_str);
        return selected_filter.code
    }

    this.prepare_filter_to_remove = _prepare_filter_to_remove;


    function _unselect_filter_if_blank_selected(filter_code, filters) {
        angular.forEach(filters, function (filter, filter_key) {
            if (filter.code == filter_code) {
                var selected = JSON.parse(filter.selected);
                selected.name = "";
                selected.option_id = "";
                filter.selected = JSON.stringify(selected);
            }
        })
    }

    this.unselect_filter_if_blank_selected = _unselect_filter_if_blank_selected;

    function _createPartTypeHiddenFilter(part_type) {
        var filter = {"name": "", "option_id": part_type, "code": "part_type", hidden: true};
        return filter;
    }

    function _createClearanceeHiddenFilter(clearance) {
        var filter = {"name": clearance, "option_id": clearance, "code": "is_clearance", hidden: true};
        return filter;
    }

    function _createCatalogVisibilityHiddenFilter() {
        var filter = {"name": true, "option_id": true, "code": "visible_in_catalog", hidden: true};
        return filter;
    }

    function _createQueryStringFilter(query) {
        var filter = {"name": "", "option_id": query, "code": "query_string", hidden: true};
        return filter;
    }

    function _createManufacturerPartTypeHiddenFilter(manufacturer) {
        var filter = {"name": "", "option_id": manufacturer, "code": "manufacturer", hidden: true};
        return filter;
    }

    this.addPartTypeHiddenFilter = function (part_type, current_filters) {
        var filter = _createPartTypeHiddenFilter(part_type);
        current_filters[filter.code] = filter;
    }

    this.addManufacturerPaTypeHiddenFilter = function (ids, current_filters) {
        var filter = _createPartTypeHiddenFilter(ids[1]);
        current_filters[filter.code] = filter;
        var filter_manufacturer = _createManufacturerPartTypeHiddenFilter(ids[0]);
        current_filters[filter_manufacturer.code] = filter_manufacturer;
    }

    this.addClearanceHiddenFilter = function (clearance, current_filters) {
        var filter = _createClearanceeHiddenFilter(clearance);
        current_filters[filter.code] = filter;
    }
    this.addQueryStringFilter = function (query, current_filters) {
        var filter = _createQueryStringFilter(query);
        current_filters[filter.code] = filter;
    }

    this.addCatalogVisibilityHiddenFilter = function (current_filters) {
        var filter = _createCatalogVisibilityHiddenFilter();
        current_filters[filter.code] = filter;
    }

    this.addApplicationFilter = function (query, current_filters) {
        var ids = ApplicationService.getApplicationIds(query)
        var filter = ApplicationService.getShouldFilter(ids);
        current_filters[filter.code] = filter;
    }


    this.removeAllVisibleFilters = function (current_filters, filters) {
        var visible_filters = [];
        angular.forEach(current_filters, function (filter, filter_key) {
            if (!filter.hidden) {
                visible_filters.push(filter.code);
                _unselect_filter_if_blank_selected(filter.code, filters)
            }
        })
        angular.forEach(visible_filters, function (filter) {
            delete  current_filters[filter];
        })
    }


})


