/* global define */
define(function () {

    "use strict";

    var host = "http://fenix.fao.org/";

    return {

        cache : false,
        lang : 'EN',

        SERVICE_BASE_ADDRESS: host,

        IS_METADATA_FENIX : true,

        SERVICE_MDSD_ADDRESS: host + "d3s/mdsd",

        POPOVER_SETTINGS :{
            placement: 'right',
            html: true,
            trigger: 'focus',
            animation: true,
            title: '<span class="text-info"><strong>Description</strong></span>'+
            '<button type="button" data-toggle="popover" data-trigger="focus" class="close" >&times;</button>'
        },

        TREEGRID_SEETINGS: {
            initialState :  'collapsed',
            indentTemplate :        '<span class="treegrid-indent fx-indent"></span>',
            expanderTemplate :      '<span class="treegrid-expander fx-expand"></span>',
            expanderExpandedClass : 'treegrid-expander-expanded',
            expanderCollapsedClass: 'treegrid-expander-collapsed'
        },

        WHITELIST: {
           /* 'uid': true,
            contacts: true,
            "pointOfContact": true,
            "organization": true,
            "organizationUnit": true,
            "position": true,
            "role": true*/
        },
        HAS_EXPORT : false
    };
});
