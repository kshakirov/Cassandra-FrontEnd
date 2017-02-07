magento_module.filter('std_ovrsize', function () {
  return function (input) {
    if (input && input == "STD") {
      return "<b> <font >STD</font></b>"
    } else if (input && input.search("-") >= 0) {
      return "<b> <font >" + input + "</font></b>"
    }
    else {
      return "<b> <font >" + input + "</font></b>"
    }
    b
  };
});
