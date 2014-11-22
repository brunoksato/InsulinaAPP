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
var teste = [];
function AppCtrl($scope) {

}

function HomeCtrl($scope, DAO) {
    $scope.glicemia = [];
    DAO.db.transaction(function (tx) {
        tx.executeSql(
            "SELECT Data, Valor, Descricao FROM [medicao] m JOIN [motivo_medicao] mm ON m.id_motivomedicao = mm.Id  " +
            "WHERE strftime('%d/%m/%Y','now') = strftime('%d/%m/%Y',m.  data)",
            [],
            function (tx, results) {
            var len = results.rows.length;
            for (var i = 0; i < len; i++){
                teste.push(results.rows.item(i).clone());
                $scope.glicemia.push(
                    {
                        Data: results.rows.item(i).Data,
                        Valor: results.rows.item(i).Valor,
                        Descricao : results.rows.item(i).Descricao
                    }
                );
            }
                $scope.$apply();
        },
            function (tx, err) {
                console.warn(err);
            }
        );
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
    $scope.motivos = motivos;
    $scope.default = {};
    $scope.glicemia = {motivo:{}};
    //Tentando definir valor de motivo padrão por hora.
    for (i = 0; i < $scope.motivos.length; i++) {
        var agora = new Date();
        var padrao = new Date();
        padrao.setHours($scope.motivos[i].hora);
        padrao.setMinutes('0');
        if (agora < padrao) {
            $scope.default = $scope.motivos[i];
        }
    }



    $scope.clear = function () {
        $scope.glicemia.valor = null;
        $scope.glicemia.observacao = null;
    };

    $scope.salvar = function () {
        DAO.db.transaction(function (tx) {
            var agora = new Date();
            tx.executeSql("INSERT INTO medicao(Data,Valor,Observacao,Id_MotivoMedicao,Id_Paciente) Values (?,?,?,?,?)",[
                agora.toISOString(),
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

    var fullData = new Date();

    $scope.salvar = function () {
        DAO.db.transaction(function (tx) {
            console.log($scope.data);
            tx.executeSql("INSERT INTO Aplicacao(Data,Quantidade,Id_TipoInsulina,Id_MotivoAplicacao,Qtd_Cho,Id_Paciente) Values (?,?,?,?,?,?)",[
                fullData.toISOString(),
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
            }, function (tx,err) {
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
    $scope.a1c = {dataInicial:{}, dataFinal: {} };

    $scope.calcular = function () {
        var inicio = new Date();
        var final = new Date();
        inicio.fromInput().toDateString();
        DAO.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Aplicacao WHERE strftime('%d/%m/%Y',data) >= ? and ? <= strftime('%d/%m/%Y',data) ",
                [
                    inicio.getData($scope.a1c.dataInicial)
                    ,final.getData($scope.a1c.dataFinal)
                ],
                function (tx, results) {
                    console.info(results.rows.length);
                var len = results.rows.length, soma = 0;
                for (var i = 0; i < len; i++){
                    console.log(results.rows.item(i));
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
            }, function (tx,err) {console.warn(err);}

            );
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
    $scope.motivos = motivos;
    $scope.hoje = new Date();
    DAO.db.transaction(function (tx) {
        tx.executeSql("SELECT m.Id, Data, Valor, mm.Id as MID, mm.Descricao FROM [medicao] m " +
            "JOIN [motivo_medicao] mm ON mm.Id = m.id_motivomedicao " +
            "WHERE strftime('%d/%m%Y','now') = strftime('%d/%m%Y',Data)"
            ,[], function (tx, results) {
            var len = results.rows.length;
            for (var i = 0; i < len; i++){
                var obj = results.rows.item(i).clone();
                $scope.editar.push(
                    {
                        Id: obj.Id
                        ,Data: obj.Data
                        ,Valor:obj.Valor
                        ,motivo: motivos.search({Id: obj.MID})
                    }
                );
            }

            $scope.$apply(function () {
                //$scope.editar =
                $scope.show = true;
            });

        },
        function (tx,err) {
            console.warn(err);
        }
        );
    });

    $scope.select = function (item) {
        item.$edit = true;
        for (var i = 0 ; i < $scope.editar.length; i++) {
            if (item.Id !== $scope.editar[i].Id) {
                $scope.editar[i].$edit = false;
                if ($scope.editar[i].$change) {
                    $scope.salve($scope.editar[i]);
                }
            }
        }
    }

    $scope.salvar = function() {
        for (var i = 0 ; i < $scope.editar.length; i++) {
            if ($scope.editar[i].$change) {
                $scope.salve($scope.editar[i]);
                $scope.editar[i].$edit = false;
            }
        }
    }

    $scope.salve = function (item) {
        item.$change = false;
        DAO.db.transaction(
            function (tx) {
                tx.executeSql(
                    'UPDATE [medicao] SET Valor = ? , id_MotivoMedicao = ? WHERE Id = ? ',
                    [
                        item.Valor
                        ,item.motivo.Id
                        ,item.Id
                    ]
                    ,function (tx, res) {
                        console.info('Salvo');
                    }
                    ,function (tx, err) {
                        console.warn(err);
                    }
                );
            }
        );
    }
}

function ObservacaoCtrl($scope, DAO) {
    $scope.observacao = {};
 var hoje = new Date();
$scope.observacao.Data = hoje.getData();
}