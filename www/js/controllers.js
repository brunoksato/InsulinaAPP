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

function HomeCtrl($scope, DAO) {
    $scope.glicemia = [];
    DAO.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Medicao",[], function (tx, results) {
            var len = results.rows.length;
            for (var i = 0; i < len; i++){
                $scope.glicemia.push(
                    {
                        data: results.rows.item(i).Data,
                        valor: results.rows.item(i).Valor,
                        observacao : results.rows.item(i).Observacao
                    }
                );
            }
        });
    });
}

function PacienteCtrl($scope, DAO) {

    $scope.clear = function () {
        $scope.data.Nome = null;
        $scope.data.Dt_Nasc = null;
        $scope.data.Tp_dm = null;
        $scope.data.Peso = null;
        $scope.data.Altura = null;
        $scope.data.Dt_Inicio_dm = null;
        $scope.data.Insulina_Rapida = null;
        $scope.data.Insulina_basal = null;
        $scope.data.Fator_Correcao = null;
        $scope.data.Glicemia_Ideal = null;
        $scope.data.Insulina_Cho = null;
    };

    $scope.data = {};

    $scope.gravar = function () {

        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("INSERT INTO paciente(Nome,Dt_Nasc,Tp_dm,Peso,Altura,Dt_Inicio_dm,Insulina_Rapida,Insulina_basal,Fator_Correcao,Glicemia_Ideal,Insulina_Cho) Values (?,?,?,?,?,?,?,?,?,?,?)",[
                $scope.data.Nome,
                $scope.data.Dt_Nasc,
                $scope.data.Tp_dm,
                $scope.data.Peso,
                $scope.data.Altura,
                $scope.data.Dt_Inicio_dm,
                $scope.data.Insulina_Rapida,
                $scope.data.Insulina_basal,
                $scope.data.Fator_Correcao,
                $scope.data.Glicemia_Ideal,
                $scope.data.Insulina_Cho
            ], function (tx, results) {
                console.log('salvo com sucesso!');
                $scope.$apply(function () {
                    $scope.clear();
                })
            }, function (err) {
                console.log(err);
            });
        });
    }
}

function GlicemiaCtrl($scope, DAO) {
    $scope.glicemia = {};

    $scope.clear = function () {
        $scope.glicemia.valor = null;
        $scope.glicemia.observacao = null;
    };

    var d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    //return h + ':' + m;
    var dia = new Date().getDay(),
        mes = new Date().getMonth(),
        ano = new Date().getFullYear(),
        fullData = dia + "/" + mes + "/" + ano + " - " + h + ":" + m;

    $scope.salvar = function () {
        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("INSERT INTO medicao(Data,Valor,Observacao,Id_MotivoMedicao,Id_Paciente) Values (?,?,?,?,?)",[
                fullData,
                $scope.glicemia.valor,
                $scope.glicemia.observacao,
                1,
                1
            ], function (tx, results) {
                console.log('salvo com sucesso!');
                $scope.$apply(function () {
                    $scope.clear();
                })
            }, function (err) {
                console.log(err);
            });
        });
    };
}

function InsulinaRapidaCtrl($scope,DAO) {
    $scope.rapida = {};

    $scope.clear = function () {
        $scope.rapida.quantidade = null;
        $scope.rapida.quantidadeCho = null;
    };

    var dia = new Date().getDay(),
        mes = new Date().getMonth(),
        ano = new Date().getFullYear(),
        fullData = dia + "/" + mes + "/" + ano;

    $scope.salvar = function () {
        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("INSERT INTO Aplicacao(Data,Quantidade,Id_TipoInsulina,Id_MotivoAplicacao,Qtd_Cho,Id_Paciente) Values (?,?,?,?,?,?)",[
                fullData,
                $scope.rapida.quantidade,
                1,
                1,
                $scope.rapida.quantidadeCho,
                1
            ], function (tx, results) {
                console.log('salvo com sucesso!');
                $scope.$apply(function () {
                    $scope.clear();
                })
            }, function (err) {
                console.log(err);
            });
        });
    };
}

function InsulinaBasalCtrl($scope, DAO) {
    $scope.basal = {};

    $scope.clear = function () {
        $scope.basal.quantidade = null;
        $scope.basal.quantidadeCho = null;
    };

    var dia = new Date().getDay(),
        mes = new Date().getMonth(),
        ano = new Date().getFullYear(),
        fullData = dia + "/" + mes + "/" + ano;

    $scope.salvar = function () {
        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("INSERT INTO Aplicacao(Data,Quantidade,Id_TipoInsulina,Id_MotivoAplicacao,Qtd_Cho,Id_Paciente) Values (?,?,?,?,?,?)",[
                fullData,
                $scope.basal.quantidade,
                1,
                1,
                $scope.basal.quantidadeCho,
                1
            ], function (tx, results) {
                console.log('salvo com sucesso!');
                $scope.$apply(function () {
                    $scope.clear();
                })
            }, function (err) {
                console.log(err);
            });
        });
    };
}

function GraficoCtrl($scope) {

}

function A1CCtrl($scope, DAO) {
    $scope.show = false;
    $scope.a1c = {};
    $scope.calcular = function () {
        DAO.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Aplicacao",[], function (tx, results) {
                var len = results.rows.length, media = 0;
                for (var i = 0; i < len; i++){
                    media += results.rows.item(i).Quantidade;
                }
                $scope.$apply(function () {
                    $scope.a1c.media = (media / len);
                    $scope.show = true;
                });
            });
        });
    }
}