module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        less: {
            asciify: {
                options: {
                    paths: ['./less']
                },
                files: {
                    './css/app.css': './less/app.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
};
