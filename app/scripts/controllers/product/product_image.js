magento_module.controller("ProductMainImageController", function ($scope,
                                                                  ngDialog){

    $scope.init = function () {
        console.log("Product Image Controller");
    };

    $scope.clickToOpen = function () {
        ngDialog.open({ template: 'templateId' });
    };
})
