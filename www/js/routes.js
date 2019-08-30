routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/search/',
    url: './pages/search.html',
  },
  {
    path: '/terms/',
    url: './pages/terms.html',
  },
    {
    path: '/privacy/',
    url: './pages/privacy.html',
  },
      {
    path: '/return/',
    url: './pages/return.html',
  },
  {
    path: '/contact/',
    url: './pages/contact.html',
  },
  {
    path: '/happybong/',
    url: './pages/happybong.html',
  },
  
  {
    path: '/profile/',
    url: './pages/profile.html',
  },
  {
    path: '/product-details/',
    url: './pages/product-details.html',
  },
  {
    path: '/product-listing/',
    url: './pages/product-listing.html',
  },
  {
    path: '/cart1/',
    url: './pages/cart1.html',
  },
  {
    path: '/registration/',
    url: './pages/registration.html',
  },
   {
    path: '/payment/',
    url: './pages/payment.html',
  },
  {
    path: '/success/',
    url: './pages/success.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  // Left View Pages
  {
    path: '/left-page-1/',
    url: './pages/left-page-1.html',
  },
  {
    path: '/left-page-2/',
    url: './pages/left-page-2.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
