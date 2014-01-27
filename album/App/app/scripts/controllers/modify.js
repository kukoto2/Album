'use strict';
angular.module('angularAppApp')
  .controller('ModifyCtrl', function ($scope, $http, $timeout, $routeParams, User, Auth) {
    document.title = "Modify";
    
    $scope.filter = function () {
        $scope.canvas = new fabric.Canvas('c');
        var imgElement = document.getElementById('image');
        var imgInstance = new fabric.Image(imgElement, {
            left: 100,
            opacity: 0.45
        });
        $scope.canvas.add(imgInstance);

    };

    $scope.saveCanvas = function () {
      $http.post('/uploads/saveVersion', {
        newImage: $scope.canvas.toDataURL('jpg'),
        title: $scope.title,
        origName: $routeParams.title
      }).then(function () {
        $scope.listFiles();
      });
    };

    $scope.listFiles = function () {
      $http.get('/uploads/getFileByOrigName/' + $routeParams.title).success(function (files) {
        $scope.files = [];
        angular.forEach(files, function (file) {
          file.pathToImage = '../../pictures/' + file.name;
          $scope.files.push(file);
        });
      });
    };

    $scope.showFile = function () {
      $http.get('/uploads/getFileByName/' + $routeParams.title).success(function (file) {
        $scope.file = file;
        file.pathToImage = '../../pictures/' + file.name;
      });
    };

    $scope.downloadFile = function () {
      window.open('/uploads/downloadFile/' + this.file.name);
    };

    $scope.deleteFile = function () {
      $http.post("/uploads/deleteFile/" + this.file.name).success(function (data) {
        $scope.listFiles();
      });
    };

    $scope.showFile();
    $scope.listFiles();
});