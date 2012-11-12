define(['knockout'], 
	function(ko){
		'use strict'
		//represent a single menu item
		var TimeEntry = function(text){
			this.text = text;
		} 
		return TimeEntry;
	});