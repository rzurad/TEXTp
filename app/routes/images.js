import Ember from "ember";

var ImagesRoute;

ImagesRoute = Ember.Route.extend({
    activate: function () {
        Ember.$(document).attr('title', 'TEXTp - Images');
    }
});

export default ImagesRoute;
