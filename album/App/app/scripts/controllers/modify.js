'use strict';
angular.module('album')
  .controller('ModifyCtrl', function ($scope, $http, $timeout, $routeParams, User, Auth) {
    $scope.canvas = new fabric.Canvas('c');
    $scope.f = fabric.Image.filters;
    
    //$scope.grayscaleIsChecked = false;

    function applyFilter(index, filter) {
      var obj = $scope.canvas.getActiveObject();
      obj.filters[index] = filter;
      obj.applyFilters($scope.canvas.renderAll.bind($scope.canvas));
    }

    function applyFilterValue(index, prop, value) {
      var obj = $scope.canvas.getActiveObject();
      if (obj.filters[index]) {
        obj.filters[index][prop] = value;
        obj.applyFilters($scope.canvas.renderAll.bind($scope.canvas));
      }
    }

    fabric.Object.prototype.padding = 5;
    fabric.Object.prototype.transparentCorners = false;

    $scope.grayscale = function () {
      applyFilter(0, !$scope.grayscaleIsChecked && new $scope.f.Grayscale());
    };
    $scope.invert = function () {
      applyFilter(1, !$scope.invertIsChecked && new $scope.f.Invert());
    };
    $scope.sepia = function () {
      applyFilter(2, !$scope.sepiaIsChecked && new $scope.f.Sepia());
    };

    $scope.brightness = function () {
      applyFilter(3, new $scope.f.Brightness({
        brightness: parseInt($scope.brightnessIsChecked, 10)
      }));
    };

    $scope.$watch('brightnessIsChecked', function () {
      if ($scope.brightnessIsChecked) {
        $scope.brightness();
      } else {
        applyFilter(3, false);
      }
    });

    $scope.noise = function () {
      applyFilter(4, new $scope.f.Noise({
        noise: parseInt($scope.noiseRange, 10)
      }));
    };

    $scope.$watch('noiseIsChecked', function () {
      if ($scope.noiseIsChecked) {
        $scope.noise();
      } else {
        applyFilter(4, false);
      }
    });

    $scope.pixelate = function () {
      applyFilter(8, new $scope.f.Pixelate({
        blocksize: parseInt($scope.pixelateRange, 10)
      }));
    };

    $scope.$watch('pixelateIsChecked', function () {
      if ($scope.pixelateIsChecked) {
        $scope.pixelate();
      } else {
        applyFilter(8, false);
      }
    });

    $scope.blur = function () {
      applyFilter(9, new $scope.f.Convolute({
        matrix: [1 / 9, 1 / 9, 1 / 9,
                  1 / 9, 1 / 9, 1 / 9,
                  1 / 9, 1 / 9, 1 / 9]
      }));
    };

    $scope.$watch('blurIschecked', function () {
      if ($scope.blurIschecked) {
        $scope.blur();
      } else {
        applyFilter(9, false);
      }
    });

    $scope.sharpen = function () {
      applyFilter(10, !$scope.sharpenIschecked && new $scope.f.Convolute({
        matrix: [0, -1, 0,
                  -1, 5, -1,
                   0, -1, 0]
      }));
    };

    $scope.embos = function () {
      applyFilter(11, !$scope.embosIschecked && new $scope.f.Convolute({
        matrix: [1, 1, 1,
                  1, 0.7, -1,
                 -1, -1, -1]
      }));
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
        fabric.Image.fromURL(file.pathToImage, function (imgObj) {
          imgObj.set({
            height: 200,
            width: (200 * imgObj.width) / imgObj.height
          });
          $scope.canvas.add(imgObj);
          $scope.canvas.calcOffset();
        });
      });
    };

    $scope.downloadFile = function (file) {
      window.open('/uploads/downloadFile/' + file.name);
    };

    $scope.deleteFile = function (file) {
      $http.post("/uploads/deleteFile/" + file.name).success(function (data) {
        $scope.listFiles();
      });
    };

    $scope.showFile();
    $scope.listFiles();
  });