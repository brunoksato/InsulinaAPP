angular.module('starter', ['ionic', 'ngCordova','DAO', 'starter.controllers'])

.run(function($ionicPlatform,DAO) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


  });

      DAO.connect();
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


      .state('app.paciente', {
        url: "/paciente",
        views: {
          'menuContent' :{
            templateUrl: "templates/paciente.html",
            controller: "PacienteCtrl"
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
//Acrescentado
      .state('app.editar', {
        url: "/editar",
        views: {
          'menuContent' :{
            templateUrl: "templates/editar.html",
            controller: 'EditarCtrl'
          }
        }
      })

      .state('app.observacao', {
          url: "/observacao",
          views: {
              'menuContent' :{
                  templateUrl: "templates/observacao.html",
                  controller: 'ObservacaoCtrl'
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


  $urlRouterProvider.otherwise('/app/home');

});

Date.prototype.getData = function () {
    var dia = this.getDate();
    dia = dia < 10 ? "0" + dia : dia.toString();
    var mes = this.getMonth() + 1;
    mes = mes < 10 ? "0" + mes : mes.toString();
    return dia + "/" + mes + "/" + this.getFullYear();
}

Date.prototype.fromInput = function (valor) {
    if (valor == null || valor === 'undefined') {
        console.warn('Data não definida.');
        return this;
    } else {
        temp = valor.toString().split('-');
        this.setDate(temp[2]);
        this.setMonth(parseInt(temp[1]) - 1);
        this.setFullYear(temp[0]);
    }
    return this;
}

Date.prototype.getData = function (valor) {
    this.fromInput(valor);
    return this.getData();
}

Object.prototype.clone = function() {
    if (this == null) return null;
    if (typeof(this) !== "object") return null;
    var cloned = {};
    for (attr in this) {
        cloned[attr] = this[attr];
    }
    return cloned;
}