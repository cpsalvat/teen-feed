'use strict';

angular.module('myApp.links', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/links', {
    templateUrl: 'links/links.html',
    controller: 'LinksCtrl as ctrl',
  });
}])

.controller('LinksCtrl', ['$scope', LinksPageController]);

function LinksPageController($scope) {
  // Client ID and API key from the Developer Console
  var CLIENT_ID = config.CLIENT_ID;
  var API_KEY = config.API_KEY;
  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
  var LINKS_SPREADSHEET_ID = '1w2JxsDwENhJcobH9Pksvq1XcwaKGEq5CxbrTwOmFKJM';

  this.links = [];
  this.scope = $scope;

  this.listLinks = function() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: LINKS_SPREADSHEET_ID,
      range: 'Links!A2:C',
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        for (var i = 0; i < range.values.length; i++) {
          var row = range.values[i];
          this.links.push({
            title: row[0],
            url: row[1],
            summary: row[2]
          });
        }
        this.scope.$apply();
      } 
    }.bind(this));
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
      this.listLinks();
    }.bind(this));
  }

  this.handleClientLoad();
}