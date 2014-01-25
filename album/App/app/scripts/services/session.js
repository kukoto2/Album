'use strict';

angular.module('angularAppApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
