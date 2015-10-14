
define(['jquery','q' ,'fx-mdviewer/model/ModelCreator'
,'fx-mdviewer/output/TreegridAdapter'], function($,Q, ModelCreator, ViewAdapter){

    'use strict'


    function MainController() {};


    MainController.prototype.init = function (opts) {

        var self = this;

        this.o = $.extend(true,{}, opts);

        this.$modelCreator = new ModelCreator;


        this.$modelCreator.init(this.o);

        this.$modelCreator.getMDSD();

        this.$modelCreator.initInternModelDAta();

        this.render();
        /*).done(function(){
            self.render()
        })
*/
      /*  this.$modelCreator.init(this.o).then( self.render);

        this.render();*/
    };

    MainController.prototype._initVariables  =function() {

    };


    MainController.prototype.render = function () {
        this.$viewAdapter  = new ViewAdapter(this.o);

        this.$internModel  = this.$modelCreator.getInternModelData();

        this.$viewAdapter.init(this.$internModel);
    };

    MainController.prototype.destroy  =function() {

    };


    return MainController;

})
