magento_module.controller("ProductController", function ($scope,
                                                         $rootScope, $http,
                                                         $routeParams,
                                                         $cookies, $filter,
                                                         NgTableParams,
                                                         StatisticElasticQuery,
                                                         ElasticSearch,
                                                         $timeout,
                                                         $filter,
                                                         KitMatrixService) {

    function _get_stats() {
      var stats = $cookies.getObject('stats');
      return stats;
    }

    function _create_link_to_product(product) {
      return "<a href='#/part/sku/" + product.sku + " '>" + product.partNumber + "</a>"
    }

    function _add_see_more_item(links_array) {
      var links_array = links_array.slice(0, 10);
      links_array.push("<i>..... see below for  more</i>");
      return links_array;
    }

    function _sort_by_part_number(links) {
      return $filter('orderBy')(links, 'partNumber', false)
    }

    function _get_ti_serviced_turbos(where_used) {
      var links_array = _sort_by_part_number(where_used).map(function (current) {
        return _create_link_to_product(current);
      });
      if (links_array.length > 10) {
        return _add_see_more_item(links_array).join(", ");

      } else {
        return links_array.join(", ");
      }
    }

    function _bom_object_2_array(boms) {
      angular.forEach(boms, function (bom) {
        var interchages_flat = bom.interchanges.map(function (interchange) {
          return interchange.part_number;
        })
        bom.interchanges_flat = interchages_flat;
      })
    }

    var compared_message_dismiss = function () {
      $scope.compared_message = false;
    };

    function _add_part_type_sort_field(current, sort_value) {
      current.oe_part_number_sort_field = sort_value;
    };

    function _is_cartridge(current) {
      return current.part_type == 'Cartridge'
    };

    function _sort_major_components(major_components) {
      return major_components.map(function (current, index, array) {
        if (_is_cartridge(current)) {
          _add_part_type_sort_field(current, "1")
          return current;
        } else {
          _add_part_type_sort_field(current, current.oe_part_number)
          return current;
        }
      })
    }

    function get_matrix_skus(cols) {
      var skus = cols.map(function (col) {
        return col.sku;
      })
      return skus;
    }

    function turbo_interchanges_to_string(turbo) {
      if (turbo.interchanges) {
        var strs_array = turbo.interchanges.map(function (t) {
          return t.part_number
        })
        return strs_array.join(", ");
      }
    }

    function process_turbos_interchanges(turbos) {
      return turbos.map(function (turbo) {
        turbo.interchanges = turbo_interchanges_to_string(turbo);
      })
    }


    $scope.tab = 1;
    $scope.qty = 1;
    $rootScope.pageTitle = ": Product";

    $scope.idSelectedPart = null;
    $scope.setSelectPart = function (idSelectedPart, col, index) {
      $scope.idSelectedPart = idSelectedPart;
      $scope.selectedCol = col;
    };

    $scope.selectedCols = function (title) {
      if ($scope.selectedCol == title.title)
        return 'selected';
    }

    $scope.selectedColsDesc = function (row) {
      if ($scope.idSelectedPart == row.part_number)
        return 'selected';
    }

    $scope.is_cartride = function () {
      if ($scope.product && $scope.product.part_type)
        return $scope.product.part_type.toLowerCase() == 'cartridge';
    };

    $scope.is_gasket_kit = function () {
      if ($scope.product && $scope.product.part_type)
        return $scope.product.part_type.toLowerCase() == 'gasket kit';
    };

    $scope.is_turbo = function () {
      if ($scope.product && $scope.product.part_type)
        return $scope.product.part_type.toLowerCase() == 'turbo';
    };

    $scope.is_Ti_manufactured = function () {
      if ($scope.product && $scope.product.manufacturer)
        return $scope.product.manufacturer.toLowerCase() == 'turbo international';
    };

    $scope.addToCart = function (qty) {

      var product = {
        product: $scope.product,
        price: $scope.price,
        qty: qty
      };

      $http.post('/customer/cart/product', product).then(function (response) {
        console.log("sent to cart");
        $scope.cart_message = $scope.product.name + " was added to your shopping cart."
      })
    };

    $scope.kit_matrix_ready = function () {
      if ($scope.kit_matrix)
        return $scope.kit_matrix.length > 0;
      return false;
    };

    $scope.getWhereUsedHeader = function () {
      if ($scope.is_turbo()) {
        return "OE Part"
      } else if ($scope.is_cartride()) {
        return "Turbo OE Part"
      } else {
        return "Cartridge OE Part"
      }
    };

    $scope.isAuthorised = function () {
      return this.authorised;
    };
    $scope.isCriticalPart = function () {
      if ($scope.product && $scope.product.hasOwnProperty('critical')) {
        if ($scope.product.critical.length > 0)
          return true;
        else
          return false;
      }
    };


    $scope.addProductToComparedProducts = function (id) {
      var sku = $routeParams.sku;
      //var query = StatisticElasticQuery.addCompareProduct(sku, id);

      console.log(sku);
      $http.put("/customer/compared_product/" + sku).then(function (promise) {
        console.log(promise);

      })
    }

    $scope.init = function () {
      // var uri = _get_product_uri($routeParams);
      var sku = $routeParams.sku;
      $rootScope.image_sku = sku;
      var stats = [_get_stats()];

      $http.post('/frontend/product', {sku: sku, stats: _get_stats()}).then(function (promise) {
        $scope.product = promise.data;
        $rootScope.image_part_type = $scope.product.part_type;
        $scope.applicationTableParams = new NgTableParams({}, {dataset: $scope.product.application_detail});
      });

      $http.get('/customer/product/' + sku + '/price').then(function (promise) {
        $scope.price = promise.data.price;
        console.log(promise.data.promise)
        $scope.authorised = true;
      }, function (error) {
        console.log(error);
        $scope.authorised = false;
      });


      $http.post('/attrsreader/product/' + sku + '/where_used/', stats).then(function (prom) {
        var where_used = [];
        if (typeof prom.data == 'object') {
          where_used = KitMatrixService.hash2array(prom.data);
          $scope.tiServiced = _get_ti_serviced_turbos(where_used);
        }
        $scope.where_usedTableParams = new NgTableParams({}, {dataset: where_used});
      });
      $http.get('/attrsreader/product/' + sku + '/bom/?stats=' + _get_stats()).then(function (prom) {
        var boms = [];
        if (typeof prom.data == 'object') {
          boms = prom.data;
          _bom_object_2_array(boms);
        }
        $scope.bomTableParams = new NgTableParams({
          sorting: {part_number: "asc"},
          page: 1,
          count: 25
        }, {dataset: boms});
      });


      $http.get('/attrsreader/product/' + sku + '/major_components/?stats=' + _get_stats()).then(function (prom) {
        var major_components = [];
        if (typeof prom.data == 'object') {
          major_components = _sort_major_components(prom.data);
        }
        $scope.majorComponentsTableParams = new NgTableParams({sorting: {oe_part_number_sort_field: "asc"}}, {dataset: major_components});
      });


      $http.get('/attrsreader/product/' + sku + '/service_kits/?stats=' + _get_stats()).then(function (prom) {
        var service_kits = [];
        if (typeof prom.data == 'object') {
          service_kits = prom.data;
        }
        $scope.serviceKitsTableParams = new NgTableParams({}, {dataset: service_kits});
      });

      $http.get('/attrsreader/product/' + sku + '/interchanges/?stats=' + _get_stats()).then(function (prom) {
        var interchanges = []
        if (typeof prom.data == 'object')
          interchanges = prom.data;

        $scope.interchangeTableParams = new NgTableParams({}, {dataset: interchanges});
      });

      $http.get('/attrsreader/product/' + sku + '/sales_notes/').then(function (prom) {
        var sales_notes = []
        if (typeof prom.data == 'object')
          sales_notes = prom.data;

        $scope.salesnotesTableParams = new NgTableParams({}, {dataset: sales_notes});
      });

      function init_batches(cols) {
        var skus = get_matrix_skus(cols.slice(3));
        return $http.post('/attrsreader/product/sales_notes/', skus).then(function (promise) {
          console.log(promise.data);
          $scope.salesBatchnotesTableParams = new NgTableParams({sorting: {part_number: "asc"}}, {dataset: promise.data});
        })
      }


      $scope.init_gasket_turbo = function () {
        console.log("Gasket Turbo Rest");
        return $http.get('/attrsreader/product/' + sku + '/gasket_turbo/?stats=' + _get_stats()).then(function (prom) {
          var turbo_gaskets = [];
          if (typeof prom.data == 'object') {
            turbo_gaskets.push(prom.data);
            process_turbos_interchanges(turbo_gaskets);
          }
          $scope.turboGaskeKitTableParams = new NgTableParams({}, {dataset: turbo_gaskets});
        });
      };

      $scope.init_gasket_kit = function () {
        console.log("Gasket Kit Rest");
        return $http.get('/attrsreader/product/' + sku + '/gasket_kit/?stats=' + _get_stats()).then(function (prom) {
          var gasket_kit_turbos = [];
          if (typeof prom.data == 'object') {
            gasket_kit_turbos = prom.data;
            process_turbos_interchanges(gasket_kit_turbos);
          }
          $scope.gasketKitTurbosTableParams = new NgTableParams({}, {dataset: gasket_kit_turbos});
        });
      }


      $scope.init_kit_matrix = function () {
        return $http.get('/attrsreader/product/' + sku + '/kit_matrix/').then(function (prom) {
          if (typeof prom.data == 'object') {
            $scope.kit_matrix = KitMatrixService.hash2array(prom.data[0]);
            $scope.cols = KitMatrixService.modifyHeaders(prom.data[1]);
            $scope.cols = KitMatrixService.sortByKey($scope.cols, 'title');
            $scope.kit_matrix = KitMatrixService.sortByKey($scope.kit_matrix, 'part_number');
            return init_batches($scope.cols)
          } else {
            $scope.cols = [];
          }

        });

      }


    }

  }
)
