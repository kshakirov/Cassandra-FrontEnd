var VIEW_DIR = 'views/';

// configure our routes
magento_module.config(function ($routeProvider) {
  $routeProvider
  // route for the start page
    .when('/parttype/:id/parts/critical/:unit?', {
      templateUrl: VIEW_DIR + 'critical.html',
      data: {
        pageTitle: "TURBO: CRITICAL"
      },
      controller: 'CriticalController'
    })
    .when('/parttype/:id/parts/standard/', {
      templateUrl: VIEW_DIR + 'standard.html',
      data: {
        pageTitle: "TURBO: BY TYPES"
      },
      controller: 'ByPartsProductTable'
    })
    .when('/manufacturer/:manufacturer_id/parttype/:id/parts', {
      templateUrl: VIEW_DIR + 'standard.html',
      data: {
        pageTitle: "TURBO: BY MANUFACTURERS"
      },
      controller: 'ByPartsProductTable'
    })
    .when('/parts/search/:query', {
      templateUrl: VIEW_DIR + 'standard.html',
      data: {
        pageTitle: "TURBO: SEARCH"
      },
      controller: 'ByPartsProductTable'
    })
    .when('/parts', {
      templateUrl: VIEW_DIR + 'standard.html',
      data: {
        pageTitle: "TURBO: CATALOG"
      },
      controller: 'ByPartsProductTable'
    })
    .when('/part/id/:id', {
      templateUrl: VIEW_DIR + 'product/product.html',
      data: {
        pageTitle: "TURBO: PRODUCT"
      },
      controller: 'ProductController'
    })
    .when('/part/sku/:sku', {
      templateUrl: VIEW_DIR + 'product/product.html',
      data: {
        pageTitle: "TURBO: PRODUCT"
      },
      controller: 'ProductController'
    })
    .when('/parts/application/:application_id', {
      templateUrl: VIEW_DIR + 'standard.html',
      data: {
        pageTitle: "TURBO: APPLICATION PARTS"
      },
      controller: 'ByPartsProductTable'
    })
    .when('/clearance/:clearance_id', {
      templateUrl: VIEW_DIR + 'clearance.html',
      data: {
        pageTitle: "TURBO: CLEARANCE"
      },
      controller: 'ByPartsProductTable'
    })
    .when('/application/', {
      templateUrl: VIEW_DIR + 'application.html',
      data: {
        pageTitle: "TURBO: APPLICATION"
      },
      controller: 'ApplicationController'
    })
    .when('/contact-us/', {
      templateUrl: VIEW_DIR + 'contact_us.html',
      data: {
        pageTitle: "TURBO: CONTACT US"
      },
      controller: 'ApplicationController'
    })
    .when('/about-us/', {
      templateUrl: VIEW_DIR + 'about_us.html',
      data: {
        pageTitle: "TURBO: ABOUT US"
      },
      controller: 'ApplicationController'
    })
    .when('/faq/', {
      templateUrl: VIEW_DIR + 'faq.html',
      data: {
        pageTitle: "TURBO: FAQ"
      },
      controller: 'ApplicationController'
    })
    .when('/customer/account/', {
      templateUrl: VIEW_DIR + 'customer/dashboard.html',
      data: {
        pageTitle: "TURBO: ACCOUNT"
      },
      controller: 'CustomerAccountController'
    })
    .when('/customer/account/information/', {
      templateUrl: VIEW_DIR + 'customer/account_information.html',
      data: {
        pageTitle: "TURBO: ACCOUNT INFO"
      },
      controller: 'CustomerAccountInformationController'
    })
    .when('/customer/account/addressBook/', {
      templateUrl: VIEW_DIR + 'customer/address_book.html',
      data: {
        pageTitle: "TURBO: ADDRESS BOOK"
      },
      controller: 'CustomerAddressBookController'
    })
    .when('/customer/account/address/edit/:id', {
      templateUrl: VIEW_DIR + 'customer/address_edit.html',
      data: {
        pageTitle: "TURBO: ADDRESS EDIT"
      },
      controller: 'CustomerAddressEditController'
    })
    .when('/customer/account/address/new/', {
      templateUrl: VIEW_DIR + 'customer/address_edit.html',
      data: {
        pageTitle: "TURBO: ADDRESS NEW"
      },
      controller: 'CustomerAddressEditController'
    })
    .when('/customer/account/orders/', {
      templateUrl: VIEW_DIR + 'customer/orders.html',
      data: {
        pageTitle: "TURBO: ORDER LIST"
      },
      controller: 'CustomerOrdersController'
    })
    .when('/customer/order/:id/view', {
      templateUrl: VIEW_DIR + 'customer/order_view.html',
      data: {
        pageTitle: "TURBO: ORDER VIEW"
      },
      controller: 'CustomerOrderViewController'
    })
    .when('/customer/account/wishlist/', {
      templateUrl: VIEW_DIR + 'customer/wishlist.html',
      controller: 'CustomerWishlistController'
    })
    .when('/customer/account/login/', {
      templateUrl: VIEW_DIR + 'customer/login.html',
      data: {
        pageTitle: "TURBO: LOGIN"
      },
      controller: 'CustomerLogin'
    })
    .when('/customer/cart/', {
      templateUrl: VIEW_DIR + 'customer/cart.html',
      data: {
        pageTitle: "TURBO: CART"
      },
      controller: 'CustomerCart'
    })
    .when('/customer/checkout/', {
      templateUrl: VIEW_DIR + 'customer/checkout.html',
      data: {
        pageTitle: "TURBO: CHECKOUT"
      },
      controller: 'CustomerCheckoutController'
    })
    .when('/customer/account/forgotpassword/', {
      templateUrl: VIEW_DIR + 'customer/forgot_password.html',
      data: {
        pageTitle: "TURBO: FORGOTTEN PASS"
      },
      controller: 'ForgotPasswordController'
    })
    .when('/', {
      templateUrl: VIEW_DIR + 'home.html',
      data: {
        pageTitle: "TURBO: HOME"
      },
      controller: 'HomeController'
    })
    .otherwise({redirectTo: '/'});
});
