define(function() {

    var config = {
        paths: {
            FENIX_UI_METADATA_VIEWER: 'fenix-ui-metadata-viewer',
            fenix_ui_metadata_viewer: '../',
            sweetAlert: 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/0.5.0/sweet-alert.min',
            jsonEditor: '{FENIX_CDN}/js/json-editor/0.7.17/jsoneditor'
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