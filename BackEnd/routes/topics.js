var express = require('express');
var router = express.Router();
var Topics = require('../controllers/topics')

/* GET users listing. */
router.get('/', function(req, res) {
  if(req.query.participante){
    Topics .filtrarParticipante(req.query.participante)
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
  }
  else{
    Topics .listar()
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))

  } 
});

router.get('/:idG', function(req, res) {
  Topics .topicsGroup(req.params.idG)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});


router.get('/:id', function(req, res) {
  Topics .consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', function(req,res){
  Topics.inserir(req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})

router.post('/:id/remove', function(req,res){
    Topics.removeOne(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
  })


  
module.exports = router;