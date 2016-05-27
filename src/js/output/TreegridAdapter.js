define(['jquery',
        'fx-md-v/config/config',
        'fx-md-v/config/config-default',
        'text!fx-md-v/template/template.hbs',
        'handlebars', 'treegrid', 'bootstrap'],
    function ($, C, DC, Template, Handlebars) {

        'use strict'

        var o = {
            'identifiers': {
                noParentId: 'noParent',
                depth_level: 'depth-level',
                parent_class: 'treegrid-parent-',
                treegrid_class: 'treegrid-',
                bean: {
                    title: 'title',
                    desc: 'description',
                    bean_name: 'bean'
                }
            },
            visualizationInfo: {
                container: '.container'
            },
            s: {
                'table_container': '.fx-md-viewer-container',
                'description_class': '.fx-md-viewer-description',
                'popover_class': '.popover',
                'template_wrapper': '#fx-md-viewer-wrapper'
            }
        };

        function TreegridAdapter(options) {
            this.o = $.extend(true, o, options);
            this.$el = $(this.o.placeholder);
        }

        TreegridAdapter.prototype.init = function (dataModel) {

            this.$whitelist = C.WHITELIST || DC.WHITELIST;
            this.$treegridSettings = C.TREEGRID_SEETINGS || DC.TREEGRID_SEETINGS;
            this.$popoverSettings = C.POPOVER_SETTINGS || DC.POPOVER_SETTINGS;
            this.$visualizationData = this._trasformDataToVisualizationModel(dataModel.model, 'noParent', 0);
            this.$hasExport = C.HAS_EXPORT || DC.HAS_EXPORT;
            this.$dataForTreeGRid = (this.$hasExport == true) ?
            {'title_resource': dataModel.title, 'data': this.$visualizationData, 'hasExport': this.$hasExport} :
            {'title_resource': dataModel.title, 'data': this.$visualizationData};

        };

        TreegridAdapter.prototype._trasformDataToVisualizationModel = function (model, parentBean, levelCounter) {

            var result = [];
            for (var i = 0, length = model.length; i < length; i++) {

                if (model[i].hasChildren && model[i].hasChildren === true) {

                    var className = (parentBean != 'noParent') ?
                    'treegrid-' + model[i]['bean'] + ' ' + 'treegrid-parent-' + parentBean + ' ' + 'depth-level-' + levelCounter + ' element' + ' fx-expand' :
                    'treegrid-' + model[i]['bean'] + ' ' + parentBean + ' ' + 'depth-level-' + levelCounter + ' treegrid-collapsed' + ' element' + ' fx-expand';

                    result.push({
                        'title': model[i]['title'],
                        'desc': model[i]['description'],
                        'bean': model[i]['bean'],
                        'parentBean': parentBean,
                        'className': className
                    })

                    result = result.concat(this._trasformDataToVisualizationModel(model[i]['value'], model[i]['bean'], levelCounter + 1))
                }

                else if (model[i].hasChildren === false) {
                    var className = (parentBean != 'noParent') ?
                    'treegrid-' + model[i]['bean'] + ' ' + 'treegrid-parent-' + parentBean + ' ' + 'depth-level-' + levelCounter + ' element' + ' fx-expand' :
                    'treegrid-' + model[i]['bean'] + ' ' + parentBean + ' ' + 'depth-level-' + levelCounter + ' element' + ' fx-expand';

                    result.push({
                        'title': model[i]['title'],
                        'desc': model[i]['description'],
                        'bean': model[i]['bean'],
                        'value': model[i]['value'],
                        'parentBean': parentBean,
                        'className': className
                    })
                }
            }
            return result;
        };

        TreegridAdapter.prototype._visualizeData = function () {

            if (Object.keys(this.$whitelist).length > 0) {
                this.$dataForTreeGRid.data = this._filterWhiteList();
            }

            var templateToAdd = Handlebars.compile(Template);
            var $compiled = templateToAdd(this.$dataForTreeGRid);

            this.$el.empty();
            this.$el.append($compiled);
            var r = this.$el.find(this.o.s.table_container).treegrid(this.$treegridSettings);

            if (r) {
                this._onListening();
                this._checkExpandNodesOptions();
            }

        };

        TreegridAdapter.prototype._onListening = function () {

            var self = this;

            $(self.o.s.description_class).on('click', function (e) {

                e.preventDefault();
                e.stopImmediatePropagation();
                if ($(self.o.s.popover_class)) {
                    $('.popover').popover('destroy');
                }
                $(this).popover(self.$popoverSettings);
                $(this).popover('show');
            });

            $(document).click(function (e) {
                e.stopImmediatePropagation();
                if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
                    $('.popover').popover('destroy');
                }
            });

            $(this.o.s.table_container + " tr").on("click", function (event) {
                $(this).treegrid('toggle');
            });

        };


        TreegridAdapter.prototype._filterWhiteList = function () {

            var result = [];
            for (var i = 0, length = this.$dataForTreeGRid.data.length; i < length; i++) {
                if (this.$whitelist[this.$dataForTreeGRid.data[i]['bean']] && this.$whitelist[this.$dataForTreeGRid.data[i]['bean']] == true) {
                    result.push(this.$dataForTreeGRid.data[i]);
                }
            }

            return result;
        };

        TreegridAdapter.prototype.destroy = function () {

            // TODO: not exists a destroy function for this library

            this._unbindListeners();
            this.$el .empty();
        };

        TreegridAdapter.prototype._checkExpandNodesOptions = function () {

            var opts = [C.EXPAND_RECURSIVE, C.EXPAND_SINGLE];
            for (var i = 0; i < opts.length; i++) {
                if (opts[i] && opts[i].length > 0) {
                    for (var j = 0; j < opts[i].length; j++) {
                        (i == 0) ? $('.treegrid-' + opts[i][j]).treegrid('expandRecursive') : $('.treegrid-' + opts[i][j]).treegrid('expand');
                    }
                }
            }
        };


        TreegridAdapter.prototype._unbindListeners = function () {
            $(this.o.s.description_class).off();
            $(this.o.s.table_container + " tr").off();

        };

        return TreegridAdapter;
    });