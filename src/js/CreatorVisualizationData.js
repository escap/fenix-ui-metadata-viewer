define(['jquery'], function($){

    'use strict'

    function CreatorVisualizationData(){}


    CreatorVisualizationData.prototype.init = function(title,model) {
        var data = this._trasformDataToVisualizationModel(model, 'noParent', 0);
       return  {'title_resource': title,'data':data};

    };


    CreatorVisualizationData.prototype._trasformDataToVisualizationModel = function(model, parentBean, levelCounter) {


        var result = [];
        for(var i= 0, length = model.length; i<length; i++) {

            if(model[i].hasChildren && model[i].hasChildren === true ) {

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

                result = result.concat(this._trasformDataToVisualizationModel(model[i]['value'], model[i]['bean'],levelCounter+1))
            }

            else if(model[i].hasChildren === false) {
                var className = (parentBean!= 'noParent') ?
                'treegrid-'+model[i]['bean']+' '+'treegrid-parent-'+parentBean+ ' '+'depth-level-'+levelCounter:
                'treegrid-'+model[i]['bean']+' '+parentBean+ ' '+'depth-level-'+levelCounter + ' treegrid-collapsed';

                result.push({
                    'title' : model[i]['title'],
                    'desc' : model[i]['description'],
                    'bean' : model[i]['bean'],
                    'value' : model[i]['value'],
                    'parentBean' : parentBean,
                    'className' : className
                })
            }
        }
        return result;
    };

    return CreatorVisualizationData;
})