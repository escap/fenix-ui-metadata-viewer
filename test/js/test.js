define([
    'loglevel',
    'jquery',
    'fx-md-v/start',
    'text!test/assets/uneca_population.json',
    'text!test/assets/GN.json'
], function (log, $, MetadataViewer, UnecaModel, GN) {

    'use strict';

    var s = {
            STANDARD: "#standard",
            SECOND: "#second",
            DISPOSE_BTN: "[data-role='dispose']"
        },
        empty_model = {data: []},
        error_model = {},
        lang = 'en',
        valid_model = JSON.parse(UnecaModel);

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderStandard();

        this._renderSecond();

    };

    Test.prototype._renderStandard = function () {

        log.trace("Rendering standard metadata viewer: start");

        var metadataViewer = new MetadataViewer({
            model: valid_model,
            lang: lang,
            environment: "develop",
            el: s.STANDARD,
            export: true,
            expandedRecursiveAttributes: ['meContent'],
            popover: {
                placement: 'left'
            }
        })
            .on("ready", function (model) {
                log.warn("listening 'ready' event");
                log.warn(model);

                $(s.DISPOSE_BTN).on("click", function () {
                    metadataViewer.dispose();
                })
            })
            .on("export", function (model) {
                log.warn("listening 'export' event");
                log.warn(model);
            });

        log.trace("Rendering standard metadata viewer: end");
    };

    Test.prototype._renderSecond = function () {

        log.trace("Rendering second metadata viewer: start");

        var metadataViewer = new MetadataViewer({
            model: valid_model,
            lang: lang,
            el: s.SECOND
        });

        log.trace("Rendering second metadata viewer: end");
    };

    return new Test();

});