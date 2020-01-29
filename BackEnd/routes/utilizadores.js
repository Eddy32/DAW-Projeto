var express = require('express');
var router = express.Router();
var Utilizadores = require('../controllers/users')
var passport = require('passport')

/* GET users listing. */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  Utilizadores.listar()
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/allUsers', function(req, res) {
  Utilizadores.listar()
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/:id/friends', function(req, res) {
  Utilizadores.getFriends(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/multiple', function(req, res) {
  var arr = req.query.array.split(',');
  /*console.log("ENTREI AQUI WTF2")
  var novoArray = [];
  
  arr.forEach(function(item, index, array) {
     novoArray.push(new ObjectID(item))
  })
  console.log("DADOS NICE: " + arr)

  arr.forEach(function(item, index, array) {
    console.log("\nARRAY INICIAL: " + item ) 
 })


 novoArray.forEach(function(item, index, array) {
  console.log("\nARRAY PARA O MONGO: " + item ) 
})
*/
  Utilizadores.consultarVarios(arr)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/changeFoto/:idU', function(req,res){
  var foto = req.query.foto;
  Utilizadores.changeFoto(req.params.idU,foto)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})


router.get('/:email', passport.authenticate('jwt', {session: false}), function(req, res) {
  console.log("WTFFF")
  Utilizadores.consultar(req.params.email)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});


//aceita pedido para grupo
router.post('/:id/accpetRequest',function(req,res){
  var idA = req.query.membro
  Utilizadores.acceptFriendRequest(req.params.id,idA)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);

//coloca pedido para grupo
router.post('/:id/addRequest',function(req,res){
  var idA = req.query.membro
  Utilizadores.addFriendRequest(req.params.id,idA)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);

//nega pedido
router.post('/:id/denyRequest',function(req,res){
  var idA = req.query.membro
  Utilizadores.denyFriendRequest(req.params.id,idA)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))

});

//change infos
router.post('/changeInfo/:id',function(req,res){
  var idName = req.query.name
  var idMail = req.query.mail
  var idBio = req.query.bio
  Utilizadores.updateInfo(req.params.id,idName,idMail,idBio)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))

});


router.post('/', function(req,res){
  Utilizadores.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})

router.post('/:idU/changeFoto', function(req,res){
  var foto = req.query.foto;
  Utilizadores.changeFoto(req.params.idU,foto)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})


router.get('/byID/:id', function(req, res) {
  Utilizadores.consultarID(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

module.exports = router;
