'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    uploads = require('./controllers/uploads');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  
  app.post('/api/users', users.create);
  app.put('/api/users', users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  app.get('/uploads/getFile', uploads.getFile); 
  app.get('/uploads/getFileByName/:file', uploads.getFileByName);
  app.get('/uploads/getFileByOrigName/:file', uploads.getFilesByOrigName);
  app.get('/uploads/downloadFile/:file(*)', uploads.downloadFile);
  app.post('/uploads/fileupload', uploads.fileUpload);
  app.post('/uploads/deleteFile/:file(*)', uploads.deleteFile);

  app.post('/uploads/saveVersion', uploads.saveVersion);
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};