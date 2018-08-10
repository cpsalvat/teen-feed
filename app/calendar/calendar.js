'use strict';

angular.module('myApp.calendar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calendar', {
    templateUrl: 'calendar/calendar.html',
    controller: 'CalendarCtrl as ctrl'
  });
}])

.controller('CalendarCtrl', ['$scope', CalendarController]);

function CalendarController($scope) {
  // Client ID and API key from the Developer Console
  var CLIENT_ID = config.CLIENT_ID;
  var API_KEY = config.API_KEY;
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  // Calender ID defined in the calendar settings
  var CAL_ID = 'cj6g2i651oarhrf56uecbuhtu0@group.calendar.google.com';
  var MAP_SEARCH_URL =  "https://www.google.com/maps/search/?api=1&query=";
  
  this.events = [];
  this.scope = $scope;

  this.listUpcomingEvents = function() {
    gapi.client.calendar.events.list({
      'calendarId': CAL_ID,
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var eventsList = response.result.items;
      for (var i=0; i < eventsList.length; i++) {
        var event = eventsList[i];
        this.events[i] = {
          summary: event.summary,
          locationName: event.location,
          locationLink: MAP_SEARCH_URL + encodeURIComponent(event.location),
          date: this.dateToDateString(new Date(event.start.dateTime)),
          start: this.dateToTimeString(new Date(event.start.dateTime)),
          end: this.dateToTimeString(new Date(event.end.dateTime)),
          htmlLink: event.htmlLink,
          description: event.description,
        };
      }
      this.scope.$apply();
    }.bind(this));
  }
  
  this.dateToTimeString = function(date) {
    var options = {
      hour: 'numeric', 
      minute: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  this.dateToDateString = function(date) {
    var options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  this.handleClientLoad = function() {
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  this.initClient = function() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function() {
      this.listUpcomingEvents();
    }.bind(this));
  }

  this.handleClientLoad();
}