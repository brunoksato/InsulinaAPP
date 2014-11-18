/**
 * Created by Bruno on 14/11/2014.
 */
angular.module('DAO', [])
    .service('DAO', DAO)
    .factory('DAOFactory', DAOFactory);

function DAO() {

    this.db;

    this.connect = function () {
        var shortName = 'insulinaDb';
        var version = '1.0';
        var displayName = 'insulina';
        var maxSize = 5 * 1024 * 1024; // in bytes

        try{
            if (!window.openDatabase) {
                console.error('Error creating database.');
            } else {
                //var db = window.sqlitePlugin.openDatabase({name: shortName});
                this.db = openDatabase(shortName,version,displayName,maxSize);
                this.create();
                if(!this.db){
                    console.error('Erro ao criar banco!');
                }
            }
        } catch (e){
            if(e==2){
                console.error("Database version mismatch.");
            } else {
                console.error("EROR: "+e+".");
            }
        }
    }

    this.create = function () {
        this.db.transaction(function(tx){

            tx.executeSql(
                [
                    'CREATE TABLE [Motivo_Aplicacao] (',
                    '[Id] INTEGER NOT NULL Primary Key autoincrement,',
                    '[Descricao] VARCHAR(200));'

            ].join('')
            );

            tx.executeSql(
                [
                    'CREATE TABLE [Paciente] (',
                    '[Id] Integer NOT NULL Primary Key autoincrement,',
                    '[Nome] VARCHAR(50) NOT NULL,',
                    '[Dt_Nasc] DATE,',
                    '[Tp_dm] NUMBER,',
                    '[Peso] NUMBER(5, 2),',
                    '[Altura] NUMBER(3, 2),',
                    '[Dt_Inicio_dm] DATETIME,',
                    '[Insulina_Rapida] NUMBER,',
                    '[Insulina_basal] NUMBER,',
                    '[Fator_Correcao] NUMBER,',
                    '[Glicemia_Ideal] NUMBER,',
                    '[Insulina_Cho] NUMBER);'
                ].join('')
            );

            tx.executeSql(
                [
                    'CREATE TABLE [Tipo_Insulina] (',
                    '[Id] Integer NOT NULL Primary Key autoincrement,',
                    '[Descricao] VARCHAR(200));'
                ].join('')
            );

            tx.executeSql(
                [
                    'CREATE TABLE [Aplicacao] (',
                    '[Id] integer NOT NULL Primary Key autoincrement,',
                    '[Data] DATETIME,',
                    '[Quantidade] NUMBER,',
                    '[Id_TipoInsulina] integer CONSTRAINT [Fk_Tipo] REFERENCES [Tipo_Insulina]([Id]),',
                    '[Id_MotivoAplicacao] integer CONSTRAINT [FK_Motivo] REFERENCES [Motivo_Aplicacao]([Id]),',
                    '[Qtd_Cho] NUMBER,',
                    '[Id_Paciente] integer CONSTRAINT [Fk_Paciente] REFERENCES [Paciente]([Id]));'
                ].join('')
            );

            tx.executeSql(
                [
                    'CREATE TABLE "Motivo_Medicao" (',
                    '[Id] integer NOT NULL Primary Key autoincrement,',
                    '[Descricao] VARCHAR);'
                ].join('')
            );

            tx.executeSql(
                [
                    'CREATE TABLE [Medicao] (',
                    '[Id] integer NOT NULL Primary Key autoincrement,',
                    '[Data] DATETIME,',
                    '[Valor] NUMBER,',
                    '[Observacao] VARCHAR(200),',
                    '[Id_MotivoMedicao] integer NOT NULL CONSTRAINT [Fk_motivo] REFERENCES [Motivo_Medicao]([Id]),',
                    '[Id_Paciente] integer CONSTRAINT [Fk_Paciente] REFERENCES [Paciente]([Id]));'
            ].join('')
            )
        });
    };

    this.drop = function () {
        this.db.transaction(function(tx){
            tx.executeSql('DROP TABLE [Usuario_Acao]');
            tx.executeSql('DROP TABLE [Fixo]');
            tx.executeSql('DROP TABLE [Volante]');
            tx.executeSql('DROP TABLE [Usuario]');
            tx.executeSql('DROP TABLE [Acao]');
        });
    };

    this.save = function () {
        this.db.transaction(function (tx) {
            tx.executeSql()
        })
    };

    this.insert = function () {

    };

    this.update = function () {

    };

    this.delete = function (db) {

    };

    this.sync = function (db) {

    };


};
DAO.$inject = [];

function DAOFactory($http) {
    return{
        geoCode: function (lat, long) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true_or_false')
        },
        getEstabelecimento: function (db) {
            var estabelecimento = [];
            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM estabelecimento",[], function (tx, results) {
                    var len = results.rows.length;
                    for (var i = 0; i < len; i++){
                        estabelecimento.push(results.rows.item(i).Nome);
                    }
                    return estabelecimento;
                });
            });

        }
    }
}
DAOFactory.$inject = ['$http'];