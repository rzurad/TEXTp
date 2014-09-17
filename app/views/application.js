import Ember from "ember";

var IMAGES = [
        '/assets/images/backgrounds/fallout-3.png',
        '/assets/images/backgrounds/mass-effect-3.jpg',
        '/assets/images/backgrounds/titanfall.png'
    ],
    ApplicationView;



function intercept(fn) {
    return function (e) {
        e.stopPropagation();
        e.preventDefault();

        return fn.apply(this, arguments);
    };
}

ApplicationView = Ember.View.extend({
    classNames: ['application'],
    isHovering: false,

    backgroundImage: function () {
        return [
            'background-image: url(',
            IMAGES[~~(Math.random() * IMAGES.length)],
            ');'
        ].join('');
    }.property(),

    observeNoImagesFound: function () {
        if (this.$()) {
            this.$().toggleClass('bad-drop');
        }
    }.observes('controller.noImagesFound'),

    observeIsProcessing: function () {
        if (this.$()) {
            this.$().toggleClass('processing');
        }
    }.observes('controller.isProcessing'),

    observeIsHovering: function () {
        if (this.$()) {
            this.$().toggleClass('hovering');
        }
    }.observes('isHovering'),

    dragOver: intercept(function () {
        this.set('isHovering', true);
    }),

    dragEnter: intercept(function () {
        this.set('isHovering', true);
        this.get('controller').send('dragEnter');
    }),

    dragLeave: intercept(function () {
        this.set('isHovering', false);
    }),

    drop: intercept(function (e) {
        var items = e.dataTransfer.items || e.dataTransfer.files;

        this.set('isHovering', false);

        if (items.length) {
            this.get('controller').send('drop', items);
        }
    }),

    change: function (e) {
        this.get('controller').send('select', e.target.files);
    }
});

export default ApplicationView;
