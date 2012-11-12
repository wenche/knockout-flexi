require.config({
	paths: {
		knockout: 'libs/knockout-2.2.0',
		jquery: 'libs/jquery.min'
	}

});

require([
	'knockout',
	'jquery',
	'config/global',
	'viewmodels/flex'
], function(ko, $, g, ViewModel){
  	'use strict';
	/*
	var youtubeVideos;

  	$.getJSON(g.youtube, function(dataFromServer) { 
		console.log("Hentet data");
		console.log(dataFromServer);

		youtubeVideos = dataFromServer;
		console.log("Videos as Json: " + youtubeVideos);
		ko.applyBindings( new YoutubeViewModel( youtubeVideos ) , $("#main")[0]);
	});
	*/
  	ko.applyBindings( new ViewModel());
  	
	
  
  	
});
