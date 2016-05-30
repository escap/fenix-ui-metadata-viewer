define(['jquery',
        'underscore',
        'loglevel',
        'fx-md-v/config/config',
        'fx-md-v/config/config-default',
        'text!fx-md-v/template/template.hbs',
        'handlebars', 'treegrid', 'bootstrap'],
    function ($, _, log, C, DC, Template, Handlebars) {

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
                'template_wrapper': '#fx-md-viewer-wrapper',
                'treegrid_expander_arrow': 'span.treegrid-expander'
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

            // create description popover
            $(self.o.s.description_class, self.$el).on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if ($(self.o.s.popover_class, self.$el)) {
                    $(self.o.s.popover_class, self.$el).popover('destroy');
                }

                $(this, self.$el).popover(self.$popoverSettings);
                $(this, self.$el).popover('show');
            });

            // destroy popovers when clicking in the context but out of the buttons
            $(self.$el).click(function (e) {
                e.stopImmediatePropagation();
                log.info('el - event')
                if (!event.target.hasAttribute('data-toggle')) {
                    self._destroyPopups(event, self);
                }
            });

            // on click on the row
            $(this.o.s.table_container + " tr > td", self.$el).on("click", function (event) {
                log.info(event.target)
                // if it is not an element of bootstrap
                if (!event.target.hasAttribute('data-toggle')) {
                    event.stopImmediatePropagation();
                    var parent = $(this, self.$el).parents("tr").first();
                    parent.treegrid('toggle');
                    log.info('tc - event')
                }
                self._destroyPopups(event, self);

            });

            // on click on the arrow
            $(self.o.s.treegrid_expander_arrow, self.$el).on('click', function (event) {
                event.stopImmediatePropagation();
                log.info('arrow - event')
                self._destroyPopups(event, self);
            });
        };


        TreegridAdapter.prototype._destroyPopups = function (e, context) {

            var that = context;
            if (($(that.o.s.popover_class, that.$el).has(e.target).length == 0) || $(e.target, that.$el).is('.close')) {
                $(that.o.s.popover_class, that.$el).popover('destroy');
            }
        }


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
            this.$el.empty();
        };

        TreegridAdapter.prototype._checkExpandNodesOptions = function () {

            var opts = [C.EXPAND_RECURSIVE, C.EXPAND_SINGLE];
            for (var i = 0; i < opts.length; i++) {
                if (opts[i] && opts[i].length > 0) {
                    for (var j = 0; j < opts[i].length; j++) {
                        (i == 0) ? $('.treegrid-' + opts[i][j], this.$el).treegrid('expandRecursive') : $('.treegrid-' + opts[i][j], this.$el).treegrid('expand');
                    }
                }
            }
        };


        TreegridAdapter.prototype._unbindListeners = function () {
            $(this.o.s.description_class, this.$el).off();
            $(this.o.s.table_container + " tr > td", this.$el).off();
            $(this.o.s.treegrid_expander_arrow, this.$el).off();
            $(this.$el).off();


        };

        return TreegridAdapter;
    });