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

                var s = '<ul>';
                for (var key in json) {
                    var s1 = '<li>';
                    if (typeof json[key] == 'object') {
                        s1 += '<ul>';
                        for (var key1 in json[key]) {
                            if (typeof json[key][key1] == 'object') {
                                s1 += '<ul>';
                                for (var key2 in json[key][key1]) {
                                    if (typeof json[key][key1][key2] == 'object') {
                                        s1 += '<ul>';
                                        for (var key3 in json[key][key1][key2]) {
                                            if (typeof json[key][key1][key2][key3] == 'object') {
                                                s1 += '<ul>';
                                                for (var key4 in json[key][key1][key2][key3]) {
                                                    if (typeof json[key][key1][key2][key3][key4] == 'object') {
                                                        s1 += '<ul>';
                                                        for (var key5 in json[key][key1][key2][key3][key4]) {
                                                            if (typeof json[key][key1][key2][key3][key4][key5] == 'object') {
                                                                s1 += '<ul>';
                                                                for (var key6 in json[key][key1][key2][key3][key4][key5]) {
                                                                    if (typeof json[key][key1][key2][key3][key4][key5][key6] == 'object') {
                                                                        s1 += '<ul>';
                                                                        for (var key7 in json[key][key1][key2][key3][key4][key5][key6]) {
                                                                            if (typeof json[key][key1][key2][key3][key4][key5][key6][key7] == 'object') {
                                                                                s1 += 'HHHHH';
                                                                            } else {
                                                                                s1 += '<li><b>' + key7 + ':</b> ' + json[key][key1][key2][key3][key4][key5][key6][key7] + '</li>';
                                                                            }
                                                                        }
                                                                        s1 += '<ul>';
                                                                    } else {
                                                                        s1 += '<li><b>' + key6 + ':</b> ' + json[key][key1][key2][key3][key4][key5][key6] + '</li>';
                                                                    }
                                                                }
                                                                s1 += '<ul>';
                                                            } else {
                                                                s1 += '<li><b>' + key5 + ':</b> ' + json[key][key1][key2][key3][key4][key5] + '</li>';
                                                            }
                                                        }
                                                        s1 += '<ul>';
                                                    } else {
                                                        s1 += '<li><b>' + key4 + ':</b> ' + json[key][key1][key2][key3][key4] + '</li>';
                                                    }
                                                }
                                                s1 += '</ul>';
                                            } else {
                                                s1 += '<li><b>' + key3 + ':</b> ' + json[key][key1][key2][key3] + '</li>';
                                            }
                                        }
                                        s1 += '</ul>';
                                    } else {
                                        s1 += '<li><b>' + key2 + ':</b> ' + json[key][key1][key2] + '</li>';
                                    }
                                }
                                s1 += '</ul>';
                            } else {
                                s1 += '<li><b>' + key1 + ':</b> ' + json[key][key1] + '</li>';
                            }
                        }
                        s1 += '</ul>';
                    } else {
                        s1 += '<li><b>' + key + ':</b> ' + json[key] + '</li>';
                    }
                    s += s1;
                }
                s += '</ul>';
                console.log(s);
                $('#' + _this.CONFIG.placeholder_id).html(s);

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
