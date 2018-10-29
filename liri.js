
require("dotenv").config();

var keys = require("./keys.js");


var command = process.argv[2];
var query = process.argv[3];
var Spotify = require("node-spotify-api");

// spot keys
var spotify = new Spotify(keys.spotify);

var concertThis = function(concertQuery){
	var request = require("request");

	if(concertQuery === undefined){
		concertQuery = "Creed";
	}
	request("https://rest.bandsintown.com/artists/" + concertQuery + "?app_id=codingbootcamp", function(err, response, body){

	var jsonData = JSON.parse(body);

	if (!err && response.statusCode === 200){
		console.log("Artist: " +  jsonData.name);
		console.log("Fans Tracking: " + jsonData.tracker_count);
		console.log("Upcoming Events: " +jsonData.upcoming_event_count);
		// console.log(body);
		
	}
	});
}

var spotifyThisSong = function(trackQuery){
	

    if (trackQuery === undefined){
        trackQuery = "the sign ace of base";
    }

    spotify.search({ type: 'track', query: trackQuery }, function(err, data) {
        if(err){
            console.log(err);
            
        }else{
            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                if (i === 0){
                    console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
                    
                }else{
                    console.log("              " + data.tracks.items[0].artists[i].name);
                }
            }
                console.log("Song:         " + data.tracks.items[0].name);
				console.log("Preview Link: " + data.tracks.items[0].preview_url);
				console.log("Album:        " + data.tracks.items[0].album.name);
        }
    });

}

// OMDB 
var movieThis = function(movieQuery) {
	
	var request = require("request");

	if(movieQuery === undefined) {
		movieQuery = "mr nobody";
	}

	request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json&apikey=61a59595", function(err, response, body) {

	var jsonData = JSON.parse(body);

	  if (!err && response.statusCode === 200) {
	    console.log("* Title of the movie:         " + jsonData.Title);
	    console.log("* Year the movie came out:    " + jsonData.Year);
	    console.log("* IMDB Rating of the movie:   " + jsonData.imdbRating);
	    console.log("* Country produced:           " + jsonData.Country);
	    console.log("* Language of the movie:      " + jsonData.Language);
	    console.log("* Plot of the movie:          " + jsonData.Plot);
	    console.log("* Actors in the movie:        " + jsonData.Actors);

	    for(var i = 0; i < jsonData.Ratings.length; i++) {
	    	if(jsonData.Ratings[i].Source === "Rotten Tomatoes") {
	    		console.log("* Rotten Tomatoes Rating:     " + jsonData.Ratings[i].Value);
	    		if(jsonData.Ratings[i].Website !== undefined) {
	    			console.log("* Rotten Tomatoes URL:        " + jsonData.Ratings[i].Website);
	    		}
	    	}
	    }
	  }
	});
}
if (command === "concert-this"){
	concertThis(query);
}else if (command === "spotify-this-song"){
    spotifyThisSong(query);
}else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	
	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(err, data) {
		if(err) { 
	        console.log(err);
	    }
		var command;
		var query;

		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		
		if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else { 
			console.log("Command invalid!");
		}
	});
} else if(command === undefined) { 
	console.log("LIRI Bot needs a command to run.");
} else { 
	console.log("Command not recognized! Please try again.");
}
