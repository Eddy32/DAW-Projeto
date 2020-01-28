const mongoose = require('mongoose')


var commentsSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
  text: String,
  likes: {type: Number, default: 0},
  date: {type: String, default: new Date().getTime()}
});


var postsSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    idTopic: {type: mongoose.Schema.Types.ObjectId, ref: 'topics', required: true},
    idGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true},
    text: String,
    imagem: String,
    title: {type: String, required: true},
    hashtag: [String],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    NumLikes: {type: Number, default: 0},
    comments: [commentsSchema],
    ficheiroName: String,
    ficheiroMimeType: String,
    ficheiroSize: Number,
    date: {type: String, default: new Date()},
    group: String
  });

  postsSchema.pre("save",function(next) {
    if(this.date)
      this.date = new Date().getTime();
    next();
  });



module.exports = mongoose.model('posts', postsSchema)

