define( ["jquery", "fx-md-v/controller/mainController"], function ($,Controller) {

    'use strict';

    var o = {}

    function Starter() {};

    Starter.prototype._validateInput = function () {
        return (typeof this.o.data !== 'undefined');
    };

    Starter.prototype.render = function (opts) {

        var options = $.extend(true, {}, opts);

        options.data = options.model.hasOwnProperty("metadata") ? options.model.metadata :  options.model;
        options.placeholder = options.el;

        this.o = $.extend(true, o, options);
        this._validateInput();
        this.$controller = new Controller;
        this.$controller.init(this.o);
    };

    Starter.prototype.destroy = function () {
        this.$controller.destroy();
    };


    return Starter;
})
