import Ember from 'ember';

var Router = Ember.Router.extend({
        location: TEXTpENV.locationType
    });

Router.map(function () {
    this.route('about');
    this.route('unsupported');
    this.route('images');
});

export default Router;
