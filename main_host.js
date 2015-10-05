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
        chaplin: "//fenixrepo.fao.org/cdn/js/chaplin/1.0.1/chaplin.min",
        domReady: "//fenixrepo.fao.org/cdn/js/requirejs/plugins/domready/2.0.1/domReady",
        i18n: "//fenixrepo.fao.org/cdn/js/requirejs/plugins/i18n/2.0.4/i18n",
        amplify: '//fenixrepo.fao.org/cdn/js/amplify/1.1.2/amplify.min',
        text: '//fenixrepo.fao.org/cdn/js/requirejs/plugins/text/2.0.12/text',
        rsvp: '//fenixrepo.fao.org/cdn/js/rsvp/3.0.17/rsvp',
        swiper: "//fenixrepo.fao.org/cdn/js/swiper/3.0.7/dist/js/swiper.min",
        jstree: "//fenixrepo.fao.org/cdn/js/jstree/3.0.8/dist/jstree",
        alpaca: '//code.cloudcms.com/alpaca/1.5.13/bootstrap/alpaca',
        treegrid : '//fenixrepo.fao.org/cdn/js/jquery-treegrid/0.3.0/js/jquery.treegrid.min',

        'fx-md-v-visualization-creator' : 'CreatorVisualizationData'


    },

    // Underscore and Backbone are not AMD-capable per default,
    // so we need to use the AMD wrapping of RequireJS
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        treegrid : {
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
require([
    'start',
    'domReady!'
], function (Starter) {


    var optionsFenix =
    {
        viewerOptions: {
            isFenixMetadata : true
        }

    };
    var starter = new Starter();
    starter.init();


});