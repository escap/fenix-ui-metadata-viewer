define( ["jquery", "fx-mdv/controller/mainController"], function ($,Controller) {

    'use strict';

    var o = {}

    function Starter() {};

    Starter.prototype._validateInput = function () {
        return (typeof this.o.data !== 'undefined');
    };

    Starter.prototype.init = function (options) {
        this.o = $.extend(true, o, options);
        this._validateInput();
        this.$controller = new Controller;
        this.$controller.init(this.o);
    };

    Starter.prototype.render = function() {

        this.$controller.render();
    };

    Starter.prototype.destroy = function () {
        this.$controller.destroy();
    };


    return Starter;
})
