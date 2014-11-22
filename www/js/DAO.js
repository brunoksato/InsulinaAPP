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
                this.drop();
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
                ,[],
                function ok() {console.info('motivo_aplicacao');},
                function err(a,err) {console.warn(err);}
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
                ,[],
                function ok() {console.info('aplicacao');},
                function err(a,err) {console.warn(err);}
            );

            tx.executeSql(
                [
                    'CREATE TABLE "Motivo_Medicao" (',
                    '[Id] integer NOT NULL Primary Key autoincrement,',
                    '[Descricao] VARCHAR);'
                ].join('')
                ,[],
                function ok() {console.info('motivo_medicao');},
                function err(a,err) {console.warn(err);}
            );

            tx.executeSql(
                [
                    'CREATE TABLE [Medicao] (',
                    '[Id] integer NOT NULL Primary Key autoincrement,',
                    '[Data] DATETIME,',
                    '[Valor] NUMBER,',
                    //'[Observacao] VARCHAR(200),',
                    '[Id_MotivoMedicao] integer NOT NULL CONSTRAINT [Fk_motivo] REFERENCES [Motivo_Medicao]([Id]),',
                    '[Id_Paciente] integer CONSTRAINT [Fk_Paciente] REFERENCES [Paciente]([Id]));'
                ].join('')
                ,[],
                function ok() {console.info('medicao');},
                function err(a,err) {console.warn(err);}
            );

            tx.executeSql(
                [
                    'INSERT INTO [Motivo_Medicao] (Descricao) ',
                    'SELECT (?) as Descricao UNION SELECT (?) UNION SELECT (?) UNION SELECT (?) UNION SELECT (?) UNION SELECT (?)'
                ].join('')
                ,['Jejum','Café da Manhã','Almoço'
                    ,'Café da tarde','Janta', 'Mal Estar'],
                function ok() {console.info('insert motivo_medicao');},
                function err(a,err) {console.warn(err);}
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
                ,[],
                function ok() {console.info('paciente');},
                function err(a,err) {console.warn(err);}
            );

            tx.executeSql(
                [
                    'INSERT INTO [Paciente] (',
                    '[Nome],[Dt_Nasc],[Tp_dm],',
                    '[Peso],[Altura],[Dt_Inicio_dm],',
                    '[Insulina_Rapida],[Insulina_basal],[Fator_Correcao],',
                    '[Glicemia_Ideal],[Insulina_Cho])',
                    'VALUES ( ?,?,?,?,?,?,?,?,?,?,?)'
                ].join(''),
                ['','','','','','','','','','',''],
                function ok() {console.info('insert paciente');},
                function err(a,err) {console.warn(err);}
            );

            tx.executeSql(
                [
                    'CREATE TABLE [Tipo_Insulina] (',
                    '[Id] Integer NOT NULL Primary Key autoincrement,',
                    '[Descricao] VARCHAR(200));'
                ].join('')
                ,[],
                function ok() {console.info('tipo_insulina');},
                function err(a,err) {console.warn(err);}
            );

        });
    };

    this.drop = function () {
        this.db.transaction(function(tx){
            tx.executeSql('DROP TABLE [Aplicacao]');
            tx.executeSql('DROP TABLE [Motivo_Aplicacao]');
            tx.executeSql('DROP TABLE [Medicao]');
            tx.executeSql('DROP TABLE [Motivo_Medicao]');
            tx.executeSql('DROP TABLE [Paciente]');
            tx.executeSql('DROP TABLE [Tipo_Insulina]');
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

    this.exist = function(table, Id) {
        var exist;
        this.db.transaction(
            function (tx) {
                tx.executeSql(
                    'SELECT COUNT(*)>0 as exist FROM ' + table + ' WHERE id = '+ Id, []
                    , function (tx, res) {
                        exist = res.rows.item(0).exist;
                        return exist;
                    }
                    , function (tx, err) { console.warn(err);}
                );
            }
        );
        return exist;
    }
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