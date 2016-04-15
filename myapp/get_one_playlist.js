
// give playlist id
// give user id
// and gets playlist
var request = require('request');

module.exports = getOnePlaylist


function getOnePlaylist(playlistId, userId, accessToken, callback, extra) {
	var options = {
		url:'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId +'/tracks',
		headers: {
	    	'Authorization': 'Bearer ' + accessToken
	  	},
	    json: true
	};
	request.get (options, function (error, response, body){
		callback (error,body, extra);
	});
}

if (require.main ===module){
	var playlistId = "6igf2NZXSTvWdrli22SwyB";
	var userId = "1241754017";
	var accessToken = "BQDT4RPpkqAvhhWgWpk-E34PYm8XzVe4FbjS9KBc3UDY2Ax6nTmg13zt69vs1GOodI2kuEeLg36z7ilSHxYpqfN33-YeU38d4wfVY1fp9Z0DwUjE9p3BHV0ZPJDxQwMEzeHCtYiwv35VhEc";
	getOnePlaylist (playlistId, userId, accessToken, function(error, tracks){
		if (error) {
			console.log("error was ", error)
		}
		console.log(tracks)
	})
}