'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  userjs;
module.exports = function(System) {
  return {
    /*
    * Login authentication
    */
    signin: function(user, callback) {
      User.findOne({
        email: user.email,
        password: user.password
      }, function(err, verifiedUser) {
        if (err) return callback(err);
        if (!verifiedUser) callback(null, false);
        else callback(null, true);
      });
    },
    /*
     * Return all users from db
     */
    getUsers: function(callback) {
      User.find()
      .exec(function(err, users) {
        if(err) return callback(err);
        callback(null, users);
      });
    },
    /*
     * Add user into db and hubspot
     */
    addUser: function(user, callback) {
      var newUser = new User(user);
      console.log(newUser);
      newUser.save(function(err) {
        console.log(err, 'here');
        if(err) return callback(err);
        userjs.getUsers(function(err, users) {
          if(err) return callback(err);
          callback(null, users);
        });
      });
    },
    /*
     * Update user in db and hubspot api
     */
    updateUser: function(user, callback) {
      return callback(null, 'semmm');
    },
    /*
    * Remove user from db and hubspot api
    */
    removeUser: function(user, callback) {
      return callback(null, 'delete');
    }
  }
}
