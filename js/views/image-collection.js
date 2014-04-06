define([
    'ehbs!image',
    'ember'
], function () {
    "use strict";

    return Ember.CollectionView.extend({
        classNames: ['images-container'],
        attributeBindings: ['style'],

        style: function () {
            return ['left: ', this.get('index') * -100, '%'].join('');
        }.property('index'),

        itemViewClass: Ember.View.extend({
            classNames: ['image-container'],
            template: Ember.TEMPLATES['image'],

            onFileProcessed: function () {
                this.$('div').css({ 'max-width': this.get('content.width') });
                this.$('.save-target').attr('src', this.get('content.TEXTp'));
                this.$('.ascii').css({ 'background-image': 'url(' + this.get('content.TEXTp') + ')' });
                this.$('.original').css({ 'background-image' : 'url(' + this.get('content.original') + ')' });
            }.observes('content.isProcessed')
        })
    });
});
