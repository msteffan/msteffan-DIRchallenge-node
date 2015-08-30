var express = require("express");
var app = express();
var path = require("path");
var session = require("express-session");
app.use(session({
  secret: "some secret"
}))
var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var db = require("./db/connection");
var pg = require('pg');


pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use("/", express.static(path.join(__dirname + "/public")));
app.set("view engine", "hbs");

var fs = require("fs")
if (fs.existsSync("./env.js")){
 console.log("yes")
 var env = require("./env");
}
else {
 var env = process.env;
}


var passport = require("passport")
var TwitterStrategy = require("passport-twitter").Strategy;
passport.use(new TwitterStrategy({
  consumerKey: env.consumerKey,
  consumerSecret: env.consumerSecret,
  callbackUrl: env.callbackUrl
  },
   function(accessToken, refreshToken, aProfile, done) {
      token = accessToken
      tokenSecret = refreshToken
      profile = aProfile

      db.models.User.findOrCreate({where: {
          twitterId: profile.id
      }}).then(function(user, created) {
        //   console.log(user);
          return done(null, user)
        // console.log(user.get({
        //   plain: true
        // }))
        console.log(created)
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize())
app.use(passport.session())


var usersController = require("./controllers/users");
var moviesController = require("./controllers/movies");

app.use(function(req, res, callback){
//console.log("req user is", req.user);
    if (req.user){
        res.locals.user = req.user
        // res.locals.twitterId = req.user[0]["twitterId"]
        // res.locals.url = "/users/" + req.user[0]["id"]

        console.log(req.user[0]["spotifyId"]);
    }
    callback();
})


app.get("/", function(req, res){
  res.render("index", {})
});


app.use("/", usersController);
app.use("/", moviesController);


app.get('/auth/twitter',
  passport.authenticate('twitter', {
      failureRedirect: '/login',
      successRedirect: "/"
   })
  );

// app.get('/auth/twitter/callback',
//   passport.authenticate('twitter'), function(req, res) {
//      // console.log("I am here", profile);
//       req.session.token = token
//       req.session.tokenSecret = tokenSecret
//       req.session.profile = profile
//
//     // Successful authentication, redirect home.
//       res.redirect('/');
//   });
app.get("/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function(req, res) {
    db.models.User.find({
      where: {
        "twitter_id": req.session.passport.user.id
      }
    }).then(function(user){
      if(!user){
        User.create({
          twitter_id: req.session.passport.user.id
        }).then(function(user){
          userId = user.id
          return user;
        });
      }
      else {
        console.log("user already exists")
        userId = user.id
        return user;
      }
    })
    req.session.token = token
    req.session.tokenSecret = tokenSecret
    req.session.profile = profile
    res.redirect("/");
  }
);


app.get("/signout", function(req, res){
    req.session.destroy()
    res.redirect("/")
  })

  app.listen(process.env.PORT || 3001, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
