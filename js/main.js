require.config(config);

require([
    './controllers/application',
    './controllers/images',
    './views/application',
    './views/image-collection',
    './views/images',

    'ehbs!application',
    'ehbs!images',
    'ehbs!index',
    'ehbs!about',

    'css!../css/bootstrap',
    'css!../css/app',

    'ember'
], function (
    ApplicationController,
    ImagesController,
    ApplicationView,
    ImageCollectionView,
    ImagesView
) {
    "use strict";

    var App = window.App = Ember.Application.create({
            ApplicationView: ApplicationView,
            ImageCollectionView: ImageCollectionView,
            ApplicationController: ApplicationController,
            ImagesController: ImagesController,
            ImagesView: ImagesView
        });

    App.Router.map(function () {
        this.route('about');
        this.route('images');
    });

    App.ImagesRoute = Ember.Route.extend({
        beforeModel: function () {

            if (!this.controllerFor('images').get('content.length')) {
                this.transitionTo('index');
            }
        }
    });
});
