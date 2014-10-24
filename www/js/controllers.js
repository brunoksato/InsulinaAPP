angular.module('starter.controllers', [])
    .controller('AppCtrl', AppCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('GlicemiaCtrl', GlicemiaCtrl)
    .controller('InsulinaRapidaCtrl', InsulinaRapidaCtrl)
    .controller('InsulinaBasalCtrl', InsulinaBasalCtrl)
    .controller('GraficoCtrl', GraficoCtrl)
    .controller('A1CCtrl', A1CCtrl);

function AppCtrl($scope) {

}

function HomeCtrl($scope) {
    $scope.glicemia = [
        {
            nome: 150,
            data: '20/10/2014',
            hora: '08:00'
        },
        {
            nome: 100,
            data: '20/10/2014',
            hora: '12:00'
        },
        {
            nome: 150,
            data: '20/10/2014',
            hora: '20:00'
        }
    ];
}

function GlicemiaCtrl($scope) {

}

function InsulinaRapidaCtrl($scope) {

}

function InsulinaBasalCtrl($scope) {

}

function GraficoCtrl($scope) {

}

function A1CCtrl($scope) {

}