define(['jquery',
        'handlebars',
        'FAOSTAT_UI_COMMONS',
        'FAOSTAT_THEME',
        'text!fenix_ui_metadata_viewer/html/templates.html',
        'i18n!fenix_ui_metadata_viewer/nls/translate',
        'text!fenix_ui_metadata_viewer/config/application_settings.json',
        'jsonEditor',
        'sweetAlert'], function ($, Handlebars, Commons, FAOSTAT_THEME, templates, translate, application_settings) {

    'use strict';

    function FUIMDV() {

        this.CONFIG = {
            lang: 'en',
            edit: false,
            domain: 'GT',
            schema: null,
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

        /* Cast application settings. */
        if (typeof application_settings == 'string')
            application_settings = $.parseJSON(application_settings);

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = Commons.iso2faostat(this.CONFIG.lang);

        /* Apply FAOSTAT theme for json-editor. */
        JSONEditor.defaults.themes.faostat_theme = JSONEditor.AbstractTheme.extend(FAOSTAT_THEME);

        /* Extend string editor. */
        JSONEditor.defaults.editors.string = JSONEditor.defaults.editors.string.extend(this.custom_string_editor);

        /* This... */
        var _this = this;

        /* Clear previous editor, if any. */
        $('#' + _this.CONFIG.placeholder_id).empty();

        /* Load the schema from DB, if needed. */
        this.CONFIG.schema == null ? this.load_schema_from_db() : this.create_editor();

    };

    FUIMDV.prototype.load_schema_from_db = function() {

        /* This... */
        var _this = this;

        /* Load JSON schema. */
        $.ajax({

            url: this.CONFIG.url_mdsd,
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                _this.CONFIG.schema = response;
                if (typeof _this.CONFIG.schema == 'string')
                    _this.CONFIG.schema = $.parseJSON(response);

                /* Initiate JSON editor. */
                _this.create_editor();

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

    FUIMDV.prototype.create_editor = function() {

        /* Refactor schema. */
        this.CONFIG.schema = this.refactor_schema(this.CONFIG.schema);

        /* Initiate JSON editor. */
        var editor = new JSONEditor(document.getElementById(this.CONFIG.placeholder_id), {
            schema: this.CONFIG.schema,
            theme: 'faostat_theme',
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

        /* Remove unwanted labels. */
        $('#' + this.CONFIG.placeholder_id).find('div:first').find('h3:first').empty();
        $('#' + this.CONFIG.placeholder_id).find('div:first').find('p:first').empty();

        /* Load data. */
        this.load_data(editor);

    };

    FUIMDV.prototype.refactor_schema = function(json) {
        json['properties']['meIdentification'] = {};
        json['properties']['meIdentification']['propertyOrder'] = 1;
        json['properties']['meIdentification']['type'] = 'object';
        json['properties']['meIdentification']['title'] = translate.identification;
        json['properties']['meIdentification']['properties'] = {};
        var section_regex = /[me]{2}[A-Z]/;
        var properties = json.properties;
        for (var key in properties) {
            if (!section_regex.test(key)) {
                if (key == 'title') {
                    json['properties']['meIdentification']['properties']['title_fenix'] = json['properties'][key];
                } else {
                    json['properties']['meIdentification']['properties'][key] = json['properties'][key];
                }
                delete json['properties'][key];
            }
        }
        return json;
    };

    FUIMDV.prototype.apply_settings = function(data) {

        /* Apply application settings. */
        var settings = application_settings[this.CONFIG.application_name];

        /* Filter by blacklist... */
        if (settings['blacklist'] != null && settings['blacklist'].length > 0) {
            settings['blacklist'].forEach(function(setting) {
                try {
                    delete data[setting.toString()]
                } catch (e) {

                }
            });
        }

        /* ...or by whitelist. */
        else {
            for (var key in data) {
                if ($.inArray(key, settings['whitelist']) < 0) {
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

                /* Display the editor... */
                if (json != undefined) {

                    /* Regular expression test to reorganize metadata sections. */
                    json['meIdentification'] = {};
                    var section_regex = /[me]{2}[A-Z]/;
                    var properties = json;
                    for (var key in properties) {
                        if (!section_regex.test(key)) {
                            if (key == 'title') {
                                json['meIdentification']['title_fenix'] = json[key];
                            } else {
                                json['meIdentification'][key] = json[key];
                            }
                            delete json[key];
                        }
                    }

                    /* Populate the editor. */
                    if (json != null)
                        editor.setValue(json);

                    /* Disable editing. */
                    if (!_this.CONFIG.edit)
                        editor.disable();

                    /* Collapse editor. */
                    $('.btn.btn-default.json-editor-btn-collapse').click();

                }

                /* ...or a courtesy message. */
                else {
                    _this.display_courtesy_message();
                }

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

    FUIMDV.prototype.display_courtesy_message = function() {
        var source = $(templates).filter('#courtesy_message').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            message: translate.courtesy
        };
        var html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);
    };

    FUIMDV.prototype.custom_string_editor = {

        setValue: function (value, initial, from_template) {

            var self = this;

            if (this.template && !from_template)
                return;

            if (value === null) {
                value = '';
            } else if (typeof value === "object") {
                value = JSON.stringify(value);
            } else if (typeof value !== "string") {
                value = "" + value;
            }

            /* Convert milliseconds to valid date. */
            if (this.format == 'date') {
                try {
                    var d = new Date(parseFloat(value));
                    value = d.toISOString().substring(0, 10);
                } catch (e) {

                }
            }

            if (value === this.serialized)
                return;

            /* Sanitize value before setting it */
            var sanitized = this.sanitize(value);

            if (this.input.value === sanitized)
                return;

            this.input.value = sanitized;

            /* If using SCEditor, update the WYSIWYG */
            if (this.sceditor_instance) {
                this.sceditor_instance.val(sanitized);
            } else if (this.epiceditor) {
                this.epiceditor.importFile(null, sanitized);
            } else if (this.ace_editor) {
                this.ace_editor.setValue(sanitized);
            }

            var changed = from_template || this.getValue() !== value;

            this.refreshValue();

            if (initial) {
                this.is_dirty = false;
            } else if (this.jsoneditor.options.show_errors === "change") {
                this.is_dirty = true;
            }

            if (this.adjust_height)
                this.adjust_height(this.input);

            /* Bubble this setValue to parents if the value changed */
            this.onChange(changed);

        }

    };

    return FUIMDV;

});