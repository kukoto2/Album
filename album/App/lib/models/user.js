'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String
});

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password, this.salt);
  })
  .get(function() {
    return this._password;
  });

UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'provider': this.provider
    };
  });

UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

var validatePresenceOf = function(value) {
  return value && value.length;
};

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

UserSchema.plugin(uniqueValidator,  { message: 'Value is not unique.' });

UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
  },

  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  encryptPassword: function(password, salt) {
	return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

mongoose.model('User', UserSchema);