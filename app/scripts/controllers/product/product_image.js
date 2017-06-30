magento_module.controller("ProductMainImageController", function ($scope,
                                                                  ngDialog){

    $scope.init = function () {
    };

    $scope.clickToOpen = function () {
        ngDialog.open({ template: 'templateId' });
    };
})
