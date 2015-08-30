var Movie = function(info){
  this.title = info.title;
  this.userId = info.userId;
  this.id= info.id;
}

// This function will make an ajax call to the server and return all movies. Then we push all of the movies into an array and retun the movies array
Movie.fetch = function(){
  var request = $.ajax({
          url: "http://127.0.0.1:3001/movies",
          method: "get"
      })
  .then(function(response) {
    var movies = []
    for(var i = 0; i < response.length; i++){
      movies.push(new Movie(response[i]))
    }
    // console.log(movies);
    return movies
    })
  .fail(function(response){
      console.log("js failed to load")
    })
  return request
}


/////// The functions below aren't currently in use so I've commented them out. However, you can see how we can build instance functions (similar to Ruby's instance methods) that would let us update and delete movies from a user's saved list.


// Movie.prototype = {
//     update: function(movieData) {
//       var self = this;
//
//       var url = "http://127.0.0.1:3001/movies" + this.id;
//       var request = $.ajax({
//         url: url,
//         method: "patch",
//         data: JSON.stringify(movieData),
//         contentType : 'application/json'
//       }).then(
//         function(updatedMovieInfo) {self.reload(updatedMovieInfo);}
//       );
//       return request;
//     },
//     destroy: function() {
//         // console.log("in destroy");
//         //console.log(data);
//       var url = "http://127.0.0.1:3001/movies/" + this.id;
//       var request = $.ajax({
//           url: url,
//           //data: JSON.stringify(data),
//           type: "DELETE"
//       }).then(function(response){
//         //   console.log(response);
//       }
//
//       );;
//       return request;
//       //console.log(request);
//     },
//     reload: function(newData){
//       for(var attrname in newData) {
//         this[attrname] = newData[attrname];
//       }
//     }
//
// }
