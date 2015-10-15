requirejs.config({


    //Set the config for the i18n
    i18n: {
        locale: 'en'
    },

    // The path where your JavaScripts are located
    baseUrl: './src/js',

    // Specify the paths of vendor libraries
    paths: {
        // utility libraries
        'jquery': '//fenixrepo.fao.org/cdn/js/jquery/2.1.1/jquery.min',
        'bootstrap': '//fenixrepo.fao.org/cdn/js/bootstrap/3.2/js/bootstrap.min',
        underscore: "//fenixrepo.fao.org/cdn/js/underscore/1.7.0/underscore.min",
        backbone: "//fenixrepo.fao.org/cdn/js/backbone/1.1.2/backbone.min",
        handlebars: "//fenixrepo.fao.org/cdn/js/handlebars/2.0.0/handlebars",
        domReady: "//fenixrepo.fao.org/cdn/js/requirejs/plugins/domready/2.0.1/domReady",
        i18n: "//fenixrepo.fao.org/cdn/js/requirejs/plugins/i18n/2.0.4/i18n",
        amplify: '//fenixrepo.fao.org/cdn/js/amplify/1.1.2/amplify.min',
        text: '//fenixrepo.fao.org/cdn/js/requirejs/plugins/text/2.0.12/text',
        moment: '//fenixrepo.fao.org/cdn/js/moment/2.9.0/moment.min',
        swiper: "//fenixrepo.fao.org/cdn/js/swiper/3.0.7/dist/js/swiper.min",
        jstree: "//fenixrepo.fao.org/cdn/js/jstree/3.0.8/dist/jstree",
/*
        treegrid: 'libs/jquery.treegrid',
*/
        treegrid: '//fenixrepo.fao.org/cdn/js/jquery-treegrid/0.3.0/js/jquery.treegrid.min',
        'fx-md-v-visualization-creator': 'CreatorVisualizationData',
        'q': '//fenixrepo.fao.org/cdn/js/q/1.1.2/q',
        "fx-mdviewer/controller/mainController": "./controller/mainController",
        'fx-mdviewer/model/ModelCreator': './model/ModelCreator',
        'fx-mdviewer/output/TreegridAdapter': './output/TreegridAdapter',
        'fx-mdviewer/template': './template',
        'fx-mdviewer/config': '../../config'
    },

    // Underscore and Backbone are not AMD-capable per default,
    // so we need to use the AMD wrapping of RequireJS
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        treegrid: {
            deps: ["jquery"]
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        }


    }
    // For easier development, disable browser caching
    // Of course, this should be removed in a production environment
    //, urlArgs: 'bust=' +  (new Date()).getTime()

});

// Bootstrap the application
require(['start', 'text!../../tests/GN.json'], function (Starter, DATA) {

    'use strict';


    var optionsMD = {
        data: JSON.parse(DATA),
        lang: 'en',
        //placeholder_id: 'metadata_panel',
        placeholder: '.container'
    };
    var starter = new Starter();
    starter.init(optionsMD);

});