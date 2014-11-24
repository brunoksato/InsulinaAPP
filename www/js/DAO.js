/**
 * Created by Bruno on 14/11/2014.
 */

angular.module('DAO', [])
    .service('DAO', DAO)
    .factory('DAOFactory', DAOFactory);

function DAO() {

    this.db;

    //List Table names
    //select name from sqlite_master where type = 'table' and (name not like 'sqlite%' and name not like '_%')

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

                //console.warn(this.db.getVersion());
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
                    'CREATE TABLE [Tempo] (',
                    '[Id] INTEGER NOT NULL Primary Key autoincrement,',
                    '[Data] DateTime Unique,',
                    '[Observacao] VARCHAR(200));'

                ].join('')
                ,[],
                function ok() {console.info('tempo');},
                function err(a,err) {console.warn(err);}
            );

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

            tx.executeSql(
                [
                    'INSERT INTO [Tipo_Insulina] (Descricao) ',
                    'SELECT (?) as Descricao UNION SELECT (?) UNION SELECT (?) UNION SELECT (?) UNION SELECT (?) UNION SELECT (?)'
                ].join('')
                ,['Jejum','Café da Manhã','Almoço'
                    ,'Café da tarde','Janta', 'Mal Estar'],
                function ok() {console.info('insert Tipo_Insulina');},
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
                    'INSERT INTO [Motivo_Aplicacao] (Descricao) ',
                    'SELECT (?) as Descricao UNION SELECT (?) UNION SELECT (?) UNION SELECT (?) UNION SELECT (?) UNION SELECT (?)'
                ].join('')
                ,['Jejum','Café da Manhã','Almoço'
                    ,'Café da tarde','Janta', 'Mal Estar'],
                function ok() {console.info('insert motivo_aplicacao');},
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
            tx.executeSql('DROP TABLE [Tempo]');
            tx.executeSql('DROP TABLE [Tipo_Insulina]');
        });
    };

    this.save = function (item, callback) {
        this.exist(item, function (res,DAO) {
            if (res) {

                DAO.update(item, callback);
            } else {
                DAO.insert(item,callback);
            }
        }, this);
    };
    //DAO.insert(
    //    {
    //        Table:'motivo_medicao',
    //        Fields:['Descricao'],
    //        Values: ['TESTE']
    //    }
    //    ,function (res) {
    //        if (rowsAffected == 1) {
    //            //alert SUCESSO
    //            console.info('ID = ' + res.insertId)
    //        }
    //    });
    this.insert = function (item, callback) {
        this.db.transaction(function (tx) {
            var params = [];
            for (var i = 0; i < item.Fields.length; i++) {
             params.push('?');
            }

            tx.executeSql('INSERT INTO ' + item.Table + '(' + item.Fields.join(', ') + ') VALUES (' + params.join(',') + ')',

                item.Values, function(tx, res) { callback(res); } , function (tx, err) { console.warn(err);});
        });
    };

    //DAO.update(
    //    {
    //        Table:'motivo_medicao',
    //        Fields:['Descricao'],
    //        Id: 7,
    //        Values: ['TESTE']
    //    }
    //    ,function (res) {
    //        //rowsAffected: 1, insertId: ?
    //        console.info(res);
    //        if (res.rowsAffected == 1) {
    //            //alert SUCESSO
    //            console.warn('sucesso');
    //        } else {
    //            //alert FALHA
    //        }
    //    });
    this.update = function (item, callback) {
        if (typeof(item) !== 'object' || typeof(callback) !== 'function' )
            throw new TypeError('Need parse an object and a function.');
        this.db.transaction(function (tx) {
            tx.executeSql(
                'UPDATE ' + item.Table + ' SET ' + item.Fields.join(' = ?, ') + '=? WHERE Id =' + item.Id
                ,item.Values,
                function (tx, res) {
                    callback(res);
                }, function (tx, err) { console.warn(err); }
            );
        });
    };

    this.delete = function (db) {

    };

    this.sync = function (db) {

    };

    //{
    // Table: '',
    // Fields: ['Id'],
    // Values: [1]
    // },
    // function (res)
    // {
    //      if(res) console.info('existe');
    // }
    this.exist = function(item, callback, DAO) {
        if (typeof(item) !== 'object' || typeof(callback) !== 'function' )
            throw new TypeError('Need parse an object and a function.');
        var search = {f:'Id',v:item.Id};
        if (!item.Id) search = {f:item.Fields[0],v:item.Values[0]}
        this.db.transaction(
            function (tx) {
                tx.executeSql(
                    'SELECT COUNT(*)>0 as exist FROM ' + item.Table + ' WHERE ' + search.f + ' = ?', [search.v]
                    , function (tx, res) {

                        var resposta = res.rows.item(0).exist;

                        callback(resposta, DAO);
                    }
                    , function (tx, err) { console.warn(err);}
                );
            }
        );
    }

    this.validar = function (item, callback, needValues) {
        if (typeof(item) !== 'object' || typeof(callback) !== 'function' )
            throw new TypeError('Need parse an object and a function.');
        if (item == null || item === 'undefined' || callback === 'undefined')
            throw new SyntaxError('Params can\'nt be null');
        if (item.Table === 'undefined' || item.Id === 'undefined')
            return false;
        if (needValues) {
            if (item.Fields === 'undefined' || item.Values === 'undefined')
                return false;
            if (!Array.isArray(item.Fields) || !Array.isArray(item.Fields))
                return false;
        }
        return true;
    }
};
DAO.$inject = [];

//insert into TEMPO (data, observacao)
//select
//(strftime('%m-%d-%Y','2014-11-21T09:00:00.037Z')) as data
//    ,('teste 1') as observacao
//union
//select (strftime('%m-%d-%Y','2014-11-22T09:00:00.037Z')),('teste 2') union
//select (strftime('%m-%d-%Y','2014-11-23T09:00:00.037Z')),('teste 3') union
//select (strftime('%m-%d-%Y','2014-11-24T10:00:00.037Z')),('teste 4');

//???
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