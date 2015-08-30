// load in our dependencies
var express = require("express");
var router = express.Router();
var Movie = require("../db/connection").models.Movie;
var User = require("../db/connection").models.User;

function error(res, req){
  response.status(500);
  response.json({error: message})
}

//GET a user's movies--but we only want to show the movies that have been saved by the current user, so we build in a level where we find the User object for the current user; then, using the current user's id, we return all movies that have that user_id as an attribute.
router.get("/movies", function(req, res){
  User.findOne({ where: {twitterId: req.session.profile.id}})
  .then(function(user){
    Movie.findAll({where: {userId: user.id}})
    .then(function(movies, err){
        res.json(movies);
        //console.log(err);
    })

  });
});

//POST to movies--similar to above, we want to save this movie AND associate it with the current user, so the first level of this route returns the current user object, and the .then function creates the movie object using the user's id and returns the new movie as json. 
router.post("/movies", function(req, res){
    User.findOne({ where: {twitterId: req.session.profile.id }}).then(function(user){
        var movie = {
            title: req.body.title,
            userId: user.id
        };
      Movie.create(movie).then(function(movie, err){
        res.json(movie);
        //console.log(err);
        });
    })

  });


//////////////////// below are the routes for updating and deleting. They are commented out because this app doesn't need that functionality yet, but you can see the similarities between things like POST and PATCH.

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
// router.delete("/movies/:id", function(req, res){
//   Movie.findById(req.params.id).then(function(movie){
//     if(!movie) return error(res, "not found");
//     movie.destroy().then(function(){
//       res.json({success: true});
//     });
//   });
// });

module.exports = router;
