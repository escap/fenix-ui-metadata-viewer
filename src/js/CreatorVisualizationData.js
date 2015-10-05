define(['jquery'], function($){

    'use strict'

    function CreatorVisualizationData(){}


    CreatorVisualizationData.prototype.init = function(model) {
        var data = this._trasformDataToVisualizationModel(model, 'noParent');
        console.log(data);
    };


    CreatorVisualizationData.prototype._trasformDataToVisualizationModel = function(model, parentBean) {


        var result = [];
        for(var i= 0, length = model.length; i<length; i++) {
            if(model[i].hasChildren && model[i].hasChildren === true) {
                result.push({
                    'title' : model[i]['title'],
                    'desc' : model[i]['description'],
                    'bean' : model[i]['bean'],
                    'parentBean' : parentBean
                })

                if(this._trasformDataToVisualizationModel(model[i]['value'], model[i]['bean']).length ===0){
                    debugger;
                };

                result = result.concat(this._trasformDataToVisualizationModel(model[i]['value'], model[i]['bean']))
            }

            else if(model[i].hasChildren === false) {
                result.push({
                    'title' : model[i]['title'],
                    'desc' : model[i]['description'],
                    'bean' : model[i]['bean'],
                    'value' : model[i]['value'],
                    'parentBean' : parentBean

                })
            }
        }
        return result;

    };

    return CreatorVisualizationData;
})