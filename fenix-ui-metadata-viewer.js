define(['jquery',
        'mustache',
        'text!geobricks_ui_processing/html/templates.html',
        'i18n!geobricks_ui_processing/nls/translate',
        'text!geobricks_ui_processing/config/modis.json',
        'sweet-alert',
        'bootstrap'], function ($, Mustache, templates, translate, modis_configuration) {

    'use strict';

    function PROCESSING() {

        this.CONFIG = {
            lang: 'en',
            target_dir: null,
            filenames: null,
            url_processing: 'http://localhost:5555/processing/process/'
        };

    }

    /**
     * This is the entry method to configure the module.
     *
     * @param config Custom configuration in JSON format to extend the default settings.
     */
    PROCESSING.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

        /* Cast JSON files, if needed. */
        this.CONFIG.modis_configuration = $.parseJSON(modis_configuration);

        /* Source paths for the first step of the processing. */
        var source_paths = [];
        for (var i = 0 ; i < this.CONFIG.filenames.length ; i++)
            source_paths.push(this.CONFIG.target_dir + '/' + this.CONFIG.filenames[i]);

        console.debug('PROCESS START:');
        for (i = 0 ; i < source_paths.length ; i++)
            console.debug(source_paths[i]);
        console.debug();

        /* Process the first object. */
        this.process_step(source_paths, this.CONFIG.modis_configuration[Object.keys(this.CONFIG.modis_configuration)[0]], 1);

    };

    PROCESSING.prototype.process_step = function(source_paths, process_object, next_index) {

        /* This. */
        var _this = this;

        /* Edit the process object. */
        for (var i = 0 ; i < process_object.length ; i++) {
            process_object[i].source_path = source_paths;
            process_object[i].output_path = this.CONFIG.target_dir + '/extract_bands';
        }

        $.ajax({

            url: this.CONFIG.url_processing,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(process_object),
            contentType: 'application/json',

            success: function (response) {

                /* Cast the response to JSON, if needed. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Process next step, if any. */
                try {
                    var next_p_o = _this.CONFIG.modis_configuration[Object.keys(_this.CONFIG.modis_configuration)[next_index]];
                    _this.process_step(json, next_p_o, 1 + parseInt(next_index));
                } catch(e) {
                    sweetAlert({
                        title: translate.info,
                        text: translate.processing_complete,
                        type: 'info',
                        confirmButtonColor: '#379BCE'
                    });
                }

            },

            error: function(a, b, c) {
                sweetAlert({
                    title: translate.error,
                    text: e,
                    type: 'error',
                    confirmButtonColor: '#379BCE'
                });
            }

        });

    };

    return PROCESSING;

});
