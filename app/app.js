import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
        modulePrefix: 'textp', // TODO: loaded via config
        Resolver: Resolver
    });

loadInitializers(App, 'textp');

if (TEXTpENV.environment === 'production') {
    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', TEXTpENV.gaTrackingCode, 'auto');
    ga('send', 'pageview');
    /* jshint ignore:end */
}

export default App;
