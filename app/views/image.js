import Ember from "ember";

var ImageView;

ImageView = Ember.View.extend({
    classNames: ['image-container'],
    template: Ember.Handlebars.compile([
        '<img class="save-target" />',
        '<div class="scale-container">',
            '<div class="original"></div>',
            '<div class="ascii"></div>',
        '</div>'
    ].join('')),

    onFileProcessed: function () {
        this.$('div').css({ 'max-width': this.get('content.width') });
        this.$('.save-target').attr('src', this.get('content.TEXTp'));
        this.$('.ascii').css({ 'background-image': 'url(' + this.get('content.TEXTp') + ')' });
        this.$('.original').css({ 'background-image' : 'url(' + this.get('content.original') + ')' });
    }.observes('content.isProcessed')
});

export default ImageView;
