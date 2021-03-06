// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an array 'items'
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  $('#albums-and-tracks').empty();
  var bandId = $(event.target).attr('data-spotify-id');
  $.ajax({
      url: 'https://api.spotify.com/v1/artists/' + bandId + '/albums?offset=0&limit=20&album_type=album',
      method: 'GET',
      success: function(data){
        for(var i=0; i<(data["items"].length); i++){
        var albumTracksId = (data["items"][i]["id"]);
        $.ajax({
          url: 'https://api.spotify.com/v1/albums/' + albumTracksId + '/',
          method: 'GET',
          success: function(data){
            var albumName = (data["name"]);
            var albumRelease = (data["release_date"]);
            appendToMe.append("<strong>" + albumName + " " + "(" + albumRelease + ")" + "</strong>" + ":" + "<br>");
            for (var j=0; j<(data["tracks"]["items"].length); j++){
              var albumTracks = (data["tracks"]["items"][j]["name"]);
              appendToMe.append(albumTracks + "<br>");
            }
          }
        });
      }
    }
  });
  var appendToMe = $('#albums-and-tracks');

  // These two lines can be deleted. They're mostly for show.
  // console.log("you clicked on:");
  // console.log($(event.target).attr('data-spotify-id'));//.attr('data-spotify-id'));
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
