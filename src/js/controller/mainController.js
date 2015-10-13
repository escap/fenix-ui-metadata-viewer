
define(['jquery', 'fx-mdviewer/model/ModelCreator'], function($, ModelCreator){

    'use strict'


    function MainController() {};


    MainController.prototype.init = function (opts) {

        this.o = $.extend(true,{}, opts);

        this.$modelCreator= new ModelCreator;

        this.$modelCreator.init(this.o);
    };

    MainController.prototype._initVariables  =function() {

    };


    MainController.prototype.render = function () {

    };

    MainController.prototype.destroy  =function() {

    };


    return MainController;

})
