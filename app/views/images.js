import Ember from "ember";

var ImagesView;

ImagesView = Ember.View.extend({
    classNameBindings: ['controller.showTEXTp', 'viewMode', 'controller.isLoading', 'controller.isProcessing'],

    viewMode: function () {
        return this.get('controller.showFitView') ? 'fit' : 'full';
    }.property('controller.showFitView')
});

export default ImagesView;
