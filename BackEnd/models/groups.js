const mongoose = require('mongoose')

var groupsSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    name: String,
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    pendent : [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    needRequest: {type: Boolean, default: false},
    visible: {type: Boolean, default: true},
    date: {type: String, default: new Date().getTime()},
    bio: String,
  });

  groupsSchema.pre("save",function(next) {
    if (this.users.length==0)
      this.users.push(this.owner);
    if (this.admins.length==0)
      this.admins.push(this.owner);
    console.log("DATA: " + this.date)
    if(!this.bio){
      const words = (""+ new Date(parseInt(this.date))).split(' GMT');
      this.bio = "Novo Grupo! Criado em: " + words[0];
    }
    next();
  });

module.exports = mongoose.model('groups', groupsSchema)
