magento_module.controller("ProductImageGalleryController", function ($scope,
                                                        $http, $location, ngDialog){
    var visibility_start = 0;
    $scope.init = function (sku) {
        $scope.sku =  sku;
        $http.get('/imageserver/product/' + sku + '/image_gallary').then(function ($promise) {
            $scope.images = $promise.data;
            $scope.current_host =  $location.host();
        })
    }

    var src="/imageserver/product/{{img.sku}}/image/{{img.id}}"
    function _create_url ( img_id) {
        var url = "/imageserver/product/"+ $scope.sku +"/image/" + img_id + "/1000/1000";
        return url;
    }

    function creat_template(img_id) {
        return '<div class="product-image product-image-zoom">' +
            '<img ng-click="clickToOpen(1)" ' +  ' src="' +  _create_url(img_id)  +
            '" ' +   'style="width: 1000px; left: 0px; top: 33px;"/>  </div>'
    }

    $scope.clickToOpen = function (img_id) {
        var template = creat_template( img_id);
        ngDialog.open({ template: template, plain: true});
    };

    $scope.next = function () {
        visibility_start += 1;
    };

    $scope.previous = function () {
        if(visibility_start >=1)
            visibility_start -= 1;
    };

    $scope.isVisible = function (index) {
        if((index < visibility_start + 4) && (index >= visibility_start))
            return true;
        return false;
    };
    
    $scope.isNextVisible = function (images_number) {
        if(( visibility_start + 4) <images_number)
            return true;
        return false;
    };
    $scope.isPreviousVisible = function (images_number) {
        if(visibility_start > 0)
            return true;
        return false;
    }
})