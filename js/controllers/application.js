define(['ember'], function () {
    "use strict";

    return Ember.Controller.extend({
        needs: ['images'],
        noImagesFound: false,

        notifyNoImagesFound: function () {
            this.set('noImagesFound', true);

            Ember.run.later(this, function () {
                this.set('noImagesFound', false);
            }, 3000);
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
});
