var Topic = require('../models/topics')

module.exports.listar = () => {
    return Topic
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Topic
        .findOne({_id: id})
        .exec()
}

module.exports.topicsGroup = idG => {
    return Topic
        .find({idGrupo: idG})
        .exec()
}


module.exports.inserir = topic => {
    var novo = new Topic(topic)
    return novo.save()
}

module.exports.removeOne = idTopic => {
    return Topic
        .deleteOne({_id: idTopic})
        .exec()
}
