'use strict';

/**
 * @ngdoc overview
 * @name angularFrontendApp
 * @description
 * # angularFrontendApp
 *
 * Main module of the application.
 */
// angular
//   .module('angularFrontendApp', [
//     'ngAnimate',
//     'ngCookies',
//     'ngResource',
//     'ngRoute',
//     'ngSanitize',
//     'ngTouch'
//   ])
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'views/home.html',
//         controller: 'MainCtrl',
//         controllerAs: 'main'
//       })
//       .when('/about', {
//         templateUrl: 'views/about.html',
//         controller: 'AboutCtrl',
//         controllerAs: 'about'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   });

var magento_module = angular.module('MagentoApp', [ 'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch', 'angularSpinner','ngFader']);

magento_module.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController',
      controllerAs: 'main'
    })
    .otherwise({
      redirectTo: '/'
    });
});
