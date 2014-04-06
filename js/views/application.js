define(['ember'], function () {
    "use strict";

    var IMAGES = [
            './img/examples/fallout-3.png',
            './img/examples/mass-effect-3.jpg',
            './img/examples/titanfall.png'
        ];

    function intercept(fn) {
        return function (e) {
            e.stopPropagation();
            e.preventDefault();

            return fn.apply(this, arguments);
        }
    }

    return Ember.View.extend({
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
            this.$() && this.$().toggleClass('bad-drop');
        }.observes('controller.noImagesFound'),

        observeIsHovering: function () {
            this.$().toggleClass('hovering');
        }.observes('isHovering'),

        dragOver: intercept(function (e) {
            this.set('isHovering', true);
        }),

        dragEnter: intercept(function (e) {
            this.set('isHovering', true);
            this.get('controller').send('dragEnter');
        }),

        dragLeave: intercept(function (e) {
            this.set('isHovering', false);
        }),

        drop: intercept(function (e) {
            var items = e.dataTransfer.items;

            this.set('isHovering', false);

            if (items.length) {
                this.get('controller').send('drop', items);
            }
        }),

        change: function (e) {
            this.get('controller').send('select', e.target.files);
        }
    });
});
