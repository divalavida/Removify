var request = require('request');
var getPlaylists = require('./get_playlists');
var getOnePlaylist = require ('./get_one_playlist');



module.exports = getAllTracks

function getAllTracks(userId, accessToken, callback){
	var result = [];
	var toDo = 0;
	getPlaylists(userId, accessToken, onPlaylists);
	function onPlaylists(error,playlists) {
		if (error) {
			callback(error, null)
			return ;
		}
		for(var i = 0; i < playlists.length; i++) {
			// console.log (playlists[i].owner)
			if (playlists[i].owner.id === userId) {
				getOnePlaylist(playlists[i].id, userId, accessToken, onOnePlaylist, playlists[i]);
				toDo += 1;
			}
		}
	}
	function onOnePlaylist(error, tracks, playlist){
		playlist.tracks = tracks
		result.push (playlist);
		// console.log (tracks);
		toDo -= 1;
		if (toDo === 0) {
			callback (null, result)
		}
	}
}

if (require.main === module){	
	var accessToken = "BQBn0ZgUC6sRFuZsBYRav7NkV--K4ekf9eEorJVfJfyhxzT34u8gpIDyu0_YyAYx5qzHQbwFOYyinJhgYFUjCag4U5kSTELV3qi-aA8Sqd1v3-ODvoZbNiClOpUL1I_fgoj963uQeeyeaLY";
	var id = "1241754017";
	getAllTracks(id, accessToken, function(error, playlists){
		if (error) {
			console.log("error was", error)
		}
		console.log(playlists)
	});
}