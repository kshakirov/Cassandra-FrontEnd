magento_module.controller("ProductLegendController", function ($scope,
                                                                  ngDialog){


    $scope.clickToOpen = function () {
        ngDialog.open({ template: 'legendTemplate' });
    };
})