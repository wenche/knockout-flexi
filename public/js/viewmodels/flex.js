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
      			return new TimeEntry({ date: registration.date, hours: registration.hours, description: registration.desc, spent: registration.spent, id: registration._id });
    		}));

			self.addFlex = function() {
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

			self.removeRegistration = function(flex) {

				console.log("Removing line " + flex.hours() + flex.id());

				$.ajax("/api/flex/" + flex.id(), {
					data: ko.toJSON(flex),
					type: "delete",
					success: function(result){
						console.log("Removed line. " + result);
					}
				})
				self.registrations.remove(flex);
			}

			self.totalHours = ko.computed(function() {
   				var total = 0;
   				for (var i = 0; i < self.registrations().length; i++) {
   					//parser ingenting nå
   					var hours = self.registrations()[i].getSign();
   					console.log(hours);
       				total += hours;
       			}
       				console.log("Total: " + total);
   					return total;
			});
		};

		return FlexViewModel;
	});