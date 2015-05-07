import Ember from "ember";
import ImageView from "./image";

var ImageCollectionView; 

ImageCollectionView = Ember.CollectionView.extend({
    classNames: ['images-container'],
    attributeBindings: ['style'],

    style: function () {
        return ['left: ', this.get('index') * -100, '%'].join('').htmlSafe();
    }.property('index'),

    itemViewClass: ImageView
});

export default ImageCollectionView;
