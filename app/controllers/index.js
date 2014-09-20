import Ember from 'ember';

var IndexController;

IndexController = Ember.Controller.extend({
    needs: ['images'],

    actions: {
        importUrls: function () {
            var urls = [];
            
            Ember.$('.input-url').each(function (i, input) {
                var value = Ember.$(input).val();

                if (value !== '') {
                    urls.push(value);
                }
            });

            if (urls.length) {
                //this.get('controllers.images').set('content', urls);
                this.get('controllers.images').loadUrls(urls);
            }
        }
    }
});

export default IndexController;
