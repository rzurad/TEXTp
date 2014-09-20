import Ember from 'ember';

var IndexView,
    INPUT_FIELD = '<input type="input" class="form-control input-url" placeholder="Enter image URL">';

IndexView = Ember.View.extend({
    didInsertElement: function () {
        this.$('.form-inputs').prepend(INPUT_FIELD);
    },

    change: function (e) {
        // make sure text field change events don't bubble to the application
        e.stopPropagation();
    }
});

export default IndexView;
