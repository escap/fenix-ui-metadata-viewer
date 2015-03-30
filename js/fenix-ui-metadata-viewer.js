define(['jquery',
        'handlebars',
        'text!fenix_ui_metadata_viewer/html/templates.html',
        'i18n!fenix_ui_metadata_viewer/nls/translate',
        'jsonEditor',
        'sweetAlert'], function ($, Handlebars, templates, translate) {

    'use strict';

    function FUIMDV() {

        this.CONFIG = {
            lang: 'en',
            edit: false,
            domain: 'GT',
            view_type: null,
            placeholder_id: 'placeholder',
            url_mdsd: 'http://168.202.28.57:8080/wds/rest/mdsd/',
            url_d3s: 'http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/uid'
        };

    }

    /**
     * This is the entry method to configure the module.
     *
     * @param config Custom configuration in JSON format to extend the default settings.
     */
    FUIMDV.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

        /* This... */
        var _this = this;

        /* Load JSON schema. */
        $.ajax({

            url: this.CONFIG.url_mdsd,
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Initiate JSON editor. */
                var editor = new JSONEditor(document.getElementById(_this.CONFIG.placeholder_id), {
                    schema: json,
                    theme: 'bootstrap3',
                    iconlib: 'fontawesome4',
                    disable_edit_json: true,
                    disable_properties: true,
                    collapsed: true,
                    disable_array_add: true,
                    disable_array_delete: true,
                    disable_array_reorder: true,
                    disable_collapse: true,
                    remove_empty_properties: false
                });

                /* Remove unwanted labels. */
                $('#' + _this.CONFIG.placeholder_id).find('div:first').find('h3:first').empty();
                $('#' + _this.CONFIG.placeholder_id).find('div:first').find('p:first').empty();

                /* Load data. */
                _this.load_data(editor);

            },

            error: function (a, b, c) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    FUIMDV.prototype.load_data = function(editor) {

        /* This... */
        var _this = this;

        /* Load JSON schema. */
        $.ajax({

            url: this.CONFIG.url_d3s + '/' + this.CONFIG.domain + '?full=true',
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Blacklist unwanted properties. */
                delete json.rid;
                delete json.dsd;

                /* Populate the editor. */
                editor.setValue(json);

                /* Disable editing. */
                if (!_this.CONFIG.edit)
                    editor.disable();

            },

            error: function (a, b, c) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    return FUIMDV;

});