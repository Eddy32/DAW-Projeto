var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')
var bcrypt = require('bcryptjs')
const fs = require('fs')


var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

router.get('/cloud', function(req, res){
  res.render('cloud')
})


////////////////Rotas que nao necessitam de autenticação
//Get's
router.get('/login', function(req,res){
  res.render('layouts/loginForm')
  })
  
router.get('/register', function(req,res){
    res.render('layouts/registerForm')
  })

//POST
router.post('/login', passport.authenticate('local', 
{ successRedirect: '/feed',
  successFlash: 'Utilizador autenticado com sucesso!',
  failureRedirect: '/login',
  failureFlash: 'Utilizador ou password inválido(s)...'
})
)

router.post('/reg', function(req,res){
var hash = bcrypt.hashSync(req.body.password, 10);
axios.post('http://localhost:5003/utilizadores', {
 
  email: req.body.email,
  name: req.body.name,
  password: hash
})
  .then(dados => res.redirect('/'))
  .catch(e => res.render('error', {error: e}))
})

////////////////Rotas que necessitam de autenticação 

//------------------------------------------------------------------Get's
//Operaçoes do Sistema base
router.get('/', verificaAutenticacao, function(req, res) {
  res.redirect('/login')
});

//Operaçoes do Sistema base
router.get('/groups', verificaAutenticacao, function(req, res) {
  axios.get('http://localhost:5003/groups/' )
    .then(dados => res.render('layouts/groups', {lista: dados.data, user: req.user}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/credits', verificaAutenticacao, function(req, res) {
  res.render('layouts/credits',{user: req.user})
});

router.get('/profile', function(req, res){
  axios.get('http://localhost:5003/groups/fromUser/'+ req.user._id)
  .then(dados => res.render('layouts/profile', {user: req.user, nrGrupos: dados.data.length}))

  /*
  axios.get('http://localhost:5003/user/'+req.params.id)
       .then(dados => res.render('layouts/profile', {nome: "Inês", dataAniv:"2 de nov", foto:"", nrFriends: "2", nrGrupos:"4", bio:"bio"}))
       .catch(e => res.render('error', {error: e}))*/
})


router.get('/users/:idU/editProfile', verificaAutenticacao, function(req, res){
  console.log("mipeeee")
  axios.get('http://localhost:5003/utilizadores/byID/'+ req.params.idU)
       .then(dados => res.render('layouts/editProfile', {user:req.user}))
   //acho que é preciso fazer um post para isto
})

router.get('/checkProfile/:idU', verificaAutenticacao, function(req, res){
  axios.get('http://localhost:5003/utilizadores/byID/'+ req.params.idU)
       .then(dados => {
          axios.get('http://localhost:5003/groups/fromUser/'+ req.params.idU)
            .then(grupos => res.render('verProfile', {user:req.user, utilizador: dados.data, nr: grupos.data.length })) 
       }) 
   //acho que é preciso fazer um post para isto
})

router.get('/allUsers', verificaAutenticacao, function(req, res){
  axios.get('http://localhost:5003/utilizadores/allUsers')
       .then(dados => res.render('allUsers', {user: req.user,lista: dados.data}))
})

router.get('/allFriends', verificaAutenticacao, function(req, res){
  if(req.user.friends.length>0){
  axios.get('http://localhost:5003/utilizadores/'+ req.user._id +'/friends')
    .then(amigos => {
      axios.get('http://localhost:5003/utilizadores/multiple?array='+ amigos.data.friends)
        .then(membros => {
          res.render('allFriends', { user: req.user, lista: membros.data })
        })
        .catch(erro => {
          res.render('error',{error: erro})
        })
    })
    .catch(erro => {
      res.render('error',{error: erro})
    })
  }
  else res.render('allFriends', { user: req.user, lista: [] })

})



router.get('/hashtag', verificaAutenticacao, function(req, res){
  axios.get('http://localhost:5003/posts/countHashtags')
       .then(dados => {
          //var tags = JSON.stringify(dados.data);
          //console.log(tags)
          res.render('hastag', {lezgo: dados.data}) 
      })
})



// Grupo de um determinado tópico (not sure disto)
router.get('/group/:topic', verificaAutenticacao, function(req, res){
  axios.get('http://localhost:5003/group/'+req.params.topic)
      .then(dados => res.render('layouts/group', {lista:dados.data, hashtags:["tag1", "tag2", "tag3"], posts:[{title:"post1", text:"text1"}, {title:"post2", text:"text2"}],coisa:"bio", foto:req.user.foto, nome:req.user.name, hora:new Date().getMinutes()}))
      .catch(erro => res.render('error', {error:erro}))
})

router.get('/post/:id', verificaAutenticacao, function(req,res){
  axios.get('http://localhost:5003/posts/'+req.params.id)
      .then(dados => res.render('layouts/singlePost', {lista: dados.data, comentarios:["comment1", "comment2"], foto:req.user.foto, dono:req.user.name, hora: new Date().getMinutes()}))
      .catch(e => res.render('error', {error: e}))
  })


router.get('/eventos/:id', verificaAutenticacao, function(req,res){
axios.get('http://localhost:5003/eventos/' + req.params.id)
    .then(dados => res.render('evento', {evento: dados.data}))
    .catch(e => res.render('error', {error: e}))
})

router.get('/logout', verificaAutenticacao, function(req,res){
req.logout()
res.redirect('/login')
})

router.get('/feed',verificaAutenticacao, function(req,res){
  res.render('mainpage', {user: req.user})
})

/////Grupos
///Ve os grupos
router.get('/groupsteste',verificaAutenticacao, function(req, res){
  axios.get('http://localhost:5003/groups/' )
    .then(dados => res.render('grupos', {lista: dados.data, user: req.user}))
    .catch(e => res.render('error', {error: e}))
  //res.render('layouts/groups')
})

//pagina para criar grupo
router.get('/criaGrupo',verificaAutenticacao, function(req, res){
  res.render('criaGrupo',{owner: req.user})
})

//topicos de um grupo e os seus users
router.get('/groups/:id',verificaAutenticacao, function(req, res){
  console.log("\n\n\n\n\n///////////////////////" + req.params)
  axios.get('http://localhost:5003/groups/'+ req.params.id)
    .then(grupo => {
      console.log("\n\n\n\n\n///////////////////////" + req.params),
      axios.get('http://localhost:5003/utilizadores/multiple?array='+ grupo.data.users)
        .then(membros => {
          console.log("\n\n\n\n\n/---------//////////////" + req.params),
          axios.get('http://localhost:5003/topics/'+req.params.id )
            .then(dados => {
              if(grupo.data.pendent.length>0){
                axios.get('http://localhost:5003/utilizadores/multiple?array='+ grupo.data.pendent)
                  .then(penden => {
                    console.log("LALA: " + penden.data.toString())
                    if(grupo.data.users.includes(req.user._id)){
                      console.log("FAZES PARTE: " + req.user._id + "No grupo: " + grupo.data._id)
                      res.render('topics', {lista: dados.data,members: membros.data,user: req.user,group: grupo.data,pendentes: penden.data})
                    }else
                    res.redirect('/groups')
                      
                  })
                  .catch(erro => {
                    res.render('error',{error: erro})
                  })
              }
              else 
                if(grupo.data.users.includes(req.user._id)){
                  console.log("FAZES PARTE: " + req.user._id + "No grupo: " + grupo.data._id)
                  res.render('topics', {lista: dados.data,members: membros.data,user: req.user,group: grupo.data,pendentes: []})
                }else{ 
                  if(!grupo.data.needRequest)
                    res.render('topics', {lista: dados.data,members: membros.data,user: req.user,group: grupo.data,pendentes: []})
                  else res.redirect('/groups')
                }

                



            })
            .catch(erro => {
              res.render('error',{error: erro})
            })
        })
        .catch(erro => {
          res.render('error',{error: erro})
        })
    })
    .catch(erro => {
      res.render('error',{error: erro})
    })
})


//ver membros pendentes de um grupo
router.get('/group/:id/viewPendent', verificaAutenticacao, function(req,res){
  axios.get('http://localhost:5003/groups/'+ req.params.id)
    .then(dados => {
      if(dados.data.pendent.length>0){
      console.log("USERS PENDENTES: " + dados.data.pendent.length)
      axios.get('http://localhost:5003/utilizadores/multiple?array='+ dados.data.pendent)
        .then(membros => {
          res.render('showMembers', { dado: dados.data, ents: membros.data, user:req.user })
        })
        .catch(erro => {
          res.render('error',{error: erro})
        })
      }
      else res.render('showMembers', { dado: dados.data, ents: [], user:req.user })

    })
    .catch(erro => {
      res.render('error',{error: erro})
    })
})

//remover um membro a um grupo
router.get('/removeMember/:id', verificaAutenticacao, function(req,res){
  axios.get('http://localhost:5003/groups/'+ req.params.id)
    .then(dados => {
      axios.get('http://localhost:5003/utilizadores/multiple?array='+ dados.data.users)
        .then(membros => {
          res.render('removeMember', { dado: dados.data, ents: membros.data })
        })
        .catch(erro => {
          res.render('error',{error: erro})
        })
    })
    .catch(erro => {
      res.render('error',{error: erro})
    })
})


/*
router.get('/groups2/:id', function(req, res){
  axios.get('http://localhost:5003/groups/'+ req.params.id)
    .then(dados => {
      axios.get('http://localhost:5003/utilizadores/multiple?array='+ dados.data.users)
        .then(membros => {
          res.render('grupos2', { dado: dados.data, ents: membros.data })
        })
        .catch(erro => {
          res.render('error',{error: erro})
        })
    })
    .catch(erro => {
      res.render('error',{error: erro})
    })
  //res.render('layouts/groups')
})
*/




router.get('/groups/:idG/topic/:idT',verificaAutenticacao, function(req, res){
   axios.get('http://localhost:5003/posts/byTopic/' + req.params.idT )
        .then(topics => {
          axios.get('http://localhost:5003/groups/'+ req.params.idG)
            .then(dados => {
              axios.get('http://localhost:5003/utilizadores/multiple?array='+ dados.data.users)
                .then(membros => {
                  res.render('layouts/posts', {lista: topics.data, idG:req.params.idG, idT: req.params.idT,user:req.user, members: membros.data })
                })
                .catch(erro => {
                  res.render('error',{error: erro})
                })
            })
            .catch(erro => {
              res.render('error',{error: erro})
            })
          
        
        })

        .catch(e => res.render('error', {error: e})) 
    //res.render('layouts/groups') 
  })

router.get('/user/:id/viewRequests', verificaAutenticacao, function(req, res){
  if(req.user.pendent.length>0){
    axios.get('http://localhost:5003/utilizadores/multiple?array=' + req.user.pendent )
      .then(dados => res.render('friendsRequests', {lista: dados.data, user: req.user}))
    .catch(e => res.render('error', {error: e}))
  }
  else 
    res.render('friendsRequests', {lista: [], user: req.user})

})

router.get('/download/:fnome',verificaAutenticacao, function(req, res){
  res.download( __dirname + '/../public/ficheiros/' + req.params.fnome )
})


router.get('/addPost', verificaAutenticacao, function(req, res){
  res.render('layouts/createPost')
})

//------------------------------------------------------------------Post's

//autenticar no sistema
router.post('/login', passport.authenticate('local', 
{ successRedirect: '/feed',
  successFlash: 'Utilizador autenticado com sucesso!',
  failureRedirect: '/login',
  failureFlash: 'Utilizador ou password inválido(s)...'
})
)

//registar utilizador
router.post('/reg', function(req,res){
  console.log("GENDER:::: ")
var hash = bcrypt.hashSync(req.body.password, 10);
console.log("GENDER:::: " + req.body.gender)
axios.post('http://localhost:5003/utilizadores', {
 
  email: req.body.email,
  name: req.body.name,
  gender: req.body.gender,
  password: hash
})
  .then(dados => res.redirect('/'))
  .catch(e => res.render('error', {error: e}))
})




//get Hashtags
router.post('/getPostsHashtag', function(req,res){
  var hashtg = req.body.hashtg;
  console.log(" SADKBSAHKDSA" + hashtg);
  axios.get('http://localhost:5003/groups/fromUser/'+ req.user._id)
    .then(groups => {
      axios.get('http://localhost:5003/posts/byHashtag?hashtag='+ hashtg)
        .then(posts => {

          axios.get('http://localhost:5003/utilizadores/allUsers')
            .then(ut => {
              res.render('showPostsHashtag', { grupos: groups.data, postes: posts.data, utili: ut.data })
            })
         
        })
        .catch(erro => {
          res.render('error',{error: erro})
        })
    })
    .catch(erro => {
      res.render('error',{error: erro})
    })
  })

//adicionar pedido de amizade
router.post('/user/:idU/addRequest', function(req,res){
  var user = req.query.member;
  axios.post('http://localhost:5003/utilizadores/' + req.params.idU + '/addRequest?membro=' + user )
    .then(dados => res.redirect('/checkProfile/' + req.params.idU))
    .catch(e => res.render('error', {error: e}))
  })

//aceita pedido de amizade
router.post('/user/:idU/acceptMember', function(req,res){
  var user = req.query.member;
  axios.post('http://localhost:5003/utilizadores/' + req.params.idU + '/accpetRequest?membro=' + user )
    .then(dados => res.redirect('/user/'+req.user._id + '/viewRequests' ))
    .catch(e => res.render('error', {error: e}))
  })

//rejeita pedido de amizade 
router.post('/user/:idU/denyMember', function(req,res){
  var user = req.query.member;
  axios.post('http://localhost:5003/utilizadores/' + req.params.idU + '/denyRequest?membro=' + user )
    .then(dados => res.redirect('/user/'+req.user._id + '/viewRequests' ))
    .catch(e => res.render('error', {error: e}))
  })


//update infos
router.post('/users/:idU/updateInfos', function(req,res){
    axios.post('http://localhost:5003/utilizadores/changeInfo/' + req.params.idU + '?name=' + req.body.name + '&mail=' + req.body.email + '&bio=' + req.body.biografia )
      .then(dados => res.redirect('/profile/' ))
      .catch(e => res.render('error', {error: e}))
})
  

////Grupos
//remover um user de um grupo
router.post('/removeMember/:id/membro/:idM', function(req,res){
  axios.post('http://localhost:5003/groups/' + req.params.id + '/rmMember?membro=' + req.params.idM)
    .then(dados => res.redirect('/groups/'+req.params.id))
    .catch(e => res.render('error', {error: e}))
})

//user adicionar se a um grupo
router.post('/addMember/:id/membro/:idM', function(req,res){
  axios.post('http://localhost:5003/groups/' + req.params.id + '/addMember?membro=' + req.params.idM)
    .then(dados => res.redirect('/groups/'+req.params.id))
    .catch(e => res.render('error', {error: e}))
})

//criar um grupo
router.post('/criaGrupo', function(req,res){
  axios.post('http://localhost:5003/groups', {
   
    owner: req.user._id,
    name: req.body.name,
    bio: req.body.bio,
    visible: req.body.visible,
    needRequest: req.body.needRequest
  })
    .then(dados => res.redirect('/groups'))
    .catch(e => res.render('error', {error: e}))
  })

//criaPost  
router.post('/criaTopico/:idG', function(req,res){

  axios.post('http://localhost:5003/topics', {
    
    creator: req.user._id,
    title: req.body.title,
    idGrupo: req.params.idG
  })
    .then(dados => res.redirect('/groups/' + req.params.idG))
    .catch(e => res.render('error', {error: e}))
  })

//criar um topico
router.post('/criaGrupo', function(req,res){
  axios.post('http://localhost:5003/groups', {
   
    owner: req.user._id,
    name: req.body.name,
    bio: req.body.bio
  })
    .then(dados => res.redirect('/groups'))
    .catch(e => res.render('error', {error: e}))
  })


router.post('/addPost', upload.single('ficheiro'), function(req,res){

  if(req.file){
    let oldPath = __dirname + '/../' + req.file.path
    let newPath = __dirname + '/../public/ficheiros/' + req.file.originalname

    console.log("PATH ANTIGO : " + oldPath + "PATH NOVO: " + newPath)

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
    })

    var hashtagz = req.body.hashtag.split('#')
    hashtagz.shift();
    axios.post('http://localhost:5003/posts', {
    title: req.body.title,
    text: req.body.text,
    hashtag: hashtagz,
    idTopic: req.query.idT,
    idGroup: req.query.idG,
    owner: req.user._id,
    ficheiroName: req.file.originalname,
    ficheiroMimeType: req.file.mimetype,
    ficheiroSize: req.file.size
    })
      .then(dados => res.redirect('/groups/' + req.query.idG + '/topic/' + req.query.idT))
      .catch(e => res.render('error', {error: e}))
  }
  else{
    var hashtagz = req.body.hashtag.split('#')
    hashtagz.shift();
    axios.post('http://localhost:5003/posts', {
    title: req.body.title,
    text: req.body.text,
    hashtag: hashtagz,
    idTopic: req.query.idT,
    idGroup: req.query.idG,
    owner: req.user._id
    })
      .then(dados => res.redirect('/groups/' + req.query.idG + '/topic/' + req.query.idT))
      .catch(e => res.render('error', {error: e}))

  }



})

