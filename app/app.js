import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
        modulePrefix: config.modulePrefix,
        podModulePrefix: config.podModulePrefix,
        Resolver: Resolver
    });

if (config.environment === 'production') {
    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', config.gaTrackingCode, 'auto');
    /* jshint ignore:end */
} else {
    window.ga = Ember.K;
}

loadInitializers(App, config.modulePrefix);

export default App;
