import Ember from "ember";
import config from "../config/environment";
/* global Parallel, global */ // <--- yeah, it's odd, but it's to make jshint behave with
                              // the way Parallel.js and Web Workers work.

var size = 8,
    charcount = 256,
    fontmapSize = size * Math.floor(Math.sqrt(charcount)),
    fontmapURL = config.baseURL + 'assets/images/fontmap.png',
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

function getMosaicPixel(size, imageData, x, y) {
    var offset = {
            x: x % size,
            y: y % size
        };

    return getPixel(imageData, x - offset.x, y - offset.y);
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

function asciifyWorker(images) {
    var original = images.original,
        ascii = images.ascii,
        total = original.height * original.width,

        size = global.ascii.size,
        charcount = global.ascii.charcount,
        fontmapSize = global.ascii.fontmapSize,
        fontmap = global.ascii.fontmap,

        x, y;

    for (y = 0; y < original.height; y++) {
        for (x = 0; x < original.width; x++) {
            var current = getPixel(original, x, y),
                topleft = {
                    x: x % size,
                    y: y % size
                },
                mosaic = getMosaicPixel(size, original, x, y),
                luma = 0.2126 * mosaic['float'].r + 0.7152 * mosaic['float'].g + 0.0722 * mosaic['float'].b,
                range = (1 / (charcount - 1.0)),
                fontOffset = size * Math.floor(luma / range),
                yRow = Math.floor(fontOffset / fontmapSize),
                fontmapLocation = {
                    x: topleft.x + (fontOffset - (fontmapSize * yRow)),
                    y: topleft.y + (size * yRow)
                },
                character = getPixel(fontmap, fontmapLocation.x, fontmapLocation.y);

            ascii.data[current.index.r] = toByte(character['float'].r * mosaic['float'].r);
            ascii.data[current.index.g] = toByte(character['float'].g * mosaic['float'].g);
            ascii.data[current.index.b] = toByte(character['float'].b * mosaic['float'].b);
            ascii.data[current.index.a] = character['byte'].a;
        }

        global.send('progress', {
            processed: original.width,
            total: total
        });
    }

    global.send('complete', ascii);
}

function asciify(context, onProgress) {
    var height = +Ember.$(context.canvas).attr('height'),
        width = +Ember.$(context.canvas).attr('width'),
        original = context.getImageData(0, 0, width, height),
        ascii = context.createImageData(width, height);

    onProgress = onProgress || Ember.K;

    return (new Parallel({ original: original, ascii: ascii }, {
        onMessage: function (msg) {
            switch (msg.name) {
                case 'debug':
                    console.log(msg.data);
                    break;
                case 'progress':
                    onProgress(msg.data);
                    break;
                default:
                    Ember.assert('Unhandled event from web worker: ' + msg.name + ', ' + JSON.stringify(msg.data));
            }
        },
        env: {
            size: size,
            charcount: charcount,
            fontmap: fontmap,
            fontmapSize: fontmapSize
        },
        envNamespace: 'ascii'
    })).require(toByte, toFloat, getPixel, getMosaicPixel).spawn(asciifyWorker).then(function (ascii) {
        context.putImageData(ascii, 0, 0);
    });
}

Ember.$('<img id="#fontmap-image"/>').load(function (e) {
    var fontmapContext = Ember.$('<canvas id="fontmap" height="128" width="128"></canvas>').get(0).getContext('2d');

    fontmapContext.drawImage(Ember.$(e.target).get(0), 0, 0);
    fontmap = fontmapContext.getImageData(0, 0, 128, 128);

    // normalize the native ImageData object into an object whose keys are all not read-only.
    // It looks like this problem only exists when loading the fontmap, probably because the image
    // is not inserted into the DOM before getting the ImageData and it doesn't originate from a File.
    fontmap = { data: fontmap.data, height: fontmap.height, width: fontmap.width };
}).attr('src', fontmapURL);

export default asciify;
