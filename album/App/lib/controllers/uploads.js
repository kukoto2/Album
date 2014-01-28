'use strict';

var mongoose = require('mongoose'),
    Picture = mongoose.model('Picture'),
    fs = require('fs');

exports.saveVersion = function (req, res) {
    var userId = req.user._id,
        regex = /^data:.+\/(.+);base64,(.*)$/,
        matches = req.body.newImage.match(regex),
        ext = matches[1],
        data = matches[2],
        imageName = req.body.title + '.' + ext,
        newPath = "./app/pictures/" + imageName,
        buffer = new Buffer(data, 'base64');
    fs.writeFileSync('data.' + ext, buffer);
    fs.writeFile(newPath, buffer, function (err) {
        if (err) throw err;
        Picture.create({ owner: userId, name: imageName, origName: req.body.origName }, function (err, pic) {
            if (err) console.log('Failed to save image data to DB!');
        });
    });
    res.send(200);
};

exports.fileUpload = function(req, res) {
	fs.readFile(req.files.displayImage.path, function (err, data) {
		var userId = req.user._id;
		var imageName = req.files.displayImage.name;

		if(!imageName) {
			console.log("No file found!");
			res.redirect("/upload");
			res.end();
		} else {
			// var newPath = __dirname + "/uploads/" + imageName;
			var newPath = "./app/pictures/" + imageName;
			fs.writeFile(newPath, data, function (err) {
				if (err) throw err;
				Picture.create({ owner: userId, name: imageName }, function (err, pic) {
					if(err) console.log('Failed to save image data to DB!');
				});
				uploads.emit("uploadOrDeleted", { success: "Uploaded", user: req.user.name, fileName: imageName });
				fs.readdirSync('./uploads').forEach(function(fileName) {
			        console.log(fileName);
			        if (fileName !== ".gitignore") {
			            fs.unlinkSync('./uploads/' + fileName);
			        }
			    });
				res.send(200);
			});
		}
	});
};

exports.getFile = function (req, res) {
	Picture.find({ owner: req.user._id }, function (err, pics) {
		return res.json(pics);
	});
};

exports.getFileByName = function (req, res) {
  Picture.find({ owner: req.user._id, name: req.params.file }, function (err, pic) {
    return res.json(pic[0]);
  });
};

exports.getFilesByOrigName = function (req, res) {
  Picture.find({ owner: req.user._id, origName: req.params.file }, function (err, pics) {
    return res.json(pics);
  });
};

exports.downloadFile = function (req, res, next) {
	var file = "./app/pictures/" + req.params.file;
	var userId = req.user._id;
	Picture.findOne({ owner: userId, name: req.params.file }, function (err, pic) {
		if(pic) {
			res.attachment();
			res.download(file, req.params.file);
		} else {
			res.send(404, "Sorry file not found or not accessable at this time!");
		}
	});	
};

exports.deleteFile = function (req, res) {
	var file = "./app/pictures/" + req.params.file;
	fs.unlink(file, function (err) {
	  if (err) {
	    console.log("error deleting!");
	    console.log(err);
	  }
		Picture.findOneAndRemove({ owner: req.session.passport.user, name: req.params.file }, function (err) {
			if(err) console.log('Delete from db failed!');
		});

		uploads.emit("uploadOrDeleted", { success: "Deleted", user: req.user.name, fileName: req.params.file});

		res.send(200);
	});
};

var uploads = global.io.of('/uploadChannel').on('connection', function(socket) {
	// console.log("a user has connected to the 'chat' namespace");
});