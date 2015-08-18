var mongoose = require('./mongo_config');
var Schema = mongoose.Schema;
var timestamp = require('mongoose-timestamp');
var User = require('./user');

var QuestionSchema = Schema({
  creator     : {
    type      : Schema.Types.ObjectId,
    ref       : 'User'
  },
  difficulty  : Number,
  interviewee : {
    type      : String,
    enum      : ['Campus', 'Social']
  },
  title       : String,
  question    : {
    type      : String,
    text      : true
  },
  anwser      : {
    type      : String,
    text      : true
  }
});

QuestionSchema.plugin(timestamp);

var Question = mongoose.model('Question', QuestionSchema);

Question.saveWithCreator = function (args) {
  var question = new Question({
    creator: args.creator_id,
    difficulty: args.difficulty,
    interviewee: args.interviewee,
    category: args.category,
    title: args.title,
    question: args.question,
    anwser: args.anwser
  });
  question.save(function (err, question) {
    User.findOne({_id: question.creator}, function (err, user) {
      user.questions.push(question._id);
      user.save();
    });
  });
  Question.findOne({question: question.question}).populate('craetor').exec(function (e, d) {
    console.log(d);
  });
}

module.exports = Question;