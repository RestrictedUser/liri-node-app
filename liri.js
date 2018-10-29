// notes:
// what api call will find the event date and venue location including date of event
// need to add screen shots to read me of all 3 api calls working in terminal!!!!
// 




require("dotenv").config();

var keys = require("./keys.js");

// var request = require("request");
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
	if (!err && response.statusCode === 200){
		console.log("Artist: " +  JSON.parse(body).name);
		console.log("Fans Tracking: " + JSON.parse(body).tracker_count);
		console.log("Upcoming Events: " +JSON.parse(body).upcoming_event_count);
		
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

var movieThis = function(movieQuery) {
	// Load request npm module
	var request = require("request");

	// if query that is passed in is undefined, Mr. Nobody becomes the default
	if(movieQuery === undefined) {
		movieQuery = "mr nobody";
	}

	// HTTP GET request
	request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json&apikey=61a59595", function(err, response, body) {
	  if (!err && response.statusCode === 200) {
	    console.log("* Title of the movie:         " + JSON.parse(body).Title);
	    console.log("* Year the movie came out:    " + JSON.parse(body).Year);
	    console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
	    console.log("* Country produced:           " + JSON.parse(body).Country);
	    console.log("* Language of the movie:      " + JSON.parse(body).Language);
	    console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
	    console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

	    // For loop parses through Ratings object to see if there is a RT rating
	    // 	--> and if there is, it will print it
	    for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
	    	if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	    		console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
	    		if(JSON.parse(body).Ratings[i].Website !== undefined) {
	    			console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
	    		}
	    	}
	    }
	  }
	});
}
if (command === "concertThis"){
	concertThis(query);
}else if (command === "spotify-this-song"){
    spotifyThisSong(query);
}else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	// App functionality from file read / loads fs npm package
	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(err, data) {
		if(err) { // if error
	        console.log('Error occurred: ' + err);
	    }
		var command;
		var query;

		// If there is a comma, then we will split the string from file in order to differentiate between the command and query
		// 	--> if there is no comma, then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		// After reading the command from the file, decides which app function to run
		
		if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if(command === undefined) { // use case where no command is given
	console.log("Please enter a command to run LIRI.")
} else { // use case where command is given but not recognized
	console.log("Command not recognized! Please try again.")
}