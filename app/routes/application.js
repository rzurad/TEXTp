import Ember from 'ember';
import { isMobileOrTablet } from '../utils/mobile-detect';

var ApplicationRoute;

ApplicationRoute = Ember.Route.extend({
    beforeModel: function () {
        if (isMobileOrTablet()) {
            this.transitionTo('unsupported');
        }
    }
});

export default ApplicationRoute;
