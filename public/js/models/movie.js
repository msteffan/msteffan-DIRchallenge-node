var Movie = function(info){
  this.title = info.title;
  this.userId = info.userId;
  this.imdbId = info.imdbId;
  this.id= info.id;
}

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

Movie.prototype = {
    update: function(movieData) {
      var self = this;

      var url = "http://127.0.0.1:3001/movies" + this.id;
      var request = $.ajax({
        url: url,
        method: "patch",
        data: JSON.stringify(movieData),
        contentType : 'application/json'
      }).then(
        function(updatedMovieInfo) {self.reload(updatedMovieInfo);}
      );
      return request;
    },
    destroy: function() {
        // console.log("in destroy");
        //console.log(data);
      var url = "http://127.0.0.1:3001/movies/" + this.id;
      var request = $.ajax({
          url: url,
          //data: JSON.stringify(data),
          type: "DELETE"
      }).then(function(response){
        //   console.log(response);
      }

      );;
      return request;
      //console.log(request);
    },
    reload: function(newData){
      for(var attrname in newData) {
        this[attrname] = newData[attrname];
      }
    }

}
