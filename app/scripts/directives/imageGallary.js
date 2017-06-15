magento_module
  .directive('imageGallary', function ($interval) {

    function find_image_index(img_url) {
      return img_url == this;
    }

    function set_right_end(current_index, full) {
      if (current_index < full)
        return false;
      return true;
    }

    function set_left_end(current_index) {
      if (current_index > 0)
        return false;
      return true;
    }

    function set_ends(current_index, full) {
      this.left_end = set_left_end(current_index);
      this.right_end = set_right_end(current_index, full);
    }

    function link(scope, element, attrs) {
      var image_urls = attrs.images.split(',');
      scope.image_url = attrs.currentImageUrl;
      var full = image_urls.length - 1;
      var current_index = image_urls.findIndex(find_image_index, attrs.currentImageUrl)
      set_ends.apply(scope, [current_index, full]);


      scope.nextImage = function () {
        current_index += 1;
        scope.image_url = image_urls[current_index];
        set_ends.apply(scope, [current_index, full]);
      }

      scope.previousImage = function () {
        current_index -= 1;
        scope.image_url = image_urls[current_index];
        set_ends.apply(scope, [current_index, full]);
      }

    }

    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'views/product/image_gallary.html',
      link: link
    };
  });


