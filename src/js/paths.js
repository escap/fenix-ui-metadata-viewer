define(function () {

    var config = {
        paths: {
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            config: "../../config"


        },
        shim: {
            'amplify' : {
                deps : ['jquery']
            },
            'fx-rp-plugins-factory':{
                deps : ['fx-rp-metadata','fx-rp-table','fx-rp-surveyFMD']
            }
        }
    };

    return config;
});