define(['knockout', 'models/TimeEntry'],
	function(ko, TimeEntry){
		'use strict'

		var FlexViewModel = function( registrations ) {
			var self = this;
			console.log(registrations);
			self.registrations =  ko.observableArray(ko.utils.arrayMap( registrations.data, function( registration ) {
				console.log(registration);
      			return new TimeEntry( registration.date, registration.hours, registration.desc);
    		}));

		}
		return FlexViewModel;
	});