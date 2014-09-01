import Ember from "ember";

var ImagesView;

ImagesView = Ember.View.extend({
    classNameBindings: ['controller.TEXTp', 'controller.isLoading', 'controller.isProcessing']
});

export default ImagesView;
