'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  Machine = mongoose.model('Machine'),
  smtpTransport = require('nodemailer-smtp-transport'),
  mg = require('nodemailer-mailgun-transport'),
  EmailTemplate = require('email-templates').EmailTemplate,
  pug = require('pug'),
  api_key = 'key-68b44d4a33c6e3949a16999ba44c25ee',
  domain = 'sandboxe7e8b6fb1a91419abe70eb64db20a31a.mailgun.org',
  mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain }),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
config.mailer.options.host = 'smtp.mailgun.org';
  // var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Create an article
 */
exports.create = function (req, res) {
  /* var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  }); */
};

/**
 * Read the machine with userName and hostName
 */
exports.read = function (req, res) {
  var userName = req.params.userName;
  var hostName = req.params.hostName;

  Machine.findOne({ user: userName, host: hostName })
    .then(machine => {
      if (!machine) {
        res.status(404).send({
          message: 'No machine with that host name has been found'
        });
      } else {
        res.json(machine.toJSON());
      }
    })
    .catch(err => {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Update an machine
 */
exports.update = function (req, res) {
  var userName = req.params.userName;
  var hostName = req.params.hostName;
  var newHostName = req.body.host;
  var info = req.body.info;
  var setting = req.body.setting;

  var existing_info = {};

  if (!newHostName) newHostName = hostName;
  info.hostname = newHostName;

  Machine.findOne({ user: userName, host: hostName })
    .then(machine => {
      if (!machine) {
        var newMachine = new Machine({
          user: userName,
          host: newHostName,
          updated: Date.now(),
          info: info
        });
        return newMachine.save();
      } else {
        existing_info = machine.info; // save the exiting info
        machine.host = newHostName;
        if (!setting) machine.updated = Date.now();
        machine.info = req.body.info;
        return machine.save();
      }
    })
    .then(machine => {

      res.json(machine.toJSON());
/**
 * Comparing new info with the exiting info
 */

    //   if (hostName === 'ROL0030' && userName === 'roland') {
    //     // // res.render('modules/machines/server/templates/machine-offline-notification-email', {
    //     var data = {
    //       from: config.mailer.from,
    //       to: 'mosrafael492@gmail.com',
    //       subject: 'Your machine is offline.',
    //       text: 'offline offline offline offline offline'
    //     };
    //     mailgun.messages().send(data, (error, body) => {
    //       if (error)
    //         return res.status(422).send({
    //           message: errorHandler.getErrorMessage(error)
    //         });
    //       res.json(machine.toJSON());
    //     });
    //   } else {
    //     res.json(machine.toJSON());
    //   }
    // })
    // .catch(err => {
    //   return res.status(422).send({
    //     message: errorHandler.getErrorMessage(err)
    //   });
    // });
    });
};

/**
 * Delete an Machine
 */
exports.delete = function (req, res) {
  var userName = req.params.userName;
  var hostName = req.params.hostName;

  Machine.findOne({ user: userName, host: hostName })
    .then(machine => {
      return machine.remove();
    })
    .then(() => {
      res.json({ message: 'The machine is deleted successfully.' });
    })
    .catch(err => {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Machines of User
 */
exports.list = function (req, res) {
  var userName = req.params.userName;

  Machine.find({ user: userName }).sort('host')
    .then(machines => res.json(machines))
    .catch(err => {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};
