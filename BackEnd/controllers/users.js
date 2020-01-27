var Utilizador = require('../models/users')

//----------------GET'S

//Lista todos os users 
module.exports.listar = () => {
    return Utilizador
        .find()
        .exec()
}

//mostra o user atraves do _id
module.exports.consultar = id => {
    return Utilizador
        .findOne({email: id})
        .exec()
}

module.exports.consultarVarios = arrayID => {
    return Utilizador
        .find({ 
        _id: {
            $in: arrayID
        }
      });
}

module.exports.consultarID = id => {
    return Utilizador
        .findOne({_id: id})
        .exec()
}

//------------------PUT'S

//insere o user U
module.exports.inserir = u => {
    var novo = new Utilizador(u)
    return novo.save()
}

//adiciona amigo
module.exports.inserir = u => {
    var novo = new Utilizador(u)
    return novo.save()
}

//



//Update

