let express = require('express');
let csurf   = require('csurf');
let passport= require('passport');

let Product = require('../models/product');

let csrfProtection = csurf();
let router = express.Router();

//add a csurf protection by middleware
router.use(csrfProtection);

/* GET home page. */

router
  .route("/user/signup")
  .get( (req, res, next)=>{
    let messages = req.flash('error');
    res.render("user/signup", {csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0});
  })
  .post(passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));

  router
    .route("/user/signin")
    .get( (req, res, next)=>{
      let messages = req.flash('error');
      res.render("user/signin", {csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0});
    })
    .post(passport.authenticate('local.signin', {
      successRedirect: '/user/profile',
      failureRedirect: '/user/signin',
      failureFlash: true
    }));

router.get('/user/profile', (req, res, next) => {
  res.render('user/profile');
});

router.get('/', function(req, res, next) {
  Product.find((err, docs) => {
    let productsChunk = [], chunkSize = 3;
    for (var i = 0; i < docs.length; i+= chunkSize) {
      productsChunk.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'The freaking awesome shopping cart', products: productsChunk });
  });
});


module.exports = router;
