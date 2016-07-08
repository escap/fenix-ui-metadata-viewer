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
            SECOND: "#second"
        },
        empty_model = {data: []},
        error_model = {},
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
            lang: 'en',
            environment : "develop",
            el: $(s.STANDARD)
        });

        log.trace("Rendering standard metadata viewer: end");
    };

    Test.prototype._renderSecond = function () {

        log.trace("Rendering second metadata viewer: start");

        var metadataViewer = new MetadataViewer({
            model: valid_model,
            lang: 'en',
            el: $(s.SECOND)
        });

        log.trace("Rendering second metadata viewer: end");
    };

    return new Test();

});