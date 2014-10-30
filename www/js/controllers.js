angular.module('starter.controllers', [])
    .controller('AppCtrl', AppCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('PacienteCtrl', PacienteCtrl)
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

function PacienteCtrl($scope, $cordovaSQLite, $cordovaToast) {

    var db = $cordovaSQLite.openDB({name: "insulina.db"});

    $scope.clear = function () {
        $scope.data.nome = null;
        $scope.data.dataNascimento = null;
        $scope.data.tpdm = null;
        $scope.data.peso = null;
        $scope.data.altura = null;
        $scope.data.dataInicio = null;
        $scope.data.insulinaRapida = null;
        $scope.data.insulinaBasal = null;
        $scope.data.fatorCorrecao = null;
        $scope.data.glicemiaIdeal = null;
        $scope.data.insulinaCho = null;
    };

    $scope.data = {};

    $scope.gravar = function () {
        console.log(3,$scope.data.nome);
        var query  = "insert into Paciente (Id,Nome)values (4 " + $scope.data.nome + ")";
//        var query = "INSERT INTO Paciente (Id, Nome, Dt_Nasc, Tp_dm, Peso, Altura, Dt_Inicio_dm, Insulina_Rapida, Insulina_basal, Fator_Correcao, Glicemia_Ideal, Insulina_Cho) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db, query).then(function(res) {
            console.log('success!',res);
            $cordovaToast.show('Inserido com sucesso!', 'short', 'center').then(function(success) {
                console.log('Sucesso ' + res.insertId);
            }, function (error) {
                console.log('Erro!');
            });
        }, function (err) {
            console.error(err);
        });
    }
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