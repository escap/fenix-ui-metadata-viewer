define(['jquery',
        'handlebars',
        'FAOSTAT_UI_COMMONS',
        'text!fenix_ui_metadata_viewer/html/templates.html',
        'i18n!fenix_ui_metadata_viewer/nls/translate',
        'text!fenix_ui_metadata_viewer/config/application_settings.json',
        'jsonEditor',
        'sweetAlert'], function ($, Handlebars, Commons, templates, translate, application_settings) {

    'use strict';

    function FUIMDV() {

        this.CONFIG = {
            lang: 'en',
            edit: false,
            domain: 'GT',
            lang_faostat: 'E',
            application_name: 'faostat',
            placeholder_id: 'placeholder',
            url_wds_table: 'http://faostat3.fao.org/wds/rest/table/json',
            url_mdsd: 'http://faostat3.fao.org/d3s2/v2/mdsd',
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

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = Commons.iso2faostat(this.CONFIG.lang);

        /* FENIX Platform Theme. */
        JSONEditor.defaults.themes.fenix_platform = JSONEditor.AbstractTheme.extend({

            getFormControl: function (label, input, description) {

                if (label.innerHTML == 'Resource identification code') {
                    console.log(label.innerHTML);
                    console.log(input);
                    console.log(description.innerHTML);
                }

                var group = document.createElement('div');

                if (label && input.type === 'checkbox') {
                    group.className += ' checkbox';
                    label.appendChild(input);
                    label.style.fontSize = '14px';
                    group.style.marginTop = '0';
                    group.appendChild(label);

                    /* Custom implementation for the description field. */
                    if (description)
                        group.appendChild(this.createDescription(description));

                    input.style.position = 'relative';
                    input.style.cssFloat = 'left';
                }

                else {

                    group.className += ' form-group';

                    if (label) {
                        label.className += ' control-label';
                        group.appendChild(label);
                    }

                    /* Custom implementation for the description field. */
                    if (description)
                        group.appendChild(this.createDescription(description));

                    group.appendChild(input);

                }

                return group;

            },

            createDescription: function(description) {
                var icon = document.createElement('i');
                icon.className = 'fa fa-info-circle';
                icon.style.float = 'right';
                icon.onclick = function() {
                    window.sweetAlert({
                        title: '',
                        type: 'info',
                        text: description.innerHTML,
                        html: true
                    });
                };
                return icon;
            }

        });

        /* This... */
        var _this = this;

        /* Clear previous editor, if any. */
        $('#' + _this.CONFIG.placeholder_id).empty();

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
                var editor;
                try {
                    editor = new JSONEditor(document.getElementById(_this.CONFIG.placeholder_id), {
                        schema: json,
                        theme: 'fenix_platform',
                        iconlib: 'fontawesome4',
                        disable_edit_json: true,
                        disable_properties: true,
                        collapsed: true,
                        disable_array_add: true,
                        disable_array_delete: true,
                        disable_array_reorder: true,
                        disable_collapse: false,
                        remove_empty_properties: false
                    });
                } catch (e) {

                }

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

    FUIMDV.prototype.apply_settings = function(data) {

        /* Cast settings, if needed. */
        if (typeof application_settings == 'string')
            application_settings = $.parseJSON(application_settings);

        /* Apply application settings. */
        var settings = application_settings[this.CONFIG.application_name];

        /* Filter by blacklist... */
        if (settings.blacklist != null && settings.blacklist.length > 0) {
            settings.blacklist.forEach(function(setting) {
                try {
                    delete data[setting.toString()]
                } catch (e) {

                }
            });
        }

        /* ...or by whitelist. */
        else {
            for (var key in data) {
                if ($.inArray(key, settings.whitelist) < 0) {
                    try {
                        delete data[key.toString()]
                    } catch (e) {

                    }
                }
            }
        }

        return data;
    };

    FUIMDV.prototype.load_data = function(editor) {

        /* This... */
        var _this = this;

        /* ID to be used for D3S. */
        var d3s_id = this.CONFIG.domain != null ? this.CONFIG.domain : this.CONFIG.group;

        /* Load JSON schema. */
        $.ajax({

            url: this.CONFIG.url_d3s + '/' + d3s_id.toUpperCase() + '?full=true',
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Apply application settings. */
                json = _this.apply_settings(json);

                /* Populate the editor. */
                if (json != null)
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