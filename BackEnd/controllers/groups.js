var Group = require('../models/groups')


//todos os grupos
module.exports.listar = () => {
    return Group
        .find()
        .exec()
}

//grupo por id
module.exports.consultar = id => {
    return Group
        .findOne({_id: id})
        .exec()
}

//remove membro
module.exports.removeMember = (idG,idM) => {
    return Group.update(
        { _id: idG },
        { $pull: { 'users': idM } }
      );
}

//adiciona membro
module.exports.addMember = (idG,idM) => {
    return Group.update(
        { _id: idG },
        { $push: { 'users': idM } }
      );
}

//adiciona admin
module.exports.addAdmin = (idG,idM) => {
    return Group.update(
        { _id: idG },
        { $push: { 'admins': idM } }
      );
}

//remove admin
module.exports.rmAdmin = (idG,idM) => {
    return Group.update(
        { _id: idG },
        { $pull: { 'admins': idM } }
      );
}

//cria grupo
module.exports.inserir = group => {
    var novo = new Group(group)
    return novo.save()
}


//altera bio
module.exports.changeBio = (idG,bio) => {
    return Group.update(
        { _id: idG },
        { $set: { 'bio': bio } }
      );
}

//altera nome
module.exports.changeName = (idG,name) => {
    return Group.update(
        { _id: idG },
        { $set: { 'name': name } }
      );
}


//adiciona pedido para entrar no grupo
module.exports.addRequest = (idG,idU) => {
    return Group.update(
        { _id: idG },
        { $push: { 'pendent' : idU } }
      );
}

//nega pedido para entrar
module.exports.denyRequest = (idG,idU) => {
    return Group.update(
        { _id: idG },
        { $pull: { 'pendent' : idU } }
      );
}


//aceita pedido para entrar no grupo
module.exports.acceptRequest = (idG,idU) => {
    return Group.update(
        { _id: idG },
        { $pull: { 'pendent' : idU }, $push: { 'users' : idU }  }
      );
}

//todos os grupos de um user
module.exports.groupsByUser = idU => {
    return Group
        .find(
            {users: idU}
            )
        .exec()

}





























//insere novo topico
module.exports.inserirTopico = (topic,novo) =>{
    //var top = new Topic(novo)
    //return top.save()
    return Group.update(
        { _id : topic } ,
        {$addToSet : 
            { topics : novo
            } 
        }
    )
}

//devolve um topico

//insere novo Post
module.exports.inserirPost = post =>{
    var novo = new Post(post)
    return novo.save()
}

//insere nova comentario
module.exports.inserirPost = comment =>{
    var novo = new Comment(comment)
    return novo.save()
}



