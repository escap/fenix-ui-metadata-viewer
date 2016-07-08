define([
    'jquery',
    'underscore',
    'fx-md-v/model/ModelCreator',
    'fx-md-v/output/TreegridAdapter'
],
    function($,_, ModelCreator, ViewAdapter){

    'use strict';

    function MainController() {}

    MainController.prototype.init = function (opts) {

        this.o = $.extend(true,this.o, opts);

        this.$modelCreator = new ModelCreator;

        this.$modelCreator.init(this.o, _.bind(this.render, this));

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
