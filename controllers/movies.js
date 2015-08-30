
var express = require("express");
var router = express.Router();
var Movie = require("../db/connection").models.Movie;
var User = require("../db/connection").models.User;

function error(res, req){
  response.status(500);
  response.json({error: message})
}

//GET a user's movies
router.get("/movies", function(req, res){
  User.findOne({ where: {twitterId: req.session.profile.id}})
  .then(function(user){
    Movie.findAll({where: {userId: user.id}})
    .then(function(movies, err){
        //console.log("I worked", movies);
        res.json(movies);
        //console.log(err);
    })

  });
});

//POST to movies
router.post("/movies", function(req, res){
    User.findOne({ where: {twitterId: req.session.profile.id }}).then(function(user){
        var movie = {
            title: req.body.title,
            // imdbId: req.body.imdId,
            userId: user.id
        };
      Movie.create(movie).then(function(movie, err){
        res.json(movie);
        //console.log(err);
        });
    })

  });

//patch specific movie
// router.patch("/movies/:id", function(req, res){
//   Movie.findById(req.params.id).then(function(movie){
//     if(!movie) return error(res, "not found");
//     movie.updateAttributes(req.body).then(function(updatedMovie){
//       res.json(updatedMovie);
//     });
//   });
// });

//DELETE specific movie
router.delete("/movies/:id", function(req, res){
  Movie.findById(req.params.id).then(function(movie){
    if(!movie) return error(res, "not found");
    movie.destroy().then(function(){
      res.json({success: true});
    });
  });
});

module.exports = router;
