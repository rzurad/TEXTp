import Ember from "ember";

var ImageView;

ImageView = Ember.View.extend({
    classNames: ['image-container'],

    position: [0, 0],
    isDragging: false,
    isDraggable: function () {
        return !this.get('parentView.controller.showFitView');
    }.property('parentView.controller.showFitView'),

    template: Ember.Handlebars.compile([
        '<img class="save-target" />',
        '<div class="scale-container">',
            '<div class="ascii"></div>',
            '<div class="original"></div>',
        '</div>'
    ].join('')),

    dragEnter: _intercept,
    dragOver: _intercept,
    dragLeave: _intercept,
    drop: _intercept,

    mouseDown: function (e) {
        this.set('isDragging', true);

        if (this.get('isDraggable')) {
            this.set('lastMousePosition', [e.pageX, e.pageY]);
        }

        e.stopPropagation();
        e.preventDefault();
    },

    mouseUp: function (e) {
        this.set('isDragging', false);

        if (this.get('isDraggable')) {
            this.set('lastMousePosition', null);
        }

        e.stopPropagation();
        e.preventDefault();
    },

    onPositionChange: function () {
        var position = this.get('position'),
            $scaleContainer = this.$('.scale-container'),
            isFullWidthVisible = this.$().width() >= this.get('content.width'),
            isFullHeightVisible = this.$().height() >= this.get('content.height');

        if (!isFullWidthVisible) {
            $scaleContainer.css({ 
                left: position[0]
            });
        }

        if (!isFullHeightVisible) {
            $scaleContainer.css({
                top: position[1]
            });
        }
    }.observes('position'),

    onDragImage: function (e) {
        var lastMousePosition = this.get('lastMousePosition'),
            position = this.get('position'),
            delta = [lastMousePosition[0] - e.pageX, lastMousePosition[1] - e.pageY],
            height = this.get('content.height'),
            width = this.get('content.width'),
            vHeight = this.$().height(),
            vWidth = this.$().width(),
            left = position[0] - delta[0],
            top = position[1] - delta[1];

        // only do anything with repositioning the image if at least one
        // dimension falls off the viewport
        if (vHeight < height || vWidth < width) {
            // if height is completely visible or the new destination will scroll
            // it past the image's height, don't move the height
            if (vHeight >= height || (top < vHeight - height || top > 0)) {
                delta[1] = 0;
            }

            // if width is completely visible or the new destination will scroll
            // it past the image's width, don't move the width
            if (vWidth >= width || (left < vWidth - width || left > 0)) {
                delta[0] = 0;
            }

            this.set('lastMousePosition', [e.pageX, e.pageY]);
            this.set('position', [position[0] - delta[0], position[1] - delta[1]]);
        }
    },

    onResize: function () {
        var $scaleContainer = this.$('.scale-container'),
            vHeight = this.$().height(),
            vWidth = this.$().width(),
            position = this.get('position'),
            height = this.get('content.height'),
            width = this.get('content.width');

        // set the correct inline styles for 'full' if needed
        if (this.get('isDraggable')) {
            if (vWidth >= width) {
                $scaleContainer.css({
                    marginLeft: -(width / 2),
                    left: '50%'
                });
            } else {
                $scaleContainer.css({
                    marginLeft: 0,
                    left: position[0]
                });
            }

            if (vHeight >= height) {
                $scaleContainer.css({
                    marginTop: -(height / 2),
                    top: '50%'
                });
            } else {
                $scaleContainer.css({
                    marginTop: 0,
                    top: position[1]
                });
            }
        } else {
            // remove inline styles for 'fit' view
            $scaleContainer.css({
                marginTop: '',
                marginLeft: '',
                left: '',
                top: ''
            });
        }
    },

    init: function () {
        this._super();

        // Since we're using a jQuery event on the the document for detecting
        // mouse movements on drag and bypassing Ember, we need to ensure the
        // onDragImage handler is bound to the correct View so that it can be
        // unbound later and have access to view variables.
        this.onDragImage = this.onDragImage.bind(this);
        this.onResize = this.onResize.bind(this);

        Ember.$(window).on('resize', this.onResize);
    },

    destroy: function () {
        this._super();

        Ember.$(window).off('resize', this.onResize);
    },

    onIsDraggingChange: function () {
        if (this.get('isDraggable')) {
            // bind or unbind our mousemove handler.
            // note that it is using the bound `_dragImage` function generated by
            // the init function, otherwise the subsequent call to `off` wouldn't
            // work.
            Ember.$(document)[this.get('isDragging') ? 'on' : 'off']('mousemove', this.onDragImage);
        }
    }.observes('isDragging'),

    renderViewMode: function () {
        if (this.get('parentView.controller.showFitView')) {
            // change the inline styles of the scale-container for 'fit' view
            this.$('.scale-container').css({
                height: '',
                width: '',
                maxWidth: this.get('content.width')
            });
        } else {
            // change the inline styles of the scale-container for 'full' view
            this.$('.scale-container').css({
                maxWidth: '',
                width: this.get('content.width'),
                height: this.get('content.height')
            });
        }

        this.onResize();
    }.observes('parentView.controller.showFitView'),

    onFileProcessed: function () {
        this.$('.save-target').attr('src', this.get('content.TEXTp'));
        this.$('.ascii').css({ 'background-image': 'url(' + this.get('content.TEXTp') + ')' });
        this.$('.original').css({ 'background-image' : 'url(' + this.get('content.original') + ')' });

        this.set('position', [0, 0]);
        this.renderViewMode();
    }.observes('content.isProcessed')
});

function _intercept(e) {
    if (this.get('isDragging')) {
        e.stopPropagation();
        e.preventDefault();
    }
}

export default ImageView;
