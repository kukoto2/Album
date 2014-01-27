'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PictureSchema = new Schema({
  owner: String,
  name: String,
  origName: String
});

mongoose.model('Picture', PictureSchema);