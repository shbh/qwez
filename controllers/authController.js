const mongoose = require('mongoose');
const User = mongoose.model('User');
const QuizHistory = mongoose.model('QuizHistory');
const QuestionResponse = mongoose.model('QuestionResponse');
const passport = require('passport');

exports.signIn = (req, res) => {
  res.redirect('/');
};

exports.getCurrentUser = (req, res) => {
  res.send(req.user);
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.login = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      return res.status(400).send({error: info}); 
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      // return res.redirect('/users/' + user.username);
      res.send({ data: req.user });
    });
  })(req, res, next);
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ notLoggedIn: 'You need to be logged in!' });
  }

  if (req.body.name) req.user.name = req.body.name;
  if (req.body.email) req.user.email = req.body.email;
  if (req.body.semester) req.user.semester = parseInt(req.body.semester);

  // Save the user
  await req.user.save();
  res.json({ profileUpdated: 'Profile Updated Successfully!' });
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ notLoggedIn: 'You need to be logged in!' });
  }

  const quizHistoryId = req.user.quizHistory;
  const questionResponseId = req.user.questionResponse;

  const quizHistoryPromise = QuizHistory.findByIdAndRemove(quizHistoryId);
  const questionResponsePromise = QuestionResponse.findByIdAndRemove(
    questionResponseId
  );
  const userPromise = User.findByIdAndRemove(req.user._id);

  const result = await Promise.all([
    quizHistoryPromise,
    questionResponsePromise,
    userPromise
  ]);

  res.json({ message: 'Account deleted successfully!' });
};
