let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

//when user save in session vars
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//when retereive user by id save in session
passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(error, user);
  });
});

//signup Strategy
passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, (req, email, password, done) => {
      req.checkBody('email', 'Invalid email').notEmpty().isEmail();
      req.checkBody("password", 'Password very short').notEmpty().isLength({min: 3});
      let errors = req.validationErrors();
      if(errors) {
        let messages = [];
        errors.forEach(error => {
          messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages));
      }
      console.log("sssssss");
      User.findOne({"email": email}, (err, user) => {
        console.log("========>");
        if(err) return done(err);
        if(user) return done(null, false, {message: 'Email already exist!'});
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.hashPassword(password);
        console.log("newUse  =====> ", newUser);
        newUser.save((error, result) => {
          console.log("passport ===>", err, user)
          if(error) return done(error);
          return done(null, newUser);
        });
      });
    }
  )
);

//login Strategy
passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    }, (req, email, password, done) => {
      req.checkBody('email', 'Invalid email').notEmpty().isEmail();
      req.checkBody("password", 'Password very short').notEmpty();
      let errors = req.validationErrors();
      if(errors) {
        let messages = [];
        errors.forEach(error => {
          messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages));
      }
      User.findOne({email}, (error, user) => {
        if(error) return done(error);
        if(!user) return done(null, false, {message: 'User not found'});
        if(!user.validePassword(password)) return done(null, false, {message: "Wrong password"});
        console.log("after check user", user);
        return done(null, user);
      });
    }
  )
);
