define(['knockout', 'models/TimeEntry'],
	function(ko, TimeEntry){
		'use strict'

		var FlexViewModel = function( registrations ) {
			console.log(registrations);
			var self = this;

			self.flexDate = ko.observable();
			self.flexHours = ko.observable();
			self.flexDesc = ko.observable();

			self.registrations =  ko.observableArray(ko.utils.arrayMap( registrations.data, function( registration ) {
				console.log(registration);
      			return new TimeEntry( registration.date, registration.hours, registration.desc, registration.spent);
    		}));

			console.log(self.registrations.length);
			self.addFlex = function() {
				console.log("added");
				self.registrations.push(new TimeEntry({ date: self.flexDate, hours: self.flexHours, description: self.flexDesc, spent: false}));
				self.flexDate = "";
				self.flexDesc = "";
				self.flexHours = "";
			};

			self.spendFlex = function() {
				console.log("spent");
				self.registrations.push(new TimeEntry({ date: self.flexDate, hours: self.flexHours, description: self.flexDesc, spent: true}));
				self.flexDate = "";
				self.flexDesc = "";
				self.flexHours = "";
			};


		}
		return FlexViewModel;
	});