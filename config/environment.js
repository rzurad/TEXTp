/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
            modulePrefix: 'textp',
            environment: environment,
            version: '0.9.5',
            baseURL: environment === 'production' ? '/TEXTp/' : '/',
            locationType: 'hash',
            gaTrackingCode: 'XX-XXXXXXXX-XX',
            EmberENV: {
                FEATURES: {
                    // Here you can enable experimental features on an ember canary build
                    // e.g. 'with-controller': true
                }
            },

            APP: {
                // Here you can pass flags/options to your application instance
                // when it is created
            },

            contentSecurityPolicy: {
                'default-src': "'none'",
                'child-src': "'self'",
                'script-src': "'self'",
                'font-src': "'self'",
                'connect-src': "'self'",
                'img-src': "'self' https://camo.githubusercontent.com",
                'style-src': "'unsafe-inline' 'self'",
                'media-src': "'self'"
            }
        };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

    }

    return ENV;
};
