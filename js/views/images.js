define(['ember'], function () {
    "use strict";

    return Ember.View.extend({
        classNameBindings: ['controller.TEXTp', 'controller.isLoading', 'controller.isProcessing']
    });
});
