// create the module and name it userApp
var userApp = angular.module('userApp', ['ngRoute', 'ui.router', 'ngMaterial', 'md.data.table', 'ngNotificationsBar']);

userApp
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
            if (response.success) {
              $location.url('/home');
              self.loggedin = true;
              $rootScope.$emit('loggedin', self);
              self.showNotification('showSuccess', 'logged in');
            } else {
              $rootScope.$emit('loggedin', self);
              self.showNotification('showError', 'cannot log in');
            }
          })
          .error(function(response) {
            if (response.success) {
              $location.url('/home');
              self.loggedin = true;
              $rootScope.$emit('loggedin', self);
              self.showNotification('showSuccess', 'logged in');
            } else {
              $rootScope.$emit('loggedin', self);
              self.showNotification('showError', 'cannot log in');
            }
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
            if (response.success) {
              User.user = user;
              self.showNotification('showSuccess', 'Registered in');
              $location.url('login');
            } else {
              self.showNotification('showError', 'cannot register in');
            }
          })
          .error(function(response) {
            if (response.success) {
              User.user = user;
              self.showNotification('showSuccess', 'register in');
              $location.url('login');
            } else self.showNotification('showError', 'cannot register in');
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
            if (response.success) {
              $rootScope.$emit('listusers', response);
            }
          })
          .error(function(response) {
            if (response.success) {
              $rootScope.$emit('listusers', response);
            }
          });
      }

      UserClass.prototype.removeUser = function(user) {
        var self = this;
        $http.post('/removeUser', {
            id: user._id
          })
          .success(function(response) {
            if (response.success) {
              self.getCars();
              self.showNotification('showSuccess', 'Removed car');
            } else {
              self.showNotification('showError', 'Cannot removed  car');
            }
          })
          .error(function(response) {
            if (response.success) {
              self.getCars();
              self.showNotification('showSuccess', 'Removed car');
            } else {
              self.showNotification('showError', 'Cannot remove car');
            }
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
  ]) // factory
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("home", {
        url: "/home",
        templateUrl: "pages/home.html",
        authenticate: true
      })
      .state("cars", {
        url: "/cars",
        templateUrl: "pages/cars.html",
        authenticate: true
      })
      .state("register", {
        url: "/register",
        templateUrl: "pages/register.html",
        authenticate: false
      })
      .state("login", {
        url: "/login",
        templateUrl: "pages/login.html",
        authenticate: false
      });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/login");
  })
  .controller('userController', function($scope, $rootScope, User) {
    var self = this;
    self.loggedin = User.loggedin;
    self.cls = "body";
    $rootScope.$on('loggedin', function(event, args) {
      console.log(args)
      self.loggedin = args.loggedin;
      self.cls = self.loggedin ? "" : "body";
    });
    self.logout = function() {
      User.logout();
    }
  })
  .controller('carController', function($scope, User, $rootScope) {
    var self = this;
    $scope.selected = [];

    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.car = {
      model: null,
      year: null,
      millage: null
    };

    self.init = function() {
      User.getCars();
    }

    self.addCar = function() {
      var isEmpty = null;
      var isInvalid = false;
      _.forEach(_.keys($scope.car), function(key) {
        if (key !== 'id' && !$scope.car[key]) isEmpty = key;
      });
      if (!isEmpty && (!parseInt($scope.car.year) || !parseInt($scope.car.millage))) isInvalid = true;
      // console.log(isEmpty, isInvalid, !parseInt($scope.car.year), !parseInt($scope.car.millage))
      if (isEmpty) {
        User.showNotification('showError', 'Please check fields.');
      } else if (isInvalid) {
        User.showNotification('showError', 'Please check fields.');
      } else {
        User.addCar($scope.car);
      }
    }

    self.removeUser = function(car) {
      User.removeUser(car);
    }

    $rootScope.$on('listusers', function(event, args) {

      $scope.cars = _.map(args.cars, function(car) {
        var newCar = {};
        _.each(_.keys(car), function(ky) {
          newCar[ky.toLowerCase()] = car[ky];
        });
        return newCar;
      });
    });
  })
  .controller('loginController', function($scope, $rootScope, User) {
    var self = this;
    self.user = {
      email: null,
      password: null
    }

    self.login = function() {
      User.login(self.user);
    }
  })
  .controller('registerController', function($scope, $rootScope, User) {
    var self = this;
    self.user = {
      firstname: null,
      lastname: null,
      email: null,
      password: null
    }

    self.register = function() {
      User.register(self.user);
    }
  });

userApp.run(function($rootScope, $state, User) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.authenticate && !User.loggedin) {
      // User isn’t authenticated
      $state.transitionTo("login");
      event.preventDefault();
    }
  });
});
