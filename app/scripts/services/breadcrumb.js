magento_module.service("BreadcrumbService", function ($rootScope, $location) {
    function _get_name_by_id(parts, part_type_id) {
        var part_type_name = false;
        angular.forEach(parts, function (item, key) {
            if (item[1] == part_type_id)
                part_type_name = item[0]
        })
        return part_type_name;
    }


    function _is_crit_diminsion_path() {
        return $location.url().search('critical') >= 0;

    }

    function _get_part_type_name_by_id(part_type_id) {
        return _get_name_by_id($rootScope.stdParts, part_type_id);
    }


    function _get_manufacturer_name_by_id(manufacturer_id) {
        return _get_name_by_id($rootScope.manufacturers, manufacturer_id);
    }

    function createBreadcrumbCritical(part_type_id) {
       var path =   _get_part_type_name_by_id(part_type_id);
        if(path)
            return 'Critical / ' + path + ' /';
    }

    function createBreadcrumbComponent(part_type_id) {
        var path =   _get_part_type_name_by_id(part_type_id);
        if(path)
            return 'Component / ' + path + ' /';
    }


    function createBreadcrumbManufacturerComponent(manufacturer_id, part_type_id) {
        var manufacturer_path =   _get_manufacturer_name_by_id(manufacturer_id);
        var path =   _get_part_type_name_by_id(part_type_id);
        if(path && manufacturer_path)
        return 'Component / ' +
            manufacturer_path + ' / ' +
            path +
            ' /';
    }

    function createBreadcrumbClearance() {
        return 'Component / ';
    }


    function createBreadcrumbApplicationSearch() {
        return 'Search / ' + $rootScope.application_search_parameters + ' /'
    }


    function createBreadcrumbSearch(params) {
        return 'Search / ' + params + ' /'
    }


    function createBreadcrumbCatalog() {
        return 'Catalog / '
    }

    this.build_breadcrumb = function _build_breadcrump(params) {
        if (params.manufacturer_id) {
            $rootScope.breadcrumb = createBreadcrumbManufacturerComponent(params.manufacturer_id, params.id);
        }
        else if (params.id && _is_crit_diminsion_path()) {
            $rootScope.breadcrumb = createBreadcrumbCritical(params.id);
        }
        else if (params.id) {
            $rootScope.breadcrumb = createBreadcrumbComponent(params.id);
        }
        else if (params.clearance_id) {
            $rootScope.breadcrumb = createBreadcrumbClearance();
        }
        else if (params.application_id) {
            $rootScope.breadcrumb = createBreadcrumbApplicationSearch(params.application_id);
        }
        else if (params.query) {
            $rootScope.breadcrumb = createBreadcrumbSearch(params.query);
        }
        else {
            $rootScope.breadcrumb = createBreadcrumbCatalog();
        }
    }


})
