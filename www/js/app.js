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
        DAO.db.transaction(
            function (tx) {
                tx.executeSql('SELECT * FROM [motivo_medicao]',[],

                    function (tx,res) {
                        if (res.rows.length > 0) {
                            for (i = 0; i < res.rows.length; i++) {
                                motivos.push(res.rows.item(i).clone());
                            }
                        }
                    },

                    function (tx, err) {
                        console.warn(err);
                    }
                );
            }
        );
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

      .state('app.motivos', {
          url: "/motivos",
          views: {
              'menuContent' :{
                  templateUrl: "templates/motivos.html",
                  controller: 'MotivoCtrl'
              }
          }
      })

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

var motivos = [
    //{id: 1, nome: 'Jejum',hora:'08'},
    //{id: 2, nome: 'Café da manha',hora: '10'},
    //{id: 3, nome: 'Almoço',hora:'13'},
    //{id: 4, nome: 'Janta', hora: '20'}
];

Date.prototype.getData = function () {
    this.dia = this.getDate();
    this.dia = this.dia < 10 ? "0" + this.dia : this.dia.toString();
    this.mes = this.getMonth() + 1;
    this.mes = this.mes < 10 ? "0" + this.mes :this.mes.toString();
    return this.dia + "/" + this.mes + "/" + this.getFullYear();
}

Date.prototype.fromInput = function (valor) {
    if (valor == null || valor === 'undefined') {
        throw new SyntaxError('Data não definida');
    } else {
        this.temp = valor.toString().split('-');
        this.setDate(this.temp[2]);
        this.setMonth(parseInt(this.temp[1]) - 1);
        this.setFullYear(this.temp[0]);
    }
    return this;
}

Date.prototype.getInputData = function (valor) {
    this.fromInput(valor);
    return this.getData();
}

Object.prototype.clone = function() {
    if (this == null) return null;
    if (typeof(this) !== "object") return null;
    this.cloned = {};
    for (this.attr in this) {
        this.cloned[this.attr] = this[this.attr];
    }
    return this.cloned;
}

Array.prototype.search = function (item) {
    if (typeof(item) === 'object') {

        for (this.i = 0; this.i < this.length; this.i++) {

            this.check = true;

            for (this.at in item) {

                if (typeof(item[this.at]) !== 'function') {

                    if (item[this.at] !== (this[this.i])[this.at]) {
                        this.check = false;
                    }
                }
            }
            if (this.check) return this[this.i];
        }
    }
    return this;
}