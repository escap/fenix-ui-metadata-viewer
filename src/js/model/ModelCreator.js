define(['jquery',
    'fx-mdviewer/config/config',
    'fx-mdviewer/config/config-default',
    'q'
], function($,C,DC,Q){

    'use strict'

    var o = {};

    function ModelCreator() {};


    ModelCreator.prototype.init = function (opts) {
        this.o = $.extend(true, {}, o ,opts);
        debugger;
        this._initVariables();
        this._getMDSD().then(function(){debugger;})
    };

    ModelCreator.prototype._initVariables  =function() {

        debugger;
        this.$originalMetadata = this.o.data;
        this.$prefixUrlMetadata = C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS;
        this.$urlMDSD = C.SERVICE_MDSD_ADDRESS || DC.SERVICE_MDSD_ADDRESS;

    };


    ModelCreator.prototype._makeCalls = function() {

        var self = this;
        return Q.Promise(function(resolve, reject){
            self._getMetadata().then(self._getMDSD());
            resolve();
        })
    };


    ModelCreator.prototype._getMDSD = function() {

        var self = this;
        return Q.Promise(function (resolve, reject) {

            debugger;
            $.ajax({
                type: 'GET',
                url: self.$urlMDSD,
                context: this,
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {

                    if (jqXHR.status === 200) {
                        self.$mdsd = data
                        resolve();
                    } else {
                        reject(new Error("Status code was " + jqXHR.status));
                    }
                },
                error: reject
            });

        });
    };



    ModelCreator.prototype.render = function () {

    };

    ModelCreator.prototype.destroy  =function() {

    };


    return ModelCreator;


})