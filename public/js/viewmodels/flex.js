define(['knockout', 'models/TimeEntry'],
	function(ko, TimeEntry){
		'use strict'

		var FlexViewModel = function( registrations ) {
			var self = this;

			self.registrations =  ko.observableArray(ko.utils.arrayMap( registrations, function( registration ) {
				console.log(registration);
      			return new TimeEntry( registration.date, registration.hours, registration.description);
    		}));
			

		}
		return FlexViewModel;
	});