router.post('/addComent', function(req,res){
  console.log("TESXTAO: "  +req.body.texto + "- " + req.query.idP )
  axios.post('http://localhost:5003/posts/' + req.query.idP + '/addComment' , {
    owner: req.user._id,
    text: req.body.texto
  })
    .then(dados => res.redirect('/groups/' + req.query.idG + '/topic/' + req.query.idT))
    .catch(e => res.render('error', {error: e}))
})


router.post('/addComment', function(req,res){
  console.log("não chega aquiiiii :(")
  axios.post('http://localhost:5003/posts/'+req.body._id+'/addComment', {
   owner: req.user._id,
   comments: req.body.comment
  })
    .then(dados => res.redirect(''))
    .catch(e => res.render('error', {error: e}))
})


//add/rm likes num post
router.post('/groups/:idG/topics/:idT/likePost/:idP', function(req,res){
  var user = req.query.user;
  axios.post('http://localhost:5003/posts/' + req.params.idP + '/like/' + user)
    .then(dados => res.redirect('/groups/'+req.params.idG+'/topic/'+req.params.idT))
    .catch(e => res.render('error', {error: e}))
  })


//remove topico
router.post('/groups/:idG/rmTopic/:idT', function(req,res){
  var user = req.query.user;
  axios.post('http://localhost:5003/topics/' + req.params.idT + '/remove')
    .then(dados => res.redirect('/groups/'+req.params.idG))
    .catch(e => res.render('error', {error: e}))
  })

