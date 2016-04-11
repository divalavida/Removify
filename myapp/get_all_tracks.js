var request = require('request');
var getPlaylists = require('./get_playlists');
var getOnePlaylist = require ('./get_one_playlist');



module.exports = getAllTracks

function getAllTracks(id, accessToken, callback){
	getPlaylists(id, accessToken, onPlaylists);
	function onPlaylists(error,playlists) {
		if (error) {
			callback(error, null)
			return ;
		}
		for(var i = 0; i < playlists.length; i++) {
			console.log (playlists[i].id)
		}
	}
}

if (require.main === module){	
	var accessToken = "BQDVLAK3_JH4lM9EZeFmhXfXifmLhNGRsvNXeb1EMjGoRs9M60y_z7QfsshULQ2B-kRT0cV8XkTiNMKrDU-y4kJQvHuzFwAbgZLuC7UVP_CTkk05O1DUJe0DhNn18-4ds2tqE7CFnl0FtCc";
	var id = "1241754017";
	getAllTracks(id, accessToken, function(error, playlists){
		if (error) {
			console.log("error was", error)
		}
		console.log(playlists)
	});
}