'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.links',
  'myApp.help',
  'myApp.calendar',
]).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html'
  });
  $routeProvider.otherwise({redirectTo: '/main'});
}]);

