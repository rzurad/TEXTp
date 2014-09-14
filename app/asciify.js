//TODO: See about making the fontmap either embedded in the source as base64 or
//load it via XHR to avoid needed to insert things into the DOM
import Ember from "ember";

var $fontmapContainer,
    $fontmapImage,
    size = 8,
    charcount = 256,
    fontmapSize = size * Math.floor(Math.sqrt(charcount)),
    fontmap;

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
        total = height * width,
        original = context.getImageData(0, 0, width, height),
        ascii = context.createImageData(width, height);

    onProgress = onProgress || Ember.K;
    onComplete = onComplete || Ember.K;

    (function convertLine(y) {
        Ember.run.later(function () {
            var x = 0;

            for (; x < width; x++) {
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

            y++;

            if (y < height) {
                if (y % 10 === 0) {
                    onProgress(y * width, total);
                }

                convertLine(y);
            } else {
                context.putImageData(ascii, 0, 0);
                onComplete(total);
            }
        }, 0);
    }(0));
}

$fontmapContainer = Ember.$([
    '<div style="display: none;">',
        '<canvas id="fontmap" height="128" width="128"></canvas>',
    '</div>'
].join(''));

$fontmapImage = Ember.$('<img id="#fontmap-image"/>');
$fontmapContainer.append($fontmapImage);

$fontmapImage.load(function (e) {
    var fontmapContext = Ember.$('#fontmap').get(0).getContext('2d');

    fontmapContext.drawImage(Ember.$(e.target).get(0), 0, 0);
    fontmap = fontmapContext.getImageData(0, 0, 128, 128);
});

Ember.$('body').append($fontmapContainer);
$fontmapImage.attr('src', TEXTpENV.fontmapURL);

export default asciify;