import Ember from "ember";

var ImagesRoute = Ember.Route.extend({
        beforeModel: function () {
            if (!this.controllerFor('images').get('content.length')) {
                this.transitionTo('index');
            }
        }
    });

export default ImagesRoute;
