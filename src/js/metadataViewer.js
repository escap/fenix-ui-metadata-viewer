define([
    "jquery",
    "fx-md-v/controller/mainController",
    'fx-md-v/config/config',
    'fx-md-v/config/config-default',
], function ($, Controller, C, DC) {

    'use strict';

    function Starter(options) {

        options.data = options.model.hasOwnProperty("metadata") ? options.model.metadata : options.model;
        options.placeholder = options.el;

        this.o = $.extend(true, this.o, options, C, DC);

        this._validateInput();

        this.$controller = new Controller;
        this.$controller.init(this.o);
    }

    Starter.prototype._validateInput = function () {
        return (typeof this.o.data !== 'undefined');
    };

    Starter.prototype.dispose = function () {
        this.$controller.destroy();
    };

    return Starter;
});
