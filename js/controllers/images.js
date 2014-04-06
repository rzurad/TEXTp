define(['ember'], function () {
    "use strict";

    var set = Ember.set,

        fontmapContext = Ember.$('#fontmap').get(0).getContext('2d'),
        size = 8,
        charcount = 256,
        fontmapSize = size * Math.floor(Math.sqrt(charcount)),
        fontmap = fontmapContext.drawImage(Ember.$('#fontmap-image').get(0), 0, 0)
            || fontmapContext.getImageData(0, 0, 128, 128);

    function toByte(x) {
        x = Math.max(0, Math.min(1, x));

        return Math.floor(x === 1 ? 255 : x * 256);
    }

    function toFloat(x) {
        return x / 255;
    }

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

    function asciify(context, callback) {
        var height = +Ember.$(context.canvas).attr('height'),
            width = +Ember.$(context.canvas).attr('width'),
            original = context.getImageData(0, 0, width, height),
            ascii = context.createImageData(width, height),
            x, y;

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
        index: 0,
        TEXTp: true,

        current: function () {
            return this.get('index') + 1;
        }.property('index'),

        total: function () {
            return this.get('content.length');
        }.property('content.length'),

        isPaginated: function () {
            return this.get('content.length') > 1;
        }.property('content.length'),

        isPreviousDisabled: function () {
            return this.get('index') === 0;
        }.property('index'),

        isNextDisabled: function () {
            return this.get('index') === this.get('content.length') - 1;
        }.property('index'),

        onContentChange: function () {
            var instance = this;

            this.get('content').forEach(function (file) {
                var $canvas,
                    context,
                    image = new Image(),
                    reader = new FileReader();

                reader.onloadend = function (e) {
                    Ember.$(image).load(function () {
                        $canvas = Ember.$([
                            '<canvas height="', this.height, '" width="', this.width, '"></canvas>'
                        ].join(''));

                        context = $canvas.get(0).getContext('2d');
                        context.drawImage(this, 0, 0);
                        asciify(context);

                        set(file, 'height', this.height);
                        set(file, 'width', this.width);
                        set(file, 'original', image.src);
                        set(file, 'TEXTp', $canvas.get(0).toDataURL('image/png'));
                        set(file, 'isProcessed', true);
                    }).attr('src', e.target.result);
                };

                reader.readAsDataURL(file);
            });
        }.observes('content'),

        actions: {
            toggleTEXTp: function () {
                this.toggleProperty('TEXTp');
            },

            previous: function () {
                if (!this.get('isPreviousDisabled')) {
                    this.set('index', this.get('index') - 1);
                }
            },

            next: function () {
                if (!this.get('isNextDisabled')) {
                    this.set('index', this.get('index') + 1);
                }
            }
        }
    });
});
