'use strict';

angular.module('angularAppApp')
  .controller('UploadCtrl', function ($scope, $http, $timeout, User, Auth) {
  	document.title = "Uploads";

    $scope.successAlerts = [];
    $scope.errorAlerts = [];

	$scope.listFiles = function () {
			$http.get('/uploads/getFile').success(function(files) {
      		$scope.files = files;
    	});
	};

    $scope.downloadFile = function () {
    	window.open('/uploads/downloadFile/' + this.file.name);
    };

    $scope.deleteFile = function () {
    	$http.post("/uploads/deleteFile/" + this.file.name).success(function(data) {
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

    // Populate list on load
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
