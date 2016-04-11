var request = require('request');

module.exports = getPlaylists

function getPlaylists (id, accessToken, callback) {
	var options = {
		url:'https://api.spotify.com/v1/users/'+ id +'/playlists',
		headers: {
	    	'Authorization': 'Bearer ' + accessToken
	  	},
	    json: true
	}
	request.get (options,function (error, response, body){
		console.log ("type of body", typeof body);
		callback (error, body.items);
	});
}

if (require.main === module){	
	var accessToken = "BQDau_AE4UkHdMyK-wt_9KNfkqwwRt0XHZZxJuPg1OTgP37sB8q4uuWg2NsK24oipp9Avvra5Kza4rvB8FmU9XkyEHhmJpl9iD75Tw3y88kAsl_-w5rjJKU0T_1Cpd3rZq7-Qym2FSYQ0FY";
	var id = "1241754017";
	getPlaylists(id, accessToken, function(error, playlists){
		if (error) {
			console.log("error was", error)
		}
		console.log(playlists)
	});
}

