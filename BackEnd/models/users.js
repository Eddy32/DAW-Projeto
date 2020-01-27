const mongoose = require('mongoose')


var usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateBirth: String,
    email: {type: String, required:true},
    password: {type: String, required: true},
    gender: String,
    foto: { type: String, default: 'istoAindaVaiSerMelhorDefinido'},
    bio: {type: String, default: "Parece que este utilizador gosta de manter um certo mistério em relção a si :)"},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}]//,
    //privacidade: {type: Boolean, default: false}, <- cena para o futuro
  });




module.exports = mongoose.model('users', usersSchema)

