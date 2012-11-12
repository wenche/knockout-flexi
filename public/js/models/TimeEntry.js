define(['knockout'], 
	function(ko){
		'use strict'
		//represent a single menu item
		var TimeEntry = function(data){
			this.date = ko.observable(data.date);
			this.hours = ko.observable(data.hours);
			this.description = ko.observable(data.description);
			this.spent = ko.observable(data.spent);
		} 
		return TimeEntry;
	});