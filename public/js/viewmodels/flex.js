define(['knockout', 'models/TimeEntry'],
	function(ko, TimeEntry){
		'use strict'


		var FlexViewModel = function( regs ) {
			var self = this;

			self.flexDate = ko.observable();
			self.flexHours = ko.observable();
			self.flexDesc = ko.observable();

			self.registrations =  ko.observableArray(ko.utils.arrayMap( regs, function( registration ) {
				console.log(registration);
      			return new TimeEntry({ date: registration.date, hours: registration.hours, description: registration.desc, spent: registration.spent });
    		}));

			self.addFlex = function() {
				console.log("added");
				var flex = new TimeEntry({ date: self.flexDate(), hours: self.flexHours(), description: self.flexDesc(), spent: false});
				$.ajax("/api/flex", {
					data: ko.toJSON(flex),
					type: "post", contentType: "application/json",
					success: function(result) {
						console.log(result);
					}
				});
				self.registrations.push(flex);
				self.flexDate("");
				self.flexDesc("");
				self.flexHours("");
			};

			self.spendFlex = function() {
				console.log("spent");
				var flex = new TimeEntry({ date: self.flexDate(), hours: self.flexHours(), description: self.flexDesc(), spent: true});
				$.ajax("/api/flex", {
					data: ko.toJSON(flex),
					type: "post", contentType: "application/json",
					success: function(result) {
						console.log(result);
					}
				});
				self.flexDate("");
				self.flexDesc("");
				self.flexHours("");
				
				self.registrations.push(flex);
			};
		}

		return FlexViewModel;
	});