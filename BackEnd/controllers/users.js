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

module.exports.getFriends = id => {
    return Utilizador
        .findOne({_id: id},{_id:0,friends:1})
        .exec()
}

module.exports.consultarID = id => {
    return Utilizador
        .findOne({_id: id})
        .exec()
}

//------------------PUT'S

module.exports.updateInfo = (idU,nome,mail,desc) => {
    return Utilizador.update(
        { _id: idU },
        {$set: 
            {name:nome,email:mail,bio:desc}
        }
      )
      .exec()
}

module.exports.addFriendRequest = (idU,idA) => {
    return Utilizador.update(
        { _id: idU },
        { $push: { 'pendent' : idA } }
      );
}

//nega pedido para entrar
module.exports.denyFriendRequest = (idU,idA) => {
    return Utilizador.update(
        { _id: idU },
        { $pull: { 'pendent' : idA } }
      );
}


//aceita pedido para entrar no grupo
module.exports.acceptFriendRequest = (idU,idA) => {
    Utilizador.update(
        { _id: idU },
        { $pull: { 'pendent' : idA }, $push: { 'friends' : idA }  }
      )
        .exec()

    return Utilizador.update(
        { _id: idA },
        { $push: { 'friends' : idU }  }
      );
}

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

// achange user foto
module.exports.changeFoto = (id,foto) => {
    return Utilizador
        .update({_id: id},
                {$set: 
                    {foto:foto}
                }
                )
        .exec()
}





//Update

