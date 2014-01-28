'use strict';

angular.module('album')
    .factory('myService', function($q, $rootScope) {
        return {
            multipart: function(out) {
                var deferred = $q.defer();
                $('#ajax-form').ajaxSubmit({
                    success: function(data) {
                        $rootScope.$apply(function() {
                            deferred.resolve(data);
                        });
                    },
                    error: function(data) {
                        $rootScope.$apply(function() {
                            deferred.reject(data);
                        });
                    }
                });
                return deferred.promise;
            }
        }
    });
