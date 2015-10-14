define(['jquery','text!template/template.hbs','handlebars', 'treegrid', 'bootstrap'],
    function ($,Template, Handlebars) {


    'use strict'


    var o = {
        'identifiers': {
            noParentId: 'noParent',
            depth_level: 'depth-level',
            parent_class: 'treegrid-parent',
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
            'table_container' : '.fx-md-viewer-container'
        }
    };


    function TreegridAdapter(options) {
        this.o = $.extend(true, o, options);
    };


    TreegridAdapter.prototype.init = function (dataModel) {
        debugger;
        this.$visualizationData =  this._trasformDataToVisualizationModel(dataModel.model, 'noParent', 0);
        return {'title_resource': dataModel.title, 'data':  this.$visualizationData};

    };


    TreegridAdapter.prototype._trasformDataToVisualizationModel = function (model, parentBean, levelCounter) {


        var result = [];
        for (var i = 0, length = model.length; i < length; i++) {

            if (model[i].hasChildren && model[i].hasChildren === true) {

                var className = (parentBean != this.o.identifiers.noParentId) ?
                this.o.identifiers.treegrid_class + model[i][this.o.identifiers.bean.bean_name] + ' ' + this.o.identifiers.parent_class + parentBean + ' '
                + this.o.identifiers.depth_level + levelCounter :
                this.o.identifiers.treegrid_class + model[i][this.o.identifiers.bean.bean_name] + ' ' + parentBean + ' ' + this.o.identifiers.depth_level + levelCounter;

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
        var $compiled = templateToAdd(this.$visualizationData);

        $(this.o.visualizationInfo.container).append($compiled);

        $(this.o.s.table_container).treegrid();
    };


    return TreegridAdapter;
})