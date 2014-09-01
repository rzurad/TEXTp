define(['ember'], function () {
    "use strict";

    var set = Ember.set,

        fontmapContext = Ember.$('#fontmap').get(0).getContext('2d'),
        size = 8, // how many pixels is our monospace font
        charcount = 256, // how many different characters are there in the font map
        fontmapSize = size * Math.floor(Math.sqrt(charcount)),
        fontmap = fontmapContext.drawImage(Ember.$('#fontmap-image').get(0), 0, 0)
            || fontmapContext.getImageData(0, 0, 128, 128);

    // convert a float between 0 and 1 into a byte between 0 and 255
    function toByte(x) {
        x = Math.max(0, Math.min(1, x));

        return Math.floor(x === 1 ? 255 : x * 256);
    }

    // convert a byte between 255 and 0 into a float between 0 and 1
    function toFloat(x) {
        return x / 255;
    }

    // get a pixel from the image at (x, y) coordinates.
    // returned object has the color information in bytes and floats, and the
    // index each color is located in the image data array
    function getPixel(imageData, x, y) {
        var index = (y * 4) * imageData.width + (x * 4),
            data = imageData.data;

        return {
            index: {
                r: index,
                g: index + 1,
                b: index + 2,
                a: index + 3
            },

            'byte': {
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                a: data[index + 3]
            },

            'float': {
                r: toFloat(data[index]),
                g: toFloat(data[index + 1]),
                b: toFloat(data[index + 2]),
                a: toFloat(data[index + 3])
            }
        };
    }

    function asciify(context, onProgress, onComplete) {
        var height = +Ember.$(context.canvas).attr('height'),
            width = +Ember.$(context.canvas).attr('width'),
            original = context.getImageData(0, 0, width, height),
            ascii = context.createImageData(width, height),
            x, y;

        onProgress = onProgress || Ember.K;
        onComplete = onComplete || Ember.K;

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                var current = getPixel(original, x, y),
                    offset = {
                        x: x % size,
                        y: y % size
                    },
                    mosaic = getPixel(original, x - offset.x, y - offset.y),
                    luma = 0.2126 * mosaic['float'].r + 0.7152 * mosaic['float'].g + 0.0722 * mosaic['float'].b,
                    range = (1 / (charcount - 1.0)),
                    fontOffset = size * Math.floor(luma / range),
                    yRow = Math.floor(fontOffset / fontmapSize),
                    offsetdeux = {
                        x: offset.x + (fontOffset - (fontmapSize * yRow)),
                        y: offset.y + (size * yRow)
                    },
                    character = getPixel(fontmap, offsetdeux.x, offsetdeux.y);

                ascii.data[current.index.r] = toByte(character['float'].r * mosaic['float'].r);
                ascii.data[current.index.g] = toByte(character['float'].g * mosaic['float'].g);
                ascii.data[current.index.b] = toByte(character['float'].b * mosaic['float'].b);
                ascii.data[current.index.a] = character['byte'].a;
            }
        }

        context.putImageData(ascii, 0, 0);
    }



    return Ember.ArrayController.extend({
        // current index the view is looking at
        index: 0,

        // show TEXTp image
        TEXTp: true,

        // "human readable" current viewing index
        current: function () {
            console.log(this.get('index'));
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
                        return previous + current.height + current.width;
                    }, 0),
                    processed = 0,
                    count = content.get('length');

                (function chunk(index) {
                    var file = content[index];

                    asciify(file.context);

                    processed++;
                    instance.set('percentProcessed', processed / count * 100);

                    set(file, 'TEXTp', file.context.canvas.toDataURL('image/png'));
                    set(file, 'isProcessed', true);

                    if (processed === count) {
                        instance.set('isProcessing', false);
                        instance.set('percentProcessed', 0);
                    } else {
                        Ember.run.next(chunk, index + 1);
                    }
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
});
