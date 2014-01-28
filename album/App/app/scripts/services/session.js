'use strict';

angular.module('album')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
