'use strict';

angular.module('angularAppApp')
  .controller('MainCtrl', function ($scope, $http) {
  	document.title = "Home";

    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });
