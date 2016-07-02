// create the module and name it userApp
angular.module('userApp', ['ngRoute', 'ui.router', 'ngMaterial', 'md.data.table', 'ngNotificationsBar'])
  .factory('User', ['$rootScope', '$http', '$q', '$timeout', '$location', 'notifications',
    function($rootScope, $http, $q, $timeout, $location, notifications) {

      function UserClass() {
        this.user = {};
        this.loggedin = false;
      }

      var User = new UserClass();
      UserClass.prototype.login = function(user) {
        var self = this;
        $http.post('/login', {
            email: user.email,
            password: user.password
          })
          .success(function(response) {
            if (response.user) {
              $location.url('/home');
              self.user = response.user;
              self.loggedin = true;
              $rootScope.$emit('loggedin', self);
              self.showNotification('showSuccess', 'logged in');
            } else {
              $rootScope.$emit('loggedin', self);
              self.showNotification('showError', 'cannot log in');
            }
          })
          .error(function(response) {
            $rootScope.$emit('loggedin', self);
            self.showNotification('showError', 'cannot log in');
          });
      }

      UserClass.prototype.register = function(user) {
        var self = this;
        $http.post('/addUser', {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password
          })
          .success(function(response) {
            User.user = user;
            $rootScope.$emit('listusers', response);
            self.showNotification('showSuccess', 'Saved');
            if (!self.loggedin) $location.url('login');
          })
          .error(function(response) {
            self.showNotification('showError', 'cannot register in');
          });
      }

      UserClass.prototype.update = function(user) {
        var self = this;
        $http.post('/updateUser', {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password
          })
          .success(function(response) {
            User.user = user;
            self.showNotification('showSuccess', 'Update in');
          })
          .error(function(response) {
            self.showNotification('showError', 'couldnot updated in');
          });
      }


      UserClass.prototype.logout = function() {
        this.user = {};
        this.loggedin = false;
        $rootScope.$emit('loggedin', this);
        $location.url('/login');
      };

      UserClass.prototype.getUsers = function() {
        var self = this;
        $http.get('/getUsers')
          .success(function(response) {
            $rootScope.$emit('listusers', response);
          })
          .error(function(response) {

          });
      }

      UserClass.prototype.removeUser = function(user) {
        var self = this;
        $http.post('/removeUser', {
            _id: user._id
          })
          .success(function(response) {
            $rootScope.$emit('listusers', response);
            self.showNotification('showSuccess', 'Removed user');
          })
          .error(function(response) {
            self.showNotification('showError', 'Cannot remove user');
          });
      }

      UserClass.prototype.showNotification = function(type, msg) {
        notifications[type]({
          message: msg,
          hideDelay: 1500, //ms
          hide: true //bool
        });
      }
      return User;
    }
  ]) // user factory
  .factory('ParseServer', ['$rootScope', function($rootScope) {
    function ParseServerClass() {
      this.port = window.location.port;
      this.url = window.location.protocol + '//' + window.location.hostname;
      if (this.port) this.url = this.url + ':' + this.port;
    }
    var ParseServer = new ParseServerClass();

    ParseServerClass.prototype.setCallback = function(callback) {
      this.xhttp = new XMLHttpRequest();
      var _self = this;
      this.xhttp.onreadystatechange = function() {
        if (_self.xhttp.readyState == 4 && _self.xhttp.status >= 200 && _self.xhttp.status <= 299) {
          callback(_self.xhttp.responseText);
        }
      };
    }
    ParseServerClass.prototype.GET = function(path, callback) {
      var self = this;
      this.xhttp.open("GET", self.url + path, true);
      this.xhttp.setRequestHeader("X-Parse-Application-Id", "bendigi");
      this.xhttp.setRequestHeader("Content-type", "application/json");
      this.xhttp.send(null);
    }

    return ParseServer;
  }]); // factory
