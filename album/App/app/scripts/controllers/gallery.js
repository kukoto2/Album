'use strict';

angular.module('album')
  .controller('GalleryCtrl', function ($scope, $http) {
  	document.title = "Gallery";

  	$scope.listFiles = function () {
  	  var photos = [];
  	  $http.get('/uploads/getFile').success(function (files) {

  	    angular.forEach(files, function (file) {
  	      file.pathToImage = '../../pictures/' + file.name;
  	      photos.push(file);
  	    });
  	  });
  	  return photos;
  	};
  	$scope.photos = $scope.listFiles();
    $scope._Index = 0;

    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
  });