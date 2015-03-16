define(['jquery',
        'handlebars',
        'text!fenix_ui_metadata_viewer/html/templates.html',
        'i18n!fenix_ui_metadata_viewer/nls/translate',
        'sweetAlert'], function ($, Handlebars, templates, translate) {

    'use strict';

    function FUIMDV() {

        this.CONFIG = {
            lang: 'en',
            domain: 'GT',
            placeholder_id: 'placeholder',
            url_d3s: 'http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/uid',
            view_type: null
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

            url: this.CONFIG.url_d3s + '/' + this.CONFIG.domain + '?full=true',
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Store the DB result. */
                _this.CONFIG.metadata = json;

                /* Render the metadata. */
                switch (_this.CONFIG.view_type) {
                    case 'accordion':
                        _this.view_as_accordion();
                        break;
                    default:
                        _this.view_as_accordion();
                        break;
                }

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

    FUIMDV.prototype.view_as_accordion = function() {

        /* Initiate variables. */
        var panels = [];

        /* Iterate over DB result. */
        for (var key in this.CONFIG.metadata) {
            if (typeof this.CONFIG.metadata[key] != 'object') {
                panels.push({
                    panel_id: key,
                    panel_header_label: this.CONFIG.metadata[key],
                    lines: [
                        {
                            field_name: 'Name',
                            field_value: 'value'
                        }
                    ]
                });
            }
        }

        /* Static accordion. */
        var source = $(templates).filter('#iteration').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            panels: panels
        };
        Handlebars.registerPartial('single_line', $(templates).filter('#single_line').html());
        var html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

    };

    return FUIMDV;

});
