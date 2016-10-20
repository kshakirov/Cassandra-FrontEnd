magento_module.filter('oe_ref_coma', function () {
    return function (index, size) {
      if(index == size - 1){
          return "";
      }else{
          return ", "
      }

    };
});