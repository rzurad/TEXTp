import Ember from 'ember';

export default Ember.Route.extend({
    activate: function () {
        Ember.$(document).attr('title', 'TEXTp - About');
    }
});
