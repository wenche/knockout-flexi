define(['knockout', 'models/TimeEntry', 'config/global'],
	function(ko, TimeEntry, g){
		'use strict';

		var FlexViewModel = function( regs ) {
			var self = this;

			self.flexDate = ko.observable();
			self.flexHours = ko.observable();
			self.flexDesc = ko.observable();

			self.registrations =  ko.observableArray(ko.utils.arrayMap( regs, function( registration ) {
				console.log(registration);
				return new TimeEntry({ date: registration.date, hours: registration.hours, description: registration.desc, spent: registration.spent, id: registration._id });
			}));

			self.sortDates = function (sort) {
				var elem = $("#sortDate").children("i");
				if ( elem.hasClass(g.sortUp) ){
					self.registrations.sort(function(left,right){
						return left.date() === right.date() ? 0 : (left.date() < right.date() ? -1 : 1 );
					});
					elem.removeClass(g.sortUp).addClass(g.sortDown);	
				} else {
					elem.removeClass(g.sortDown).addClass(g.sortUp);
					self.registrations.sort(function(left,right){
						return left.date() === right.date() ? 0 : (left.date() > right.date() ? -1 : 1 );
					});
				}
			};

			// RY is the new DRY, eller Wenche er lei
			self.insertDates = function () {
				var elem = $("#sortDate").children("i");
				if (elem.hasClass(g.sortUp) ){
					self.registrations.sort(function(left,right){
						return left.date() === right.date() ? 0 : (left.date() > right.date() ? -1 : 1 );
					});
				}
				else if (elem.hasClass(g.sortDown)) {
					self.registrations.sort(function(left,right){
						return left.date() === right.date() ? 0 : (left.date() < right.date() ? -1 : 1 );
					});
				};
			};

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
				self.insertDates();
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
				self.insertDates();

			};

			self.removeRegistration = function(flex) {

				console.log("Removing line " + flex.hours() + flex.id());

				$.ajax("/api/flex/" + flex.id(), {
					data: ko.toJSON(flex),
					type: "delete",
					success: function(result){
						console.log("Removed line. " + result);
					}
				});
				self.registrations.remove(flex);
			};

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