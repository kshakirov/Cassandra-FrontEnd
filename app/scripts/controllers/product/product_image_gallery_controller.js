magento_module.controller("ProductImageGalleryController", function ($scope,
                                                                     $http, $location, ngDialog) {
  var visibility_start = 0;
  $scope.init = function (sku) {
    $scope.sku = sku;
    $http.get('/imageserver/product/' + sku + '/image_gallary').then(function ($promise) {
      $scope.images = $promise.data;
      $scope.current_host = $location.host();
    })
  }

  var src = "/imageserver/product/{{img.sku}}/image/{{img.id}}"

  function _create_url(sku, img_id) {
    return "/imageserver/product/" + sku + "/image/" + img_id + "/1000/1000";
  }

  function _create_img_urls_string(sku, images) {
    var img_urls = images.map(function (img) {
      return _create_url(sku, img.id)
    })
    return img_urls.join(',');
  }

  function creat_template(current_img_url, sku, images) {
    return '<image-gallary images="' + _create_img_urls_string(sku, images) +
      '" current_image_url="' + current_img_url + '"></image-gallary>'
  }

  $scope.clickToOpen = function (img_id) {
    var current_image = _create_url($scope.sku, img_id);
    var template = creat_template(current_image, $scope.sku, $scope.images);
    ngDialog.open({template: template, plain: true});
  };

  $scope.next = function () {
    visibility_start += 1;
  };

  $scope.previous = function () {
    if (visibility_start >= 1)
      visibility_start -= 1;
  };

  $scope.isVisible = function (index) {
    if ((index < visibility_start + 4) && (index >= visibility_start))
      return true;
    return false;
  };

  $scope.isNextVisible = function (images_number) {
    if (( visibility_start + 4) < images_number)
      return true;
    return false;
  };
  $scope.isPreviousVisible = function (images_number) {
    if (visibility_start > 0)
      return true;
    return false;
  }
})
