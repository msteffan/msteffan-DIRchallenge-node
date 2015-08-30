///////////// buttons and event handlers //////////

// Search form:
$('#search').on('submit', function(evt) {
  evt.preventDefault();
  var $search = $('#movie-search');
  var keyword = $search.val();
  $search.val('');
  search(keyword);
});

// Movie selector:
$('#movie-select').hide().on('change', function() {
  show(this.value);
});

// Show favorited movies:
$("#showMovies").on("click",function(){
    $(".fave-list").children().remove();
    // Movie.fetch will query the db for all of the saved movies (returns an array), then it will append the title of each saved movie into the DOM
    Movie.fetch()
    .then(function(movies){
      movies.forEach(function(movie){
          $(".fave-list").append("<li>"+ movie.title +"</li>")
     })
   })
});


///////////// SEARCH & BROWSE ////////////////////

function search(keyword) {
  //  endpoint for our json search request
  var url = 'http://www.omdbapi.com/?s='+escape(keyword);

  $.getJSON(url)
  // if the request succeeds, execute this function
  .done(function(imdbResponse){
    imdbDone(keyword, imdbResponse);
  })
  // if the request fails (or there weren't any matching movies) return the following:
  .fail(function(imdbResonse, textStatus, errorMessage){
    var message = "Sorry, we had issues retrieving movie data for '" + keyword + "'";
    if (errorMessage){
      message += "(" + errorMessage + ")";
    }
    message += ".  Please try again.";
    $('#movie-detail').html("<h2 class='fail'>" + message + "</h2>");
  });
}

//function to display drop-down menu for all movies that match the query
function imdbDone(searchKeyword, imdbSearchData) {
  var display = '<option value="">Movies matching "'+ searchKeyword +'"...</option>';
  // for every movie returned, display as item in down-down menu
  for (var i=0; i < imdbSearchData.Search.length; i++) {
    var movie = imdbSearchData.Search[i];
    display += ['<option value="', movie.imdbID, '">', movie.Title, '</option>'].join('');
  }
  // show the drop-down menu
  $('#movie-select').show().html(display);


}

// when a movie is selected from the drop-down menu (see "movie selector" above), get the IMDB ID of that movie and retrieve information about it in particular
function show(imdbId) {
  if (!imdbId) return;

  var url = 'http://www.omdbapi.com/?i='+imdbId;

  $.getJSON(url).then(function(imdbMovieData) {

      console.log(imdbMovieData);
    // once we have the data about the movie, we want to display it on the page using the following:
    var url = "http://www.imdb.com/title/" + imdbMovieData.imdbID
    var detail = "<h2 class='movieTitle'><a href=" + url + ">" + imdbMovieData.Title + '</a></h2>';
    detail += '<img src="'+ imdbMovieData.Poster +'" alt="'+ imdbMovieData.Title +'">' + "<p>"+ imdbMovieData.Plot +"</p>";
    $('#movie-detail').html(detail);
    $("#movie-detail").append("<button id='addFave'>Add to favorites</button>")
  });

}

///////////////////////////////// SAVE MOVIE /////////////////////////////////////

// ajax to post movie to favorites
// when the user clicks the button to add the movie to a list of favorites, we want to store that information in the database, which is executed with a post request to the movies controller
$("body").on("click", "#addFave", function(e){
    e.preventDefault();
    var movieTitle = $(".movieTitle").html()
    $.ajax({
      type: 'POST',
      data: { "title": movieTitle },
      url: "http://127.0.0.1:3001/movies"
    }).done(function(response) {
      console.log(response)
      $(".fave-list").append("<li>"+ movieTitle +"</li>")

    }).fail(function(response){
        console.log(response);

    })
})
