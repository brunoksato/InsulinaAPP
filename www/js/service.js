/**
 * Created by EA on 24/11/2014.
 */
angular.module('service', ['ionic'])
    .service('service',service);


function service($timeout, DAO) {
    this.alert = function(txt, field) {
        field(txt);
        $timeout(
            function () {
                field('');
            }, 2000
        )
    }

    this.tabelaA1C = [
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
    ];

    this.aplicacao = 0;
}
