var Post = require('../models/posts')


//todos os posts
module.exports.listar = () => {
    return Post
        .find()
        .exec()
}

//post por id
module.exports.consultar = id => {
    return Post
        .findOne({_id: id})
        .exec()
}

//todos os posts de um user
module.exports.filtrarUser = pid => {
    return Post
        .find({owner: pid})
        .exec()
}

//todos os posts de um grupo
module.exports.filtrarGroup = pid => {
    return Post
        .find({group: pid})
        .exec()
}

//todos os posts de um user
module.exports.filtrarUser = pid => {
    return Post
        .find({owner: pid})
        .exec()
}

//inserir novo posto
module.exports.inserir = u => {
    var novo = new Post(u)
    return novo.save()
}




//inserir novo Comment
module.exports.addComment = (idP,comment) => {
    return Post
    .update(
        { _id: idP },
        { $push: { comments: comment } }
      )
    .exec()
}

//inserir novo ficheiro
module.exports.addFile = (idP,file) => {
    return Post
    .update(
        { _id: idP },
        { $set: { ficheiro: file } }
      )
    .exec()
}


//todos os posts com uma hashtag
module.exports.withHashtag = hashtg => {
    return Post
        .find({hashtag: hashtg})
        .exec()
}

//conta hashtags
module.exports.countHashtags = hashtg => {
    return Post
        .aggregate([
            {
              "$unwind": "$hashtag"
            },
            {
              "$group": {
                "_id": "$hashtag",
                "value": {
                  "$sum": 1
                }
              }
            },
            {
              "$project": {
                "_id": 0,
                "value": 1,
                "x": "$_id"
                
              }
            }
          ])
        .exec()
}


//remove Comment
module.exports.removeComment = (idP,idC) => {
    return Post.update(
        { _id: idP },
        { $pull: {comments: {_id: idC}} })
        .exec()
}

//remove Comment
module.exports.allTopic = idT => {
    return Post
        .find({idTopic: idT})
        .sort({date: -1})
        .exec()
}

//incrementar os likes
/*
module.exports.incrementLikes = idP => {
    return Post
        .update(
            { _id: idP },
            { $inc: { likes: 1 } }
          )
        .exec()
}
*/
module.exports.incrementLikes = (idP,idU) => {
    return Post
        .update(
            { _id: idP },
            { $push: { likes: idU }, $inc: {NumLikes:1}}
          )
        .exec()
}
//decrementa like
module.exports.decrementLikes = (idP,idU) => {
    return Post
        .update(
            { _id: idP },
            { $pull: { likes: idU }, $inc: {NumLikes:-1}}
          )
        .exec()
}

module.exports.getLikesList = (idP) => {
    return Post
        .find(
            { _id: idP },
            {_id:0,likes:1}
          )
        .exec()
}




//hashtags existentes alfabeticamente
module.exports.hashtags = () => {
    return Post
        .distinct("hashtag")
        .sort()
        .exec()
}

//posts que contenham hashtag
module.exports.postsByHashtag = hashtag => {
    return Post
        .find({"hashtag": hastag})
        .exec()
}




