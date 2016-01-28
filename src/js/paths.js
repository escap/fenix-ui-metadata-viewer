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
            "fx-md-v/controller/mainController": "./controller/mainController",
            'fx-md-v/model/ModelCreator': './model/ModelCreator',
            'fx-md-v/output/TreegridAdapter': './output/TreegridAdapter',
            'fx-md-v/template': '../../html/templates',
            'fx-md-v/config': '../../config',
            'fx-md-v/start' : 'start'
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