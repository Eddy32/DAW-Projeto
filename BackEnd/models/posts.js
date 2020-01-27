const mongoose = require('mongoose')


var commentsSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
  text: String,
  imagem: String,
  likes: {type: Number, default: 0},
  date: {type: String, default: new Date().getTime()}
});

var postsSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    idTopic: {type: mongoose.Schema.Types.ObjectId, ref: 'topics', required: true},
    text: String,
    imagem: String,
    title: {type: String, required: true},
    hashtag: [String],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    NumLikes: {type: Number, default: 0},
    comments: [commentsSchema],
    date: {type: String, default: new Date().getTime()},
    group: String
  });





module.exports = mongoose.model('posts', postsSchema)

