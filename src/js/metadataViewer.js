/*global define, amplify*/
define([
    'jquery',
    'require',
    'loglevel',
    'fx-md-v/config/errors',
    'fx-md-v/config/events',
    'fx-md-v/config/config',
    'fx-md-v/models/modelCreator',
    'fx-md-v/outputs/outputCreator',
    "fx-common/bridge"
], function ($, require, log, ERR, EVT, C, ModelCreator, OutputCreator, Bridge) {

    'use strict';

    function MetadataViewer(o) {
        log.info("FENIX metadata viewer");
        log.info(o);

        $.extend(true, this, C, {initial: o});

        this._parseInput();

        var valid = this._validateInput();

        if (valid === true) {

            this._initVariables();

            this._bindEventListeners();

            this._getMDSD().then(
                $.proxy(this._onGetMDSDSuccess, this),
                $.proxy(this._onGetMDSDError, this)
            );

            return this;

        } else {
            log.error("Impossible to create Metadata Viewer");
            log.error(valid)
        }
    }

    // API

    /**
     * pub/sub
     * @return {Object} MetadataViewer instance
     */
    MetadataViewer.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    /**
     * Dispose component
     */
    MetadataViewer.prototype.dispose = function () {

        this.outputCreator.dispose();

        this._unbindEventListeners();

        log.info("Metadata viewer[" + this.id + "] disposed");

        this._trigger("dispose", this.model);


    };

    // end API

    MetadataViewer.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    MetadataViewer.prototype._parseInput = function () {

        this.$el = $(this.initial.el);
        this.model = this.initial.model;
        this.lang = this.initial.lang || C.lang;
        this.lang = this.lang.toUpperCase();

        this.cache =  this.initial.cache || C.cache;
        this.environment = this.initial.environment || C.environment;

        this.config = $.extend(true, {}, C.config, this.initial.config);
        this.popover = $.extend(true, {}, C.popover, this.initial.popover);

        this.whiteList = this.initial.whiteList || C.whiteList;

        this.expandedRecursiveAttributes = this.initial.expandedRecursiveAttributes || C.expandedRecursiveAttributes;
        this.expandedSingleAttributes = this.initial.expandedSingleAttributes || C.expandedSingleAttributes;

        this.export = typeof this.initial.export === 'boolean' ? this.initial.export : C.export;

    };

    MetadataViewer.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set MetadataViewer id
        if (!this.id) {

            window.fx_MetadataViewer_id >= 0 ? window.fx_MetadataViewer_id++ : window.fx_MetadataViewer_id = 0;
            this.id = String(window.fx_MetadataViewer_id);
            log.info("Set auto id to: " + this.id);
        }

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: ERR.missingContainer});
            log.warn("Impossible to find MetadataViewer container");
        }

        if (!this.model) {
            errors.push({code: ERR.missingModel});
            log.warn("Impossible to find MetadataViewer model");
        }

        return errors.length > 0 ? errors : valid;

    };

    MetadataViewer.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

        this.modelCreator = new ModelCreator({
            data: this.model.hasOwnProperty("metadata") ? this.model.metadata : this.model,
            lang: this.lang
        });

        this.outputCreator = new OutputCreator({
            el: this.$el,
            export: this.export,
            popover: this.popover,
            whiteList: this.whiteList,
            config: this.config,
            expandedRecursiveAttributes: this.expandedRecursiveAttributes,
            expandedSingleAttributes: this.expandedSingleAttributes,

        });

        this.bridge = new Bridge({
            environment: this.environment,
            cache: this.cache
        });

    };

    MetadataViewer.prototype._bindEventListeners = function () {

        amplify.subscribe(EVT.export, this, this._onExport);

    };

    MetadataViewer.prototype._getMDSD = function () {

        return this.bridge.getMDSD();
    };

    MetadataViewer.prototype._onGetMDSDError = function (err) {

        log.error(ERR.getMDSDError);
        log.error(err);

    };

    MetadataViewer.prototype._onGetMDSDSuccess = function (mdsd) {

        log.info("MDSD loaded successfully");

        this.mdsd = mdsd;

        this._render();

    };

    MetadataViewer.prototype._render = function () {

        this._processModel();

        this._renderOutput();

        this._trigger("ready", this.model);

    };

    MetadataViewer.prototype._processModel = function () {

        this.outputModel = this.modelCreator.process(this.mdsd);

        this._renderOutput();

    };

    MetadataViewer.prototype._renderOutput = function () {

        this.outputCreator.render(this.outputModel);
    };

    MetadataViewer.prototype._onExport = function () {

        this._trigger("export", this.model);

    };

    //disposition
    MetadataViewer.prototype._unbindEventListeners = function () {

        amplify.unsubscribe(EVT.export, this._onExport);

    };

    return MetadataViewer;
});