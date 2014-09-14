//TODO: Build logic for displaying progress bar, make asciify chunk process
import Ember from "ember";
import asciify from "../asciify";

var set = Ember.set,
    ImagesController;

ImagesController = Ember.ArrayController.extend({
    // current index the view is looking at
    index: 0,

    // show TEXTp image
    TEXTp: true,

    // "human readable" current viewing index
    current: function () {
        return this.get('index') + 1;
    }.property('index'),

    // the total number of images processed
    total: function () {
        return this.get('content.length');
    }.property('content.length'),

    // is there more than one image?
    isPaginated: function () {
        return this.get('content.length') > 1;
    }.property('content.length'),

    // is the current viewing index the first image?
    isPreviousDisabled: function () {
        return this.get('index') === 0;
    }.property('index'),

    // is the current viewing index the last image?
    isNextDisabled: function () {
        return this.get('index') === this.get('content.length') - 1;
    }.property('index'),

    onProcessUpdate: function () {
        this.set('progressFillStyle', 'width: ' + this.get('percentProcessed') + '%;');
    }.observes('percentProcessed'),

    progressFillStyle: '',
    percentProcessed: 0,
    isProcessing: false,
    isLoading: false,

    processImages: function () {
        if (!this.get('isLoading')) {
            var instance = this,
                content = this.get('content'),
                pixelCount = content.reduce(function (previous, current) {
                    return previous + current.height * current.width;
                }, 0),
                pixelsProcessed = 0,
                imagesProcessed = 0,
                imageCount = content.get('length');

            var start = performance.now();

            (function processImage(index) {
                var file = content[index];

                asciify(file.context, function (count) {
                    instance.set('percentProcessed', (pixelsProcessed + count) / pixelCount * 100);
                }, function (total) {
                    pixelsProcessed += total;
                    imagesProcessed++;

                    set(file, 'TEXTp', file.context.canvas.toDataURL('image/png'));
                    set(file, 'isProcessed', true);

                    if (imagesProcessed === imageCount) {
                        instance.set('isProcessing', false);
                        instance.set('percentProcessed', 0);
                        console.log(performance.now() - start);
                    } else {
                        Ember.run.later(processImage,  index + 1, 0);
                    }
                });
            }(0));
        }
    }.observes('isLoading'),

    loadImages: function () {
        var instance = this,
            count = instance.get('content.length'),
            loadCount = 0;

        this.set('isProcessing', true);
        this.set('isLoading', true);

        this.get('content').forEach(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                Ember.$(new Image()).load(function () {
                    var context,
                        $canvas = Ember.$([
                            '<canvas height="', this.height, '" width="', this.width, '"></canvas>'
                        ].join(''));

                    loadCount++;

                    context = $canvas.get(0).getContext('2d');
                    context.drawImage(this, 0, 0);

                    set(file, 'height', this.height);
                    set(file, 'width', this.width);
                    set(file, 'original', this.src);
                    set(file, 'context', context);

                    if (loadCount === count) {
                        instance.set('isLoading', false);
                    }
                }).attr('src', e.target.result);
            };

            reader.readAsDataURL(file);
        });
    }.observes('content'),

    actions: {
        // toggle between TEXTp and the original image
        toggleTEXTp: function () {
            this.toggleProperty('TEXTp');
        },

        // attempt to slide to previous image
        previous: function () {
            if (!this.get('isPreviousDisabled')) {
                this.set('index', this.get('index') - 1);
            }
        },

        // attempt to slide to the next image
        next: function () {
            if (!this.get('isNextDisabled')) {
                this.set('index', this.get('index') + 1);
            }
        }
    }
});

export default ImagesController;
