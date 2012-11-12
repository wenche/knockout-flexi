define(['knockout'], 
	function(ko){
		'use strict'
		//represent a single menu item
		var TimeEntry = function(data){
			var self = this;
			self.date = ko.observable(data.date);
			self.hours = ko.observable(data.hours);
			self.description = ko.observable(data.description);
			self.spent = ko.observable(data.spent);

			self.isSpent = ko.computed(function() {
				return self.spent() ? "error" : "success";
			});
		} 
		return TimeEntry;
	});