const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Schema } = mongoose;
const { USER_LEVEL } = require('../constants/accessLevel');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  googleId: String,
  name: String,
  email: String,
  password: { type: String, required: true },
  semester: Number,
  questionResponse: {
    type: Schema.Types.ObjectId,
    ref: 'QuestionResponse'
  },
  quizHistory: {
    type: Schema.Types.ObjectId,
    ref: 'QuizHistory'
  },
  lastSubmission: String,
  accessLevel: {
    type: Number,
    default: USER_LEVEL
  }
});


userSchema.pre('save', function (next) {
  var user = this;
  
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
  
  
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('User', userSchema);