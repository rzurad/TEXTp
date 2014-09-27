import Ember from 'ember';
import { isMobileOrTablet } from '../utils/mobile-detect';
import isCompatibleEnv from '../utils/feature-detect';
/* globals ga */

var ApplicationRoute;

ApplicationRoute = Ember.Route.extend({
    beforeModel: function () {
        if (isMobileOrTablet() || !isCompatibleEnv()) {
            // redirect to unsupported page if it looks like the app won't work
            // or is on a mobile browser
            this.transitionTo('unsupported');
        } else {
            // always redirect to index on app init. This is so you can't land on
            // the images route when there are no images and also so that you don't
            // get stuck on the unsupported page during development
            this.transitionTo('index');
        }
    },

    actions: {
        didTransition: function () {
            Ember.run.once(this, function () {
                ga('send', 'pageview', this.router.get('url'));
            });
        }
    }
});

export default ApplicationRoute;
