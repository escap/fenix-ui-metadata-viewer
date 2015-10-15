define(['jquery','text!template/template.hbs','handlebars', 'treegrid', 'bootstrap'],
    function ($,Template, Handlebars) {

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
        visualizationInfo:{
            container: '.container'
        },
        s: {
            'table_container' : '.fx-md-viewer-container',
            'description_class': '.fx-md-viewer-description',
            'popover_class': '.popover'
        },
        popoverSettings :{
            placement: 'top',
                html: true,
                trigger: 'focus',
                animation: true,
                title: '<span class="text-info"><strong>Description</strong></span>'+
            '<button type="button" data-toggle="popover" data-trigger="focus" class="close" >&times;</button>'

        }
    };


    function TreegridAdapter(options) {
        this.o = $.extend(true, o, options);
    };


    TreegridAdapter.prototype.init = function (dataModel) {
        this.$visualizationData =  this._trasformDataToVisualizationModel(dataModel.model, 'noParent', 0);
        this.$dataForTreeGRid =  {'title_resource': dataModel.title, 'data':  this.$visualizationData};
    };


    TreegridAdapter.prototype._trasformDataToVisualizationModel = function (model, parentBean, levelCounter) {


        var result = [];
        for (var i = 0, length = model.length; i < length; i++) {

            if (model[i].hasChildren && model[i].hasChildren === true) {


                var className = (parentBean!= 'noParent') ?
                'treegrid-'+model[i]['bean']+' '+'treegrid-parent-'+parentBean + ' '+'depth-level-'+levelCounter:
                'treegrid-'+model[i]['bean']+' '+parentBean+ ' '+'depth-level-'+levelCounter + ' treegrid-collapsed';

                result.push({
                    'title' : model[i]['title'],
                    'desc' : model[i]['description'],
                    'bean' : model[i]['bean'],
                    'parentBean' : parentBean,
                    'className' : className
                })

                result = result.concat(this._trasformDataToVisualizationModel(model[i]['value'], model[i]['bean'], levelCounter + 1))
            }

            else if (model[i].hasChildren === false) {
                var className = (parentBean != 'noParent') ?
                'treegrid-' + model[i]['bean'] + ' ' + 'treegrid-parent-' + parentBean + ' ' + 'depth-level-' + levelCounter :
                'treegrid-' + model[i]['bean'] + ' ' + parentBean + ' ' + 'depth-level-' + levelCounter;

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


    TreegridAdapter.prototype._visualizeData = function() {

        var templateToAdd = Handlebars.compile(Template);
        var $compiled = templateToAdd(this.$dataForTreeGRid);

        $(this.o.visualizationInfo.container).append($compiled);

        var r = $(this.o.s.table_container).treegrid({initialState: 'collapsed'});

        if(r) {this._onListening() }
    };


    TreegridAdapter.prototype._onListening = function () {

        var self = this;

        $(self.o.s.description_class).on('click', function(e) {

            e.preventDefault();
            e.stopImmediatePropagation();
            if($(self.o.s.popover_class)){$('.popover').popover('destroy');}
            $(this).popover(self.o.popoverSettings);
            $(this).popover('show');
        });

        $(document).click(function (e) {
            e.stopImmediatePropagation();
            if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
                $('.popover').popover('destroy');
            }
        });

    };


    return TreegridAdapter;
});