//adiciona pedido para entrar num grupo
router.post('/groups/:idG/request', function(req,res){
  var user = req.query.member;
  axios.post('http://localhost:5003/groups/' + req.params.idG + '/addRequest?membro=' + user )
    .then(dados => res.redirect('/groups'))
    .catch(e => res.render('error', {error: e}))
  })

//aceita pedido para entrar num grupo
router.post('/groups/:idG/acceptMember', function(req,res){
  var user = req.query.member;
  axios.post('http://localhost:5003/groups/' + req.params.idG + '/accpetRequest?membro=' + user )
    .then(dados => res.redirect('/groups/'+req.params.idG ))
    .catch(e => res.render('error', {error: e}))
  })

//rejeita pedido para entrar num grupo
router.post('/groups/:idG/denyMember', function(req,res){
  var user = req.query.member;
  axios.post('http://localhost:5003/groups/' + req.params.idG + '/denyRequest?membro=' + user )
    .then(dados => res.redirect('/groups/'+req.params.idG ))
    .catch(e => res.render('error', {error: e}))
  })

//promote to admin
router.post('/groups/:idG/promoteAdmin/:idU', function(req,res){
  axios.post('http://localhost:5003/groups/' + req.params.idG + '/addAdmin/' + req.params.idU )
    .then(dados => res.redirect('/groups/'+req.params.idG ))
    .catch(e => res.render('error', {error: e}))
  })


//demote to admin
router.post('/groups/:idG/demoteAdmin/:idU', function(req,res){
  axios.post('http://localhost:5003/groups/' + req.params.idG + '/rmAdmin/' + req.params.idU  )
    .then(dados => res.redirect('/groups/'+req.params.idG ))
    .catch(e => res.render('error', {error: e}))
  })


//change user photo
router.post('/users/:idU/changeFoto', upload.single('foto'),  function(req,res){

  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../public/ficheiros/' + req.file.originalname


  fs.rename(oldPath, newPath, function (err) {
    if (err) throw err
  })




  var foto = req.file.originalname
  console.log("NOME DO FICHEIRO " + foto)
  axios.post('http://localhost:5003/utilizadores/' + req.user._id + '/changeFoto?foto=' + foto  )
    .then(dados => res.redirect('/users/'+req.params.idU+'/editProfile'))
    .catch(e => res.render('error', {error: e}))
  })
  




//função de autenticação no sistema  
function verificaAutenticacao(req,res,next){
  console.log("\n\n\n\n\nTESTEI AUTENTICAÇAO")
if(req.isAuthenticated()){
//req.isAuthenticated() will return true if user is logged in
  next();
} else{
  res.redirect("/login");}
}

module.exports = router;