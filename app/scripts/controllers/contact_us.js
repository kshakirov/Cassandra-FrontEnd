magento_module.controller("ContactUsController", function ($rootScope,
                                                           $scope,
                                                           $http){
  $rootScope.pageTitle=": Contact Us";
  $scope.sendMail = function () {
    console.log($scope.mailData);
    return $http.post('/frontend/customer/contact_us', $scope.mailData).then(function () {
      console.log("Successfully sent");
    })
  }
})
