angular.module('starter.controllers', ['ionic','service'])
    .controller('AppCtrl', AppCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('PacienteCtrl', PacienteCtrl)
    .controller('GlicemiaCtrl', GlicemiaCtrl)
    .controller('InsulinaRapidaCtrl', InsulinaRapidaCtrl)
    .controller('InsulinaBasalCtrl', InsulinaBasalCtrl)
    .controller('GraficoCtrl', GraficoCtrl)
    .controller('A1CCtrl', A1CCtrl)
    .controller('ObservacaoCtrl', ObservacaoCtrl)
    .controller('MotivoCtrl', MotivoCtrl)
    .controller('RelatorioCtrl', RelatorioCtrl)
    .controller('EditarCtrl', EditarCtrl);

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
    $scope.glicemia = {motivo:{}};

    $scope.clear = function () {
        $scope.glicemia.valor = null;
        $scope.glicemia.motivo.Id = null;
    };

    $scope.salvar = function () {
        var agora = new Date();
        DAO.insert(
            {
                Table: 'medicao',
                Fields: ['Data','Valor','Id_MotivoMedicao', 'Id_Pacietne'],
                Values: [
                    agora.toISOString(),
                    $scope.glicemia.valor,
                    $scope.glicemia.motivo.id,
                    1
                ]
            },
            function (res) {
                if (res.rowsAffected == 1 ){
                    console.info('salvo');
                } else {
                    //alert FALHA
                }
            }
        );
        //DAO.db.transaction(function (tx) {
        //    var agora = new Date();
        //    tx.executeSql("INSERT INTO medicao(Data,Valor,Id_MotivoMedicao,Id_Paciente) Values (?,?,?,?)",[
        //        agora.toISOString(),
        //        $scope.glicemia.valor,
        //        $scope.glicemia.motivo.id,
        //        1
        //    ], function (tx, results) {
        //        console.log('salvo com sucesso!');
        //
        //        $scope.$apply(function () {
        //            $scope.clear();
        //        })
        //    }, function (tx,err) {
        //        console.log(err);
        //    });
        //});
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

function GraficoCtrl($scope, DAO) {
    $scope.getData = function () {
        DAO.db.transaction(
            function (tx) {
                tx.executeSql(
                    'SELECT [valor] FROM [medicao] m' +
                    'JOIN [motivo_medicao] mm ON m.id_Motivomedicao = mm.Id' +
                    ' WHERE [descricao] = "JEJUM"'
                    ,[]
                );
            }
        );
    }
}

function A1CCtrl($scope, DAO, service) {

    var tabelaA1C = service.tabelaA1C;

    $scope.show = false;
    $scope.a1c = {dataInicial:'2014-11-01', dataFinal: '2014-11-30', erro: false };

    $scope.calcular = function () {
        var data = new Date();
        var inicio = data.getInputData($scope.a1c.dataInicial);
        var final = data.getInputData($scope.a1c.dataFinal);
        DAO.db.transaction(function (tx) {
            console.warn("SELECT * FROM Aplicacao WHERE strftime('%d/%m/%Y',data) >= " + inicio + " and " + final + " >= strftime('%d/%m/%Y',data) ");
            tx.executeSql("SELECT * FROM Aplicacao WHERE strftime('%d/%m/%Y',data) >= ? and ? >= strftime('%d/%m/%Y',data) ",
                [
                    inicio
                    ,final
                ],
                function (tx, results) {
                    var len = results.rows.length, soma = 0;
                    for (var i = 0; i < len; i++){
                        soma += results.rows.item(i).Quantidade;

                    }
                    media = soma / len;
                    $scope.$apply(function () {
                        if (len > 0) {
                            for (i = 0; i < tabelaA1C.length; i++) {
                                if (media <= tabelaA1C[i].media)
                                {
                                    $scope.a1c.valor =  tabelaA1C[i].valor;
                                    tabelaA1C[i].media;
                                    break;
                                }
                            }
                            $scope.a1c.media = media;
                        } else {
                            $scope.a1c.erro = 'Nenhum registro!';
                        }

                        $scope.show = true;
                    });
                }, function (tx,err) {console.warn(err);}

            );
        });
    }
}

function MotivoCtrl($scope, DAO, $ionicTabsDelegate, service) {
    $scope.motivos = {Aplicacao:[],Medicao: [], Insulina: []};
    this.arr = [];
    $scope.get = function () {
        switch ($ionicTabsDelegate.selectedIndex()) {
            case 0: //MEDICAO
                this.arr = $scope.motivos.Medicao;

                break;
            case 1: //APLICACAO
                this.arr = $scope.motivos.Aplicacao;

                break;
            case 2: //TIPO INSULINA
                this.arr = $scope.motivos.Insulina;

                break;
        }
        return this.arr;
    }

    DAO.db.transaction(function (tx) {
        tx.executeSql(
            'SELECT * FROM [motivo_aplicacao]'
            ,[],
            function (tx, res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        $scope.motivos.Aplicacao.push(res.rows.item(i).clone());
                    }

                } else {
                    //alert
                }
            },
            function (tx, err) {
                console.warn(err);
            }
        );

        tx.executeSql(
            'SELECT * FROM [motivo_medicao]'
            ,[],
            function (tx, res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        $scope.motivos.Medicao.push(res.rows.item(i).clone());
                    }
                } else {
                    //alert
                }
            },
            function (tx, err) {
                console.warn(err);
            }
        );
    });

    $scope.select = function (item) {
        item.$edit = !item.$edit;
    }

    $scope.editar = function (item) {
        $scope.get();
        $scope.edit = !$scope.edit;
        service.alert('TESTE');
        if ($scope.edit) {

        } else {

        }
    }
    var canDel = false;
    $scope.apagar = function (item) {
        if (canDel) {
            console.log('delete');
            canDel = false;
        } else {

                var hasChanges = false;
            var count = 0;
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i].$edit){
                    hasChanges = true;
                    count++;
                }
            }
            if (hasChanges)
                $scope.info = 'Pressione apagar novamente! Selecionado ' + count;
            else
                $scope.info = 'Nenhum registro selecionado!';
        }
    }

    $scope.salvar = function () {


    }
}

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
                    $scope.show = true;
                });

            },
            function (tx,err) {
                console.warn(tx,err);
            }
        );
    });

    $scope.select = function (item) {

        item.$edit = !item.$edit;
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

    $scope.load = function () {
        DAO.db.transaction(function (tx) {
            tx.executeSql(
                'SELECT * FROM [TEMPO] WHERE strftime("%d/%m/%Y",[data]) = strftime("%d/%m/%Y","now")'
                ,[],
                function (tx, res) {
                    if (res.rows.length > 0) {
                        res.rows.item(0).clone();
                        $scope.$apply();
                    } else {
                        //alert
                    }
                }
            );
        });
    }

    $scope.insert = function(item) {
        DAO.exist({Table:'Medicao',Id: 1},
            function (exist) {
                console.log(exist);
            });
    }



}

function RelatorioCtrl($scope, DAO) {

}