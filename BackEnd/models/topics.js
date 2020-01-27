const mongoose = require('mongoose')

var topicsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    idGrupo: {type: mongoose.Schema.Types.ObjectId, ref: 'groups',required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'users',required: true}
  });

module.exports = mongoose.model('topics', topicsSchema)