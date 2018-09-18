'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Setting Schema
 */
var OptionsSchema = new Schema({
  updated: {
    type: Date,
    default: Date.now()
  },
  info: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: '',
    unique: true
  },
  display: {
    type: String,
    default: '',
    unique: true
  }
});

mongoose.model('Options', OptionsSchema);
