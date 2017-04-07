/**
 * Created by kshakirov on 1/26/17.
 */
magento_module.directive('numbersOnly', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        if (text) {
          var transformedInput = text.replace(/[^0-9|.]/g, '');

          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          } else {
            transformedInput = parseFloat(transformedInput);
            if (transformedInput == 0) {
              transformedInput = 1
            }
          }
          return transformedInput;
        }else {
          return 1
        }
      }

      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});
