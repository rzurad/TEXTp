import Ember from "ember";
/* globals DataTransferItemList */

var ApplicationController;

ApplicationController = Ember.Controller.extend({
    needs: ['images'],
    noImagesFound: false,

    isProcessing: false,

    observesIsProcessing: function () {
        this.set('isProcessing', this.get('controllers.images.isProcessing'));
    }.observes('controllers.images.isProcessing'),

    _unsetNoImagesFound: function () {
        this.set('noImagesFound', false);
    },

    notifyNoImagesFound: function () {
        this.set('noImagesFound', true);

        Ember.run.debounce(this, this._unsetNoImagesFound, 3000);
    },

    actions: {
        select: function (files) {
            var images = [];

            Ember.ArrayPolyfills.forEach.call(files, function (file) {
                if (file.type.split('/')[0] === 'image') {
                    images.push(file);
                }
            });

            if (images.length) {
                this.get('controllers.images').set('content', images);
                this.transitionToRoute('images');
            } else {
                this.notifyNoImagesFound();
            }
        },

        dragEnter: function () {
            this.set('noImagesFound', false);
        },

        drop: function (files) {
            var instance = this,
                images = [],
                count = files.length,
                processed = 0,

                tryComplete = function () {
                    processed++;

                    if (count === processed) {
                        if (images.length) {
                            instance.get('controllers.images').set('content', images);
                            instance.transitionToRoute('images');
                        } else {
                            instance.notifyNoImagesFound();
                        }
                    }
                };

            // if the images controller is currently processing, don't do anything
            if (instance.get('controllers.images.isProcessing')) {
                return;
            }

            if (typeof DataTransferItemList !== 'undefined' && files instanceof DataTransferItemList) {
                // if we're given a DataTransferItem list, we're in an environment that supports
                // HTML5 Drag & Drop and the File System API and we can iterate through directories

                // DataTransferItemList object has no `forEach` method :(
                Ember.ArrayPolyfills.forEach.call(files, function readEntries(file) {
                    var entry = file;

                    if (file.getAsEntry) {
                        entry = file.getAsEntry();
                    } else if (file.webkitGetAsEntry) {
                        entry = file.webkitGetAsEntry();
                    }

                    if (entry.isFile) {
                        entry.file(function (file) {
                            if (file.type.split('/')[0] === 'image') {
                                images.push(file);
                            }

                            tryComplete();
                        });
                    } else if (entry.isDirectory) {
                        entry.createReader().readEntries(function (entries) {
                            count += entries.length;
                            entries.forEach(readEntries);

                            tryComplete();
                        });
                    }
                });
            } else {
                // No directories for us, just a straight FileList

                // neither does the FileList object :(
                Ember.ArrayPolyfills.forEach.call(files, function (file) {
                    if (file.type.split('/')[0] === 'image') {
                        images.push(file);
                    }

                    tryComplete();
                });
            }
        }
    }
});

export default ApplicationController;
