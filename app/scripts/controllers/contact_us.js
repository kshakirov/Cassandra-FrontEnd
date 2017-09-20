magento_module.controller("ContactUsController", function ($rootScope,
                                                           $scope,
                                                           $http) {
  $rootScope.pageTitle = ": Contact Us";
  $scope.action_result = {
    success: {
      flag: false,
      message: "Your Message successfully delivered."
    },
    error: {
      flag: false,
      message: "Problems with delivering your message, check email field"
    }
  };

  function isMailDataWrong(mail_data) {
    if (mail_data == null) {
      return "Fill Required Fields"
    }
    ;
    if (!mail_data.email || mail_data.email.search("@") < 0) {
      return "Email address is not valid"
    }
    ;
    if (!mail_data.name || mail_data.name.length == 0) {
      return "Name must be set"
    }
    ;
    return false;
  };


  $scope.sendMail = function () {
    var error = isMailDataWrong($scope.mailData);
    if (error) {
      $scope.action_result.success.flag = false;
      $scope.action_result.error.message = error;
      $scope.action_result.error.flag = true;
    } else {
      $scope.action_result.error.flag = false;
      return $http.post('/frontend/customer/contact_us', $scope.mailData).then(function () {
        $scope.mailData = {};
        $scope.action_result.success.flag = true;
      }, function (error) {
        console.log(error);
        $scope.action_result.error.flag = true;
      })
    }
  }
})
