import Ember from "ember";

var ApplicationController;

ApplicationController = Ember.Controller.extend({
    needs: ['images'],
    noImagesFound: false,

    isProcessing: false,

    observesIsProcessing: function () {
        this.set('isProcessing', this.get('controllers.images.isProcessing'));
    }.observes('controllers.images.isProcessing'),

    _hideNoImagesFound: function () {
        this.set('noImagesFound', false);
    },

    notifyNoImagesFound: function () {
        this.set('noImagesFound', true);
        Ember.run.debounce(this, this._hideNoImagesFound, 3000);
    },

    actions: {
        noImagesFound: function () {
            this.notifyNoImagesFound();
        },

        select: function (files) {
            var images = [],
                imagesController = this.get('controllers.images');

            Ember.ArrayPolyfills.forEach.call(files, function (file) {
                if (file.type.split('/')[0] === 'image') {
                    images.push(file);
                }
            });

            if (images.length) {
                imagesController.set('content', images);
                imagesController.loadFiles();

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
                imagesController = instance.get('controllers.images'),
                count = files.length,
                processed = 0,

                tryComplete = function () {
                    processed++;

                    if (count === processed) {
                        if (images.length) {
                            imagesController.set('content', images);
                            imagesController.loadFiles();

                            instance.transitionToRoute('images');
                        } else {
                            instance.notifyNoImagesFound();
                        }
                    }
                };

            // if the images controller is currently processing, don't do anything
            if (instance.get('isProcessing')) {
                return;
            }

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
        }
    }
});

export default ApplicationController;
