var VIEW_DIR = 'views/';

// configure our routes
magento_module.config(function ($routeProvider) {
  $routeProvider
  // route for the start page
    .when('/parttype/:id/parts/critical/:unit?', {
      templateUrl: VIEW_DIR + 'critical.html',
      controller: 'CriticalController'
    })
    .when('/parttype/:id/parts/standard/', {
      templateUrl: VIEW_DIR + 'standard.html',
      controller: 'ByPartsProductTable'
    })
    .when('/manufacturer/:manufacturer_id/parttype/:id/parts', {
      templateUrl: VIEW_DIR + 'standard.html',
      controller: 'ByPartsProductTable'
    })
    .when('/parts/search/:query', {
      templateUrl: VIEW_DIR + 'standard.html',
      controller: 'ByPartsProductTable'
    })
    .when('/parts', {
      templateUrl: VIEW_DIR + 'standard.html',
      controller: 'ByPartsProductTable'
    })
    .when('/part/id/:id', {
      templateUrl: VIEW_DIR + '/product/product.html',
      controller: 'ProductController'
    })
    .when('/part/sku/:sku', {
      templateUrl: VIEW_DIR + '/product/product.html',
      controller: 'ProductController'
    })
    .when('/parts/application/:application_id', {
      templateUrl: VIEW_DIR + 'standard.html',
      controller: 'ByPartsProductTable'
    })
    .when('/clearance/:clearance_id', {
      templateUrl: VIEW_DIR + 'clearance.html',
      controller: 'ByPartsProductTable'
    })
    .when('/application/', {
      templateUrl: VIEW_DIR + 'application.html',
      controller: 'ApplicationController'
    })
    .when('/contact-us/', {
      templateUrl: VIEW_DIR + 'contact_us.html',
      controller: 'ApplicationController'
    })
    .when('/about-us/', {
      templateUrl: VIEW_DIR + 'about_us.html',
      controller: 'ApplicationController'
    })
    .when('/customer/account/', {
      templateUrl: VIEW_DIR + 'customer/dashboard.html',
      controller: 'CustomerAccountController'
    })
    .when('/customer/account/information/', {
      templateUrl: VIEW_DIR + 'customer/account_information.html',
      controller: 'CustomerAccountInformationController'
    })
    .when('/customer/account/addressBook/', {
      templateUrl: VIEW_DIR + 'customer/address_book.html',
      controller: 'CustomerAddressBookController'
    })
    .when('/customer/account/orders/', {
      templateUrl: VIEW_DIR + 'customer/orders.html',
      controller: 'CustomerOrdersController'
    })
    .when('/customer/account/wishlist/', {
      templateUrl: VIEW_DIR + 'customer/wishlist.html',
      controller: 'CustomerWishlistController'
    })
    .when('/customer/account/login/', {
      templateUrl: VIEW_DIR + 'customer/login.html',
      controller: 'CustomerLogin'
    })
    .when('/customer/cart/', {
      templateUrl: VIEW_DIR + 'customer/cart.html',
      controller: 'CustomerCartController'
    })
    .when('/customer/checkout/', {
      templateUrl: VIEW_DIR + 'customer/checkout.html',
      controller: 'CustomerCheckoutController'
    })
    .when('/', {
      templateUrl: VIEW_DIR + 'home.html',
      controller: 'HomeController'
    })
    .otherwise({redirectTo: '/'});
});
