var express = require('express');
var router = express.Router();
var Posts = require('../controllers/posts')

/* GET users listing. */
router.get('/', function(req, res) {
  if(req.query.participante){
    Posts.filtrarParticipante(req.query.participante)
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
  }
  else{
    Posts.listar()
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))

  } 
});


//obter um post por id
router.get('/:id', function(req, res) {
  Posts.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//like no post
router.get('/byTopic/:id', function(req, res) {
  Posts.allTopic(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//todos os posts de um topico
router.get('/byTopic/:id', function(req, res) {
  Posts.allTopic(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//--------------------------------------------------POST


//deixar a joinha no post
router.post('/:id/like/:idU', function(req,res){
  var flag;
  Posts.getLikesList(req.params.id)
    .then(likes =>{
        console.log("LISTA DE LIKES: " + likes.toString() + "AHAH" + req.params.idU + "teste" + likes.data)
        flag = likes.toString().includes(req.params.idU);
        if(!flag){
          Posts.incrementLikes(req.params.id,req.params.idU)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
        }
        else{
          Posts.decrementLikes(req.params.id,req.params.idU)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
        }
        console.log("DENTRO: " + flag)
    })
    .catch(e => res.status(500).jsonp(e))

  console.log("LI: " + flag)


  
})



//add comment ao post
router.post('/:id/addComment', function(req,res){
  console.log("MOSTRA BODY: " + req.body + "DADO: " + req.body.owner)
  Posts.addComment(req.params.id,req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})





//remove comment do post
router.post('/:id/rmComment', function(req,res){
  var idComm = req.query.comment
  Posts.removeComment(req.params.id,idComm)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})

router.post('/', function(req,res){
  Posts.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})








module.exports = router;