import Ember from "ember";

var ImagesRoute;

ImagesRoute = Ember.Route.extend({
    activate: function () {
        Ember.$(document).attr('title', 'TEXTp - Images');
    },

    beforeModel: function () {
        if (!this.controllerFor('images').get('content.length')) {
            this.transitionTo('index');
        }
    }
});

export default ImagesRoute;
