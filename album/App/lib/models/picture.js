'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Picture Schema
 */
var PictureSchema = new Schema({
  owner: String,
  name: String
});

/**
 * Validations
 */
// PictureSchema.path('owner').validate(function (id) {
//   return id !== undefined;
// }, 'user must be defined');

mongoose.model('Picture', PictureSchema);