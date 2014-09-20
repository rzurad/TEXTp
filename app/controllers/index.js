import Ember from 'ember';

var IndexController;

IndexController = Ember.Controller.extend({
    needs: ['images', 'application'],

    actions: {
        importUrls: function () {
            var urls = [];
            
            Ember.$('.input-url').each(function (i, input) {
                var value = Ember.$(input).val();

                if (value !== '') {
                    urls.push({
                        isUrl: true,
                        original: value
                    });
                }
            });

            if (urls.length) {
                this.get('controllers.images').set('content', urls);
                this.get('controllers.images').loadUrls();

                this.transitionToRoute('images');
            } else {
                this.get('controllers.application').send('noImagesFound');
            }
        }
    }
});

export default IndexController;
