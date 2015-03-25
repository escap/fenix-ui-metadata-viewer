define(function() {

    var config = {
        paths: {
            FENIX_UI_METADATA_VIEWER: 'fenix-ui-metadata-viewer',
            fenix_ui_metadata_viewer: '../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            },
            jsonEditor: {
                deps: ['jquery', 'bootstrap']
            }
        }
    };

    return config;

});