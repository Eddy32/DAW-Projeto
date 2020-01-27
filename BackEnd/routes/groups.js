var express = require('express');
var router = express.Router();
var Groups = require('../controllers/groups')

/* GET users listing. */
router.get('/', function(req, res) {
    Groups.listar()
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e)) 
});

router.get('/:id', function(req, res) {
  Groups.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//Criar novo grupo
router.post('/', function(req,res){
  Groups.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/:id/rmMember',function(req,res){
  var idM = req.query.membro
  Groups.removeMember(req.params.id,idM)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//membro entrar num grupo publico 
router.post('/:id/addMember',function(req,res){
  var idM = req.query.membro
  Groups.addMember(req.params.id,idM)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//aceita pedido para grupo
router.post('/:id/accpetRequest',function(req,res){
  var idM = req.query.membro
  Groups.acceptRequest(req.params.id,idM)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);

//coloca pedido para grupo
router.post('/:id/addRequest',function(req,res){
  var idM = req.query.membro
  Groups.addRequest(req.params.id,idM)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);

//nega pedido
router.post('/:id/denyRequest',function(req,res){
  var idM = req.query.membro
  Groups.denyRequest(req.params.id,idM)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))

});

router.post('/:id/changeBio',function(req,res){
  var bio = req.query.bio
  if (bio){
  Groups.changeBio(req.params.id,bio)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
  }
});

router.post('/:id/changeName',function(req,res){
  var name = req.query.name
  if(name){
  Groups.changeName(req.params.id,name)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
  }
});

//coloca pedido para grupo
router.post('/:id/addRequest',function(req,res){
  var idM = req.query.membro
  Groups.addRequest(req.params.id,idM)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);


//adiciona admin
router.post('/:id/addAdmin/:idU',function(req,res){
  Groups.addAdmin(req.params.id,req.params.idU)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);

//remove admin
router.post('/:id/rmAdmin/:idU',function(req,res){
  Groups.rmAdmin(req.params.id,req.params.idU)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
}
);


//Criar novo topico
router.post('/:id/addTopic', function(req,res){
    Groups.inserirTopico(req.params.id,req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

//Criar novo topico
router.post('/:id/addPost', function(req,res){
  Groups.inserirTopico(req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

module.exports = router;
