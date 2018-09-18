'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Options = mongoose.model('Options'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var option = new Options(req.body.input);


  option.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(option);
    }
  });
};

/**
 * Read the Setting with userName
 */
exports.read = function (req, res) {

  Options.find({ info: req.query.state }).sort('display')
  .then(option => {
    if (!option) {
      res.status(404).send({
        message: 'No option with that info has been found'
      });
    } else {
      res.json(option);
    }
  })
  .catch(err => {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var userName = req.params.userName;
  var info = req.body.info;

  Options.findOne({ user: userName })
    .then(option => {
      if (!option) {
        var newOption = new Options({
          user: userName,
          updated: Date.now(),
          info: info
        });
        return newOption.save();
      } else {
        option.updated = Date.now();
        option.info = req.body.info;
        return option.save();
      }
    })
    .then(option => {
      res.json(option.toJSON());
    })
    .catch(err => {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });

};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  /* var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });*/
};
