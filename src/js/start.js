
define(['jquery', 'mainController'], function ($, Controller) {

    'use strict';

    var o = {}

    function Starter(options) {
    /*    this.o = $.extend(true, o, options);*/
        console.log(Controller)
        this.$controller = new Controller;
    };

    Starter.prototype._validateInput = function () {
//return (typeof this.o.data !== 'undefined' && typeof this.o.data.uid !== 'undefined');
    return true;
    };

    Starter.prototype.init = function () {
        this._validateInput();

        this.$controller = new Controller;
        this.$controller.init(this.o);
    };

    Starter.prototype.destroy = function () {
        this.$controller.destroy();
    };


    return Starter;
})
