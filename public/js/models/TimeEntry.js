define(['knockout'], 
	function(ko){
		'use strict'
		//represent a single menu item
		var TimeEntry = function(date, hours, description){
			this.date = ko.observable(date);
			this.hours = ko.observable(hours);
			this.description = ko.observable(description);

		} 
		return TimeEntry;
	});