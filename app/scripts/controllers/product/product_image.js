magento_module.controller("ProductMainImageController", function ($scope,
                                                                  ngDialog){

    $scope.init = function () {
        console.log("Product Image Controller");
    };

    $scope.clickToOpen = function () {
        console.log("Hi")
        ngDialog.open({ template: 'templateId' });
    };
})