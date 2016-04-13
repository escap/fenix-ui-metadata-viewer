
define(['jquery','q' ,'underscore',
    'fx-md-v/model/ModelCreator',
    'fx-md-v/output/TreegridAdapter'],
    function($,Q,_, ModelCreator, ViewAdapter){

    'use strict'


    function MainController() {};


    MainController.prototype.init = function (opts) {

        this.o = $.extend(true,{}, opts);

        this.$modelCreator = new ModelCreator;

        this.$modelCreator.init(this.o);

        this.$modelCreator._startInternModelData(_.bind(this.render, this))

    };


    MainController.prototype._initVariables  =function() {

    };


    MainController.prototype.render = function (internmodel) {

        this.$viewAdapter  = new ViewAdapter(this.o);

        this.$internModel  = this.$modelCreator.getInternModelData();

        this.$viewAdapter.init(this.$internModel);

        this.$viewAdapter._visualizeData(this.$viewAdapter._onListening());
    };


    MainController.prototype.destroy  =function() {

        this.$viewAdapter.destroy();

    };


    return MainController;
});
