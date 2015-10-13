define(['jquery',
        'text!../../config/special_metadata_fenix.json',
        'text!../../tests/schema.json',
        'fx-md-v-visualization-creator',
        'text!../../tests/GN.json', 'text!template/template.hbs', 'handlebars', 'treegrid', 'bootstrap', 'moment'],
    function ($, SpecialFields,SCHEMA,VisualizationCreator, DATA, Template, Handlebars) {

        'use strict';


        var s = {
            viewerOptions: {
                isFenixMetadata : true
            },
            defaultOptions: {
                LANG: 'fr',
                DEFAULT_LANG: 'en',
                TITLE_ATTRIBUTE: 'title',
                DESCRIPTION_ATTRIBUTE: 'description',
                NOVALUE_OBJECT: {
                    'noValue': true
                }
            },
            metadataOptions: {
                PROPERTIES_ATTR: 'properties',
                TYPE_ATTRIBUTE: 'type',
                SORTABLE_ATTRIBUTE: 'propertyOrder',
                STRING_TYPE: 'string',
                NUMBER_TYPE: 'number',
                BOOLEAN_TYPE: 'boolean',
                OBJECT_TYPE: 'object',
                ARRAY_TYPE: 'array',
                REF_TYPE: '$ref',
                PATTERN_PROPERTIES: "patternProperties",
                SYMBOL_PATTERN_PROPERTIES: ".{1,}",
                TITLE_I18N: 'title_i18n',
                TITLE_DEFAULT: 'title',
                DESC_I18N: 'description_i18n',
                DESC_DEFAULT: 'description',
                ITEMS_PROPERTIES: 'items',
                SUBSTR_ROOT_DEFINITIONS: 14,
                CODES: 'codes',
                HAS_CHILDREN : 'hasChildren',
                BEAN : 'bean',
                DATE_FORMAT: 'format'

            },

            popoverSettings :{
                placement: 'top',
                html: true,
                trigger: 'focus',
                animation: true,
                title: '<span class="text-info"><strong>Description</strong></span>'+
                '<button type="button" data-toggle="popover" data-trigger="focus" class="close" >&times;</button>'

            }

        }

        function Starter(options) {

            this.o = $.extend(true, s, options);

        };


        Starter.prototype.init = function (plugin) {

            this._initVariables();

            if (this._checkValidityOfData()) {

                var data = JSON.parse(DATA);
                var schema = JSON.parse(SCHEMA);
                this.$definitions = schema.definitions;
                this.$properties = schema.properties;
                this.$title = this._getTitleFromData(data, schema.properties)
                this.$internDataModel = this._prepareInternModelData(data, schema.properties);
                this.$creatorVisualizationData = new VisualizationCreator;
                this.$visualizationData = this.$creatorVisualizationData.init(this.$title,this.$internDataModel);

                console.log(this.$visualizationData);

                this._compileTemplate();

                var templateToAdd = Handlebars.compile(Template);
                var $compiled = templateToAdd(data);

            } else {
                this.$internModel = s.defaultOptions.NOVALUE_OBJECT;
            }

            this._onclickDescription();



        };

        Starter.prototype._initVariables = function () {
            this.$lang = 'en';
            this.$specialFields = JSON.parse(SpecialFields);
        };

        Starter.prototype._checkValidityOfData = function () {
            return true;
        };

        Starter.prototype._getTitleFromData = function (data, metadata) {
            var result = (data[s.defaultOptions.TITLE_ATTRIBUTE][this.$lang.toUpperCase()]) ? data[s.defaultOptions.TITLE_ATTRIBUTE][this.$lang.toUpperCase()] : data[s.defaultOptions.TITLE_ATTRIBUTE][s.defaultOptions.DEFAULT_LANG.toUpperCase()];
            delete data[s.defaultOptions.TITLE_ATTRIBUTE];
            delete metadata[s.defaultOptions.TITLE_ATTRIBUTE]
            return result;
        };


        Starter.prototype._prepareInternModelData = function (data, metadata) {


            var result = [];

            var metadataSorted = this._sortMetadataByPropertyOrder(metadata);


            for(var i= 0,length = metadataSorted.length; i<length; i++) {

                var attribute = metadataSorted[i][0];

                if (s.viewerOptions.isFenixMetadata && this._isASpecialAttribute(attribute)
                    && data[attribute] && data[attribute] != '' && data[attribute]['codes'] && data[attribute]['codes'].length >0) {

                    result.push( this._handleFenixCodes(data, metadata, attribute));

                }else {

                    if (data[attribute] && data[attribute] != '') {
                        if (this._isCaseBase(metadata[attribute])) {
                            result.push(this._addBaseModel(metadata[attribute], data[attribute], attribute));
                        }

                        else if (this._isObjectAttribute(metadata[attribute])) {
                            // 1: exists properties attribute
                            // 2: exists pattern properties
                            // 3: exists a reference
                            if (this._existsPropertiesAttribute(metadata[attribute])) {
                                var temporaryObject = {};
                                temporaryObject = this._addRecursiveModel(metadata[attribute], attribute);
                                temporaryObject['value']= this._prepareInternModelData(data[attribute], metadata[attribute][s.metadataOptions.PROPERTIES_ATTR])
                                result.push(temporaryObject);

                            }

                            else if (this._existsPatternProperties(metadata[attribute]) && this._existsPatternPropertiesValue(data[attribute])) {
                                var temporaryObject = {};
                                temporaryObject= this._addPatternModel(metadata[attribute], data[attribute], attribute);
                                result.push(temporaryObject);
                            }

                            else if (this._existsAReference(metadata[attribute])) {
                                var temporaryObject = {};

                                temporaryObject= this._addRecursiveModel(metadata[attribute], attribute);
                                var refAttribute = this._getAttributeFromReference(metadata[attribute]);
                                temporaryObject['value']= this._prepareInternModelData(data[attribute], this.$definitions[refAttribute][s.metadataOptions.PROPERTIES_ATTR]);
                                result.push(temporaryObject);

                            }

                        }
                        else if (this._isAnArrayAttribute(metadata[attribute])) {
                            var temporaryObject = {};
                            temporaryObject = this._addArrayModel(metadata[attribute], attribute);

                            if (this._isASimpleArrayItem(metadata[attribute])) {
                                this._fillNoChildrenAttribute(temporaryObject);
                                temporaryObject['value'] = data[attribute];
                                result.push(temporaryObject);
                            }
                            else if (this._isARefArrayItem(metadata[attribute])) {
                                this._fillChildrenAttribute(temporaryObject);
                                temporaryObject['value'] = [];
                                var refAttribute = this._getAttributeFromReference(metadata[attribute][s.metadataOptions.ITEMS_PROPERTIES]);
                                for (var j = 0, lengthArray = data[attribute].length; j < lengthArray; j++) {
                                    temporaryObject['value'] =  temporaryObject['value'].concat(this._prepareInternModelData(data[attribute][j], this.$definitions[refAttribute][s.metadataOptions.PROPERTIES_ATTR]));
                                }
                                result.push(temporaryObject);
                            }

                        }
                    }
                }
            }
            return result;

        };


        Starter.prototype._sortMetadataByPropertyOrder = function(metadata) {

            var sortedElements = [];

            for(var attribute in metadata) {
                sortedElements.push([attribute, metadata[attribute][s.metadataOptions.SORTABLE_ATTRIBUTE]])
            }
            sortedElements.sort(function(a, b) {return a[1] - b[1]});
            return sortedElements;

        };


        Starter.prototype._existsPatternPropertiesValue = function (objectWithPattern) {
            if (objectWithPattern[(this.$lang).toUpperCase()] && objectWithPattern[(this.$lang).toUpperCase()] !== '') {
                return true
            } else if (objectWithPattern[(s.defaultOptions.DEFAULT_LANG).toUpperCase()] && objectWithPattern[(s.defaultOptions.DEFAULT_LANG).toUpperCase()] !== '') {
                return true
            } else {
                return false;
            }

        };


        Starter.prototype._existsPropertiesAttribute = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.PROPERTIES_ATTR) && Object.keys(objectMetadata[s.metadataOptions.PROPERTIES_ATTR]).length > 0
        };


        Starter.prototype._existsPatternProperties = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.PATTERN_PROPERTIES) && Object.keys(objectMetadata[s.metadataOptions.PATTERN_PROPERTIES]).length > 0
        };


        Starter.prototype._existsAReference = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.REF_TYPE) && Object.keys(objectMetadata[s.metadataOptions.REF_TYPE]).length > 0
        };


        Starter.prototype._isObjectAttribute = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.TYPE_ATTRIBUTE) && objectMetadata[s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.OBJECT_TYPE;
        };

        Starter.prototype._isAnArrayAttribute = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.TYPE_ATTRIBUTE) && objectMetadata[s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.ARRAY_TYPE;
        };

        Starter.prototype._addRecursiveModel = function (metadata, attribute) {
            var result = {};
            this._fillTitle(metadata, attribute, result);
            this._fillDescription(metadata, attribute, result);
            this._fillAttributeBean(attribute, result);
            this._fillChildrenAttribute(result)
            return result;
        };


        Starter.prototype._addArrayModel = function (metadata, attribute) {
            var result = {};
            this._fillTitle(metadata, attribute, result);
            this._fillDescription(metadata, attribute, result);
            this._fillAttributeBean(attribute, result);
            return result;
        };


        Starter.prototype._addBaseModel = function (metadata, data, attribute) {
            var result = {};
            this._fillTitle(metadata, attribute, result);
            this._fillDescription(metadata, attribute, result);
            this._fillAttributeBean(attribute,result);
            this._fillNoChildrenAttribute(result);
            var value = (metadata[s.metadataOptions.DATE_FORMAT] && metadata[s.metadataOptions.DATE_FORMAT] == 'date')?
                moment(new Date(data)).format("DD/MM/YYYY") : data;
            result['value'] = value;
            return result;
        };

        Starter.prototype._addPatternModel = function (metadata, data, attribute) {
            var result = {};
            this._fillTitle(metadata, attribute, result);
            this._fillDescription(metadata, attribute, result);
            this._fillAttributeBean(attribute,result);
            this._fillNoChildrenAttribute(result);
            result['value'] = (data[this.$lang.toUpperCase()]) ? data[this.$lang.toUpperCase()] : (data[s.defaultOptions.DEFAULT_LANG.toUpperCase()]);
            return result;
        };

        Starter.prototype._fillTitle = function (metadata, attribute, result) {

            if (metadata[s.metadataOptions.TITLE_I18N] && metadata[s.metadataOptions.TITLE_I18N][this.$lang] && metadata[s.metadataOptions.TITLE_I18N][this.$lang] != '') {
                result[s.defaultOptions.TITLE_ATTRIBUTE] = metadata[s.metadataOptions.TITLE_I18N][this.$lang];
            } else if (metadata[s.metadataOptions.TITLE_DEFAULT]) {
                result[s.defaultOptions.TITLE_ATTRIBUTE] = metadata[s.metadataOptions.TITLE_DEFAULT]
            } else {
                result[s.defaultOptions.TITLE_ATTRIBUTE] = attribute;
            }
        };

        Starter.prototype._fillDescription = function (metadata, attribute, result) {

            if (metadata[s.metadataOptions.DESC_I18N] && metadata[s.metadataOptions.DESC_I18N][this.$lang] && metadata[s.metadataOptions.DESC_I18N][this.$lang] != '') {
                result[s.defaultOptions.DESCRIPTION_ATTRIBUTE] = metadata[s.metadataOptions.DESC_I18N][this.$lang];
            } else if (metadata[s.metadataOptions.DESC_DEFAULT]) {
                result[s.defaultOptions.DESCRIPTION_ATTRIBUTE] = metadata[s.metadataOptions.DESC_DEFAULT]
            } else {
                result[s.defaultOptions.DESCRIPTION_ATTRIBUTE] = '';
            }
        };

        Starter.prototype._getAttributeFromReference = function (objectMetadata) {
            return objectMetadata[s.metadataOptions.REF_TYPE].substr(s.metadataOptions.SUBSTR_ROOT_DEFINITIONS)
        };


        Starter.prototype._isCaseBase = function (objectMetadata) {

            return objectMetadata.hasOwnProperty('type') && (
                objectMetadata[s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.STRING_TYPE ||
                objectMetadata[s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.NUMBER_TYPE ||
                objectMetadata[s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.BOOLEAN_TYPE)
        };


        Starter.prototype._isASimpleArrayItem = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.ITEMS_PROPERTIES) && (
                objectMetadata[s.metadataOptions.ITEMS_PROPERTIES][s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.STRING_TYPE ||
                objectMetadata[s.metadataOptions.ITEMS_PROPERTIES][s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.NUMBER_TYPE ||
                objectMetadata[s.metadataOptions.ITEMS_PROPERTIES][s.metadataOptions.TYPE_ATTRIBUTE] === s.metadataOptions.BOOLEAN_TYPE)
        };


        Starter.prototype._isARefArrayItem = function (objectMetadata) {
            return objectMetadata.hasOwnProperty(s.metadataOptions.ITEMS_PROPERTIES) &&
                objectMetadata[s.metadataOptions.ITEMS_PROPERTIES][s.metadataOptions.REF_TYPE] &&
                Object.keys(objectMetadata[s.metadataOptions.ITEMS_PROPERTIES][s.metadataOptions.REF_TYPE]).length > 0
        };


        Starter.prototype._isASpecialAttribute =function(attribute) {
            return typeof this.$specialFields[attribute] !== 'undefined';
        };

        Starter.prototype._handleFenixCodes = function ( data,metadata, attribute) {
            var result = {};

            this._fillTitle(metadata[attribute], attribute, result);
            this._fillDescription(metadata[attribute], attribute, result);
            this._fillAttributeBean ( attribute, result);
            this._fillNoChildrenAttribute(result);
            var codes=  data[attribute]['codes'];

            result['value'] = [];
            for(var i= 0,length =codes.length; i<length; i++) {
                if(codes[i].label) {
                    var labelValue = (typeof codes[i].label[this.$lang]!== 'undefined') ? codes[i].label[this.$lang] : codes[i].label[s.defaultOptions.DEFAULT_LANG.toUpperCase()];
                    result['value'].push(labelValue);
                }else{
                    result['value'].push('');
                }
            }
            return result;
        };


        Starter.prototype._fillAttributeBean = function( attributeObject, result) {
            result[s.metadataOptions.BEAN] = attributeObject;
        };


        Starter.prototype._fillChildrenAttribute = function(result){
            result[s.metadataOptions.HAS_CHILDREN] = true;
        };


        Starter.prototype._fillNoChildrenAttribute = function( result) {
            result[s.metadataOptions.HAS_CHILDREN] = false;
        };


        Starter.prototype._compileTemplate =function() {
            var templateToAdd = Handlebars.compile(Template);
            var $compiled = templateToAdd(this.$visualizationData);

            $('.container').append($compiled);

            $('.fx-md-viewer-container').treegrid({initialState: 'collapsed'});
        };

        Starter.prototype._onclickDescription = function() {


            $('.fx-md-viewer-description').on('click', function(e) {

                e.preventDefault();
                e.stopImmediatePropagation();

                if($('.popover')){
                    $('.popover').popover('destroy');
                }
                console.log($(e.target))
                $(this).popover(s.popoverSettings);
                $(this).popover('show');
            })

            $(document).click(function (e) {
                e.stopImmediatePropagation();
                if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
                    $('.popover').popover('destroy');
                }});
        };

        return Starter;
    })