import Ember from "ember";

var ImageView;

ImageView = Ember.View.extend({
    classNames: ['image-container'],
    template: Ember.Handlebars.compile([
        '<div class="original"></div>',
        '<div class="ascii"></div>',
        '<img class="save-target" />'
    ].join('')),

    onFileProcessed: function () {
        this.$('div').css({ 'max-width': this.get('content.width') });
        this.$('.save-target').attr('src', this.get('content.TEXTp'));
        this.$('.ascii').css({ 'background-image': 'url(' + this.get('content.TEXTp') + ')' });
        this.$('.original').css({ 'background-image' : 'url(' + this.get('content.original') + ')' });
    }.observes('content.isProcessed')
});

export default ImageView;
