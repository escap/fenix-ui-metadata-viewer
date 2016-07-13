/*global define*/

define(function () {

    var config = {

        paths: {
            jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            bootstrap: '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            treegrid: '{FENIX_CDN}/js/jquery-treegrid/0.3.0/js/jquery.treegrid.min',
            moment: '{FENIX_CDN}/js/moment/2.12.0/min/moment.min',

            'fx-md-v/config': '../../config',
            'fx-md-v/html': '../../html',
            'fx-md-v/models': './models/',
            'fx-md-v/outputs': './outputs/',
            'fx-md-v/start': './metadataViewer'
        },
        shim: {
            bootstrap: {
                deps: ["jquery"]
            },
            treegrid: {
                deps: ["jquery", "bootstrap"]
            },
            underscore: {
                exports: '_'
            },
            'amplify': {
                deps: ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            }
        }
    };

    return config;
});