define(['jquery',
        'text!../../config/special_metadata_fenix.json',
        'text!../../tests/schema.json',
        'text!../../tests/GN.json', 'text!template/template.hbs', 'handlebars', 'treegrid', 'bootstrap'],
    function ($, SpecialFields,SCHEMA, DATA, Template, Handlebars) {

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
                BEAN : 'bean'

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
                console.log(this.$internDataModel);
            } else {
                this.$internModel = s.defaultOptions.NOVALUE_OBJECT;
            }

            this._testData();
            /*
             $('.tree').treegrid();
             */

        };

        Starter.prototype._initVariables = function () {
            this.$lang = 'fr';
            this.$specialFields = JSON.parse(SpecialFields);
        };

        Starter.prototype._checkValidityOfData = function () {
            return true;
        };

        Starter.prototype._getTitleFromData = function (data, metadata) {
            var result = (data[s.defaultOptions.TITLE_ATTRIBUTE][this.$lang]) ? data[s.defaultOptions.TITLE_ATTRIBUTE][this.$lang] : data[s.defaultOptions.TITLE_ATTRIBUTE][s.defaultOptions.DEFAULT_LANG];
            delete data[s.defaultOptions.TITLE_ATTRIBUTE];
            delete metadata[s.defaultOptions.TITLE_ATTRIBUTE]
            return result;
        };


        Starter.prototype._prepareInternModelData = function (data, metadata) {

            var result = [];
            //1 : sort
            //2 : identification fo case:
            //3: handle different cases
            /*
             this._sortPropertyOrder(metadata);
             */

           var metadataSorted = this._sortMetadataByPropertyOrder(metadata);

            debugger;
            for(var i= 0,length = metadataSorted.length; i<length; i++) {

                var attribute = metadataSorted[i][0];

                if (s.viewerOptions.isFenixMetadata && this._isASpecialAttribute(attribute)) {
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
                            /*    result[attribute] = this._addRecursiveModel(metadata[attribute], attribute);
                                result[attribute]['value'] = this._prepareInternModelData(data[attribute], metadata[attribute][s.metadataOptions.PROPERTIES_ATTR])
*/
                            }

                          /*  else if (this._existsPatternProperties(metadata[attribute]) && this._existsPatternPropertiesValue(data[attribute])) {
                                result[attribute] = this._addPatternModel(metadata[attribute], data[attribute], attribute);
                                result[attribute]['value'] = (data[attribute][(this.$lang).toUpperCase()]) ? data[attribute][(this.$lang).toUpperCase()] : data[attribute][(s.defaultOptions.DEFAULT_LANG).toUpperCase()];
                            }

                            else if (this._existsAReference(metadata[attribute])) {
                                result[attribute] = this._addRecursiveModel(metadata[attribute], attribute);
                                var refAttribute = this._getAttributeFromReference(metadata[attribute]);
                                result[attribute]['value'] = this._prepareInternModelData(data[attribute], this.$definitions[refAttribute][s.metadataOptions.PROPERTIES_ATTR]);

                            }*/

                        }/*
                        else if (this._isAnArrayAttribute(metadata[attribute])) {
                            result[attribute] = this._addRecursiveModel(metadata[attribute], attribute);

                            if (this._isASimpleArrayItem(metadata[attribute])) {
                                result[attribute]['value'] = data[attribute];
                            }
                            else if (this._isARefArrayItem(metadata[attribute])) {
                                result[attribute]['value'] = [];
                                var refAttribute = this._getAttributeFromReference(metadata[attribute][s.metadataOptions.ITEMS_PROPERTIES]);
                                for (var i = 0, length = data[attribute].length; i < length; i++) {
                                    result[attribute]['value'].push(this._prepareInternModelData(data[attribute][i], this.$definitions[refAttribute][s.metadataOptions.PROPERTIES_ATTR]));
                                }
                            }

                        }*/
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


        Starter.prototype._addBaseModel = function (metadata, data, attribute) {
            var result = {};
            this._fillTitle(metadata, attribute, result);
            this._fillDescription(metadata, attribute, result);
            this._fillAttributeBean(attribute,result);
            this._fillNoChildrenAttribute(result);
            result['value'] = data;
            return result;
        };

        Starter.prototype._addPatternModel = function (metadata, data, attribute) {
            var result = {};
            this._fillTitle(metadata, attribute, result);
            this._fillDescription(metadata, attribute, result);
            result['value'] = (data[this.$lang]) ? data[this.$lang] : (data[s.defaultOptions.DEFAULT_LANG]);
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

        /*  Starter.prototype._sortPropertyOrder = function (values) {
         debugger;


         for(var attributes in values) {

         }
         values.sort(function (a, b) {
         return a[s.SORTABLE_ATTRIBUTE] - b[s.SORTABLE_ATTRIBUTE]
         })
         };*/


        Starter.prototype._testData = function () {

            var audaciousFn;

            Handlebars.registerHelper('recursive', function (children, options) {
                var out = '';

                if (options.fn !== undefined) {
                    audaciousFn = options.fn;
                }

                if ($.isArray(children)) {
                    children.forEach(function (child) {
                        out = out + audaciousFn(child);
                    });
                } else {
                    out = audaciousFn(children)
                }

                return out;
            });


            var data = {
                values: [

                    {
                        title: 'title1',
                        desc: 'description1',
                        bean: 'bean1',
                        hasChildren: false,
                        values: 'value1'/*[{ data: {
                     title: 'title1.1',
                     desc: 'description1.1',
                     bean: 'bean1.1',
                     data: 'valore 1.1',
                     parentBean: 'bean1',
                     classTree: "treegrid-bean1.1 tree-level-1"
                     }}]*/,
                        parentBean: null,
                        classTree: 'treegrid-bean1 noParent'
                    },
                    {
                        title: 'title2',
                        desc: 'description2',
                        bean: 'bean2',
                        hasChildren: true,
                        values: [
                             {
                                title: 'titleChidl',
                                desc: 'descriptionChidl',
                                bean: 'bean2.1',
                                hasChildren: false,
                                values: 'value-chiild'/*[{ data: {
                                 title: 'title1.1',
                                 desc: 'description1.1',
                                 bean: 'bean1.1',
                                 data: 'valore 1.1',
                                 parentBean: 'bean1',
                                 classTree: "treegrid-bean1.1 tree-level-1"
                                 }}]*/,
                                parentBean: null,
                                classTree: 'treegrid-bean2.1 treegrid-parent-bean2'
                            }
                        ],

                        parentBean: null,
                        classTree: 'treegrid-bean2 noParent'
                    }
                ]
            }

            var templateToAdd = Handlebars.compile(Template);
            var $compiled = templateToAdd(data);
            debugger;

            $('.container').append($compiled);

          $('.tree').treegrid();
        };

        return Starter;
    })