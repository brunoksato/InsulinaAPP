
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })


    .state('app.home', {
        url: "/home",
        views: {
            'menuContent' :{
                templateUrl: "templates/home.html",
                controller: "HomeCtrl"
            }
        }
    })

    .state('app.glicemia', {
      url: "/glicemia",
      views: {
        'menuContent' :{
          templateUrl: "templates/glicemia.html",
          controller: "GlicemiaCtrl"
        }
      }
    })

    .state('app.insulinaRapida', {
      url: "/insulinaRapida",
      views: {
        'menuContent' :{
          templateUrl: "templates/insulinaRapida.html",
          controller: "InsulinaRapidaCtrl"
        }
      }
    })
    .state('app.insulinaBasal', {
      url: "/insulinaBasal",
      views: {
        'menuContent' :{
          templateUrl: "templates/insulinaBasal.html",
          controller: 'InsulinaBasalCtrl'
        }
      }
    })

    .state('app.grafico', {
      url: "/grafico",
      views: {
        'menuContent' :{
          templateUrl: "templates/grafico.html",
          controller: 'GraficoCtrl'
        }
      }
    })

    .state('app.a1c', {
        url: "/a1c",
        views: {
            'menuContent' :{
                templateUrl: "templates/a1c.html",
                controller: 'A1CCtrl'
            }
        }
    });


  $urlRouterProvider.otherwise('/app/playlists');

});

