(function (exports) {
    "use strict";
    
    exports.config = {
        shim: {
            handlebars: {
                exports: 'Handlebars'
            },

            ember: {
                deps: ['jquery', 'handlebars'],
                exports: 'Ember'
            }
        },

        paths: {
            asciify: '../',
            jquery: './dependencies/jquery',
            handlebars: './dependencies/handlebars',
            ember: './dependencies/ember',
            ehbs: './dependencies/require-ehbs',
            text: './dependencies/require-text'
        },

        ehbs: {
            paths: {
                templates: 'asciify/hbs'
            }
        },

        map: {
            '*': {
                css: './dependencies/require-css'
            }
        }
    };
}(typeof exports === 'undefined' ? this : exports));
