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
  	$scope.photos = $scope.listFiles()
    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
  });