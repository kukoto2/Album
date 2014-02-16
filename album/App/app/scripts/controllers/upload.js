'use strict';
angular.module('album')
  .controller('UploadCtrl', function ($scope, $http, $timeout, User, Auth) {
  	document.title = "Uploads";
    $scope.successAlerts = [];
    $scope.errorAlerts = [];

	  $scope.listFiles = function () {
	    $http.get('/uploads/getFile').success(function (files) {
	      var variations = _.filter(files, 'origName');
	      var mainFiles = _.reject(files, 'origName');
	      $scope.files = [];
	      angular.forEach(mainFiles, function (file) {
	        file.mainFileVariations = _.where(variations, { 'origName': file.name });
	        $scope.files.push(file);
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

    $scope.uploadFile = function () {
    	var img_data = new FormData($("#uploadForm")[0]);
    	if(document.getElementById("displayImage").files[0] !== undefined) {
	    	$.ajax({
	    		type: 'POST',
	    		url: '/uploads/fileUpload',
	    		data: img_data,
	    		async: false,
			    cache: false,
			    contentType: false,
			    processData: false,
	    		success: function (upload) {
	    			//$scope.listFiles();
					document.getElementById("uploadForm").reset();
	    		}
	    	});
	    } else {
	    	alert("No file selected to upload!");
	    }

    	return false;
    };


    $scope.listFiles();

	  var socket = io.connect('/uploadChannel');
	  socket.on('uploadOrDeleted', function (data) {
		  $scope.successAlerts.push(data);
		  $timeout(function(){
			  $scope.successAlerts.pop(data);
		  }, 2000);
		  $scope.listFiles();
	  });
});
