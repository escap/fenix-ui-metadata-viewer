define(['jquery',
        'handlebars',
        'text!fenix_ui_metadata_viewer/html/templates.html',
        'i18n!fenix_ui_metadata_viewer/nls/translate',
        'sweet-alert'], function ($, Handlebars, templates, translate) {

    'use strict';

    function FUIMDV() {

        this.CONFIG = {
            lang: 'en',
            placeholder_id: 'placeholder',
            url_d3s: 'http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/uid/GE?full=true'
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

        $.ajax({

            url: this.CONFIG.url_d3s,
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Static accordion. */
                var source = $(templates).filter('#iteration').html();
                var template = Handlebars.compile(source);
                var dynamic_data = {
                    panels: [
                        {
                            panel_id: 'pippo',
                            panel_header_label: 'Header',
                            lines: [
                                {
                                    field_name: 'asd',
                                    field_value: 'ads'
                                },
                                {
                                    field_name: 'asd',
                                    field_value: 'ads'
                                },
                                {
                                    field_name: 'asd',
                                    field_value: 'ads'
                                }
                            ]
                        }
                    ]
                };
                var html = template(dynamic_data);
                $('#' + _this.CONFIG.placeholder_id).html(html);

            },

            error: function (a, b, c) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a
                });
            }

        });

    };

    return FUIMDV;

});
