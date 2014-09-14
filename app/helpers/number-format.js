import Ember from 'ember';
/* global numeral */

export default Ember.Handlebars.makeBoundHelper(function (value) {
    return numeral(value).format('0,0');
});
