angular.module('starter.controllers', [])
    .controller('AppCtrl', AppCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('PacienteCtrl', PacienteCtrl)
    .controller('GlicemiaCtrl', GlicemiaCtrl)
    .controller('InsulinaRapidaCtrl', InsulinaRapidaCtrl)
    .controller('InsulinaBasalCtrl', InsulinaBasalCtrl)
    .controller('GraficoCtrl', GraficoCtrl)
    .controller('A1CCtrl', A1CCtrl)
    .controller('ObservacaoCtrl', ObservacaoCtrl)
    .controller('EditarCtrl', EditarCtrl);

function AppCtrl($scope) {

}

function HomeCtrl($scope, DAO) {
    $scope.glicemia = [];
    DAO.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Medicao Where",[], function (tx, results) {
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

    $scope.load = function () {
        DAO.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM paciente"
            ,[],
                function (tx, res) {
                    if (res.rows.length > 0) {
                            $scope.data = res.rows.item(0).clone();
                    }
                    _DAO.data = $scope.data;

                    $scope.$apply();
                },
                function (tx, err) {
                    console.error(err);
                }
            );
        });
    }

    $scope.gravar = function () {

        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("UPDATE paciente set Nome=?,Dt_Nasc=?,Tp_dm=?, Peso=?, Altura=?, Dt_Inicio_dm=?, Insulina_Rapida=?, Insulina_basal=?, Fator_Correcao=?, Glicemia_Ideal=?, Insulina_Cho=?",[
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
                //$scope.load();

                $scope.$apply(function () {
                    //$scope.clear();
                })
            }, function (tx,err) {
                console.log(err);
            });
        });
    }

    $scope.load();
}

function GlicemiaCtrl($scope, DAO) {
    $scope.motivos = [
        {id: 1, Nome: "Mal estar"},
        {id: 2, Nome: "Motivo 2"},
        {id: 3, Nome: "Motivo 2"}
    ]

    $scope.glicemia = {};

    $scope.clear = function () {
        $scope.glicemia.valor = null;
        $scope.glicemia.observacao = null;
    };

    var d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    //return h + ':' + m;
    var fullData = new Date().getData() + " - " + h + ":" + m;

    $scope.salvar = function () {
        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("INSERT INTO medicao(Data,Valor,Observacao,Id_MotivoMedicao,Id_Paciente) Values (?,?,?,?,?)",[
                fullData,
                $scope.glicemia.valor,
                $scope.glicemia.observacao,
                $scope.glicemia.motivo.id,
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

    var fullData = new Date().getData();

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
                var len = results.rows.length, soma = 0;
                for (var i = 0; i < len; i++){
                    soma += results.rows.item(i).Quantidade;
                }
                media = soma / len;
                $scope.$apply(function () {
                    for (i = 0; i < tabelaA1C.length; i++) {
                        if (media <= tabelaA1C[i].media)
                        {
                            $scope.a1c.valor =  tabelaA1C[i].valor;
                            tabelaA1C[i].media;
                            break;
                        }
                    }
                    $scope.a1c.media = media;
                    $scope.show = true;
                });
            });
        });
    }
}

var tabelaA1C = [
    { valor: 4 ,media: 70 },
    { valor: 5 ,media: 98 },
    { valor: 6 ,media: 126 },
    { valor: 6.5 ,media: 140 },
    { valor: 7 ,media: 154 },
    { valor: 8 ,media: 182 },
    { valor: 9 ,media: 211 },
    { valor: 10 ,media: 239 },
    { valor: 11 ,media: 267 },
    { valor: 12 ,media: 295 }
]

function EditarCtrl($scope, DAO) {
    $scope.editar = [];

    $scope.selectALL = function () { $scope.editar.forEach(function (ele) {ele.$selected = true;});}

    $scope.deselectALL = function () {$scope.editar.forEach(function (ele) {ele.$selected = false;});}

    $scope.inverseALL = function () {
        $scope.editar.forEach(function (ele) {
            ele.$selected = !ele.$selected;
        });
    }

    DAO.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Medicao",[], function (tx, results) {
            var len = results.rows.length;
            for (var i = 0; i < len; i++){
                $scope.editar.push(
                    {
                        $selected: false,
                        data: results.rows.item(i).Data,
                        valor: results.rows.item(i).Valor,
                        observacao : results.rows.item(i).Observacao
                    }
                );
            }

            $scope.$apply(function () {
                //$scope.editar =
                $scope.show = true;
            });

        });
    })

}

function ObservacaoCtrl($scope, DAO) {
    $scope.observacao = {};
 var hoje = new Date();
$scope.observacao.Data = hoje.getData();
}