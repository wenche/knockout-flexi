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
    			})

    		);
  			self.sortHours = function () {
				self.registrations.sort(function(left, right) { 
					return left.hours() == right.hours() ? 0 : (left.hours() < right.hours() ? -1 : 1) 
				}); 
			};
			//Litt søkt kanskje, enklere med default søk?
			//@TODO: Bug, søker hver gang når man legger til flere registreringer etterhverandre
			self.sortDates = function (sort) {
				var elem = $("#sortDate").children("i");
				if( elem.hasClass("icon-chevron-up")){
					elem.removeClass("icon-chevron-up").addClass("icon-chevron-down");
					self.registrations.sort(function(left,right){
						return left.date() == right.date() ? 0 : (left.date() > right.date() ? -1 : 1 );
					});
				} else {
					//If the table is unsorted, respect this when adding a new item
					if(!elem.hasClass("icon-chevron-down") && !sort) {
						return;
					}
					elem.removeClass("icon-chevron-down").addClass("icon-chevron-up");
					self.registrations.sort(function(left,right){
						return left.date() == right.date() ? 0 : (left.date() < right.date() ? -1 : 1 );
					});
				}
			}

			//@TODO: Validering slik at man ikke kan legge til tomme rader
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
				self.sortDates(false);
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
				self.sortDates(false);
			;
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
   					var hours = parseFloat(self.registrations()[i].getSign());
       				total += hours;
       			}
   				return total;
			});
		};

		return FlexViewModel;
	});