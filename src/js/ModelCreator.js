define(['jquery',
    'fx-md-viewer/config/config',
    'fx-md-viewer/config/config-default',
    'q'
], function($,C,DC,Q){

    'use strict'

    var o = {};

    function ModelCreator() {

    };


    ModelCreator.prototype.init = function (opts) {
        this.o = $.extend(true, {}, o ,opts);
        this._initVariables();
        this._makeCalls();
    };

    ModelCreator.prototype._initVariables  =function() {

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
    }



    ModelCreator.prototype._getMetadata  =function() {

        var url,
            self = this;

        if (!this.o.data.hasOwnProperty('version')) {
            url = '/msd/resources/metadata/uid/' + this.o.data.uid;
        } else {
            url = '/msd/resources/metadata/' + this.o.data.uid + '/' + this.o.data.version;
        }

        return Q.Promise(function (resolve, reject) {

            $.ajax({
                type: 'GET',
                url:   self.$prefixUrlMetadata + "?full=true&dsd=true",
                context: this,
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {

                    if (jqXHR.status === 200) {
                        self.$metadata = data
                        resolve();
                    } else {
                        reject(new Error("Status code was " + jqXHR.status));
                    }
                },
                error: reject
            });
        });

    };


    ModelCreator.prototype._initVariables  =function() {

    };


    ModelCreator.prototype.render = function () {

    };

    ModelCreator.prototype.destroy  =function() {

    };


})