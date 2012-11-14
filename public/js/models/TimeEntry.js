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
			self.id = ko.observable(data.id);
			self.isSpent = ko.computed(function() {
				return self.spent() ? "error" : "success";
			});
			self.getSign = ko.computed(function(){
				return self.spent() ? -self.hours() : self.hours();
				;
			});	
		} 

		return TimeEntry;
	});