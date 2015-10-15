define(function () {

    var config = {
        paths: {
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            'q': '//fenixrepo.fao.org/cdn/js/q/1.1.2/q',
            treegrid: '//fenixrepo.fao.org/cdn/js/jquery-treegrid/0.3.0/js/jquery.treegrid.min',
            "fx-mdviewer/controller/mainController": "./controller/mainController",
            'fx-mdviewer/model/ModelCreator': './model/ModelCreator',
            'fx-mdviewer/output/TreegridAdapter': './output/TreegridAdapter',
            'fx-mdviewer/template': './template',
            'fx-mdviewer/config': '../../config',
            FENIX_UI_METADATA_VIEWER : 'start'
        },
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
            'amplify' : {
                deps : ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            }
        }
    };

    return config;
});