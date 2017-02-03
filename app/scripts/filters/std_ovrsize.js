magento_module.filter('std_ovrsize', function () {
  return function (input) {
    if (input && input == "STD") {
      return "<b> <font color='blue'>STD</font></b>"
    } else if (input && input.search("-") >= 0) {
      return "<b> <font color='red'>" + input + "</font></b>"
    }
    else {
      return "<b> <font color='green'>" + input + "</font></b>"
    }
    b
  };
});
