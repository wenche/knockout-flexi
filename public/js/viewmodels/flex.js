define(['knockout', 'models/TimeEntry', 'config/global', 'ko_validation', 'tooltip', 'highcharts'],
	function(ko, TimeEntry, g, val, tt, Highcharts){
		'use strict';

		ko.validation.configure({
		    registerExtenders: true,
		    messagesOnModified: false,
		    insertMessages: false,
		    parseInputAttributes: true,
		    messageTemplate: null
		});

		var FlexViewModel = function( regs ) {
			var self = this;

			self.flexDate = ko.observable().extend({ required: true, date: true });
			self.flexHours = ko.observable().extend({ required: true, number: true});
			self.flexDesc = ko.observable();
			self.chart;
			self.spent = 0;
			self.worked = 0;
			self.errors = ko.validation.group(self);

			self.registrations =  ko.observableArray(ko.utils.arrayMap( regs, function( registration ) {
				console.log(registration);
				return new TimeEntry({ date: registration.date, hours: registration.hours,
					description: registration.desc, spent: registration.spent, id: registration._id });
			}));

			self.sortDates = function (sort) {
				var elem = $("#sortDate").children("i");
				if ( elem.hasClass(g.sortUp) ){
					self.registrations.sort(function(left,right){
						return left.date() === right.date()
							? 0 : (left.date() < right.date() ? -1 : 1 );
					});
					elem.removeClass(g.sortUp).addClass(g.sortDown);
				} else {
					elem.removeClass(g.sortDown).addClass(g.sortUp);
					self.registrations.sort(function(left,right){
						return left.date() === right.date()
							? 0 : (left.date() > right.date() ? -1 : 1 );
					});
				}
			};

			// RY is the new DRY, eller Wenche er lei
			self.insertDates = function () {
				var elem = $("#sortDate").children("i");
				if (elem.hasClass(g.sortUp) ){
					self.registrations.sort(function(left,right){
						return left.date() === right.date()
							? 0 : (left.date() > right.date() ? -1 : 1 );
					});
				}
				else if (elem.hasClass(g.sortDown)) {
					self.registrations.sort(function(left,right){
						return left.date() === right.date()
							? 0 : (left.date() < right.date() ? -1 : 1 );
					});
				};
			};

			self.hasErrors = function(options) {
				if(self.errors().length > 0) {
					self.errors.showAllMessages();
					self.flexDate.isValid.notifySubscribers(options ? options.hideErrors : self.flexDate.isValid());
					self.flexHours.isValid.notifySubscribers(options ? options.hideErrors : self.flexHours.isValid());
					return true;
				}
				return false;
			};

			//@TODO: Validering slik at man ikke kan legge til tomme rader
			self.addFlex = function() {
				if(self.hasErrors())
					return;

				var flex = new TimeEntry({ date: self.flexDate(), hours: self.flexHours(),
					description: self.flexDesc(), spent: false});
				$.ajax("/api/flex", {
					data: ko.toJSON(flex),
					type: "post", contentType: "application/json",
					success: function(result) {
						console.log(result);
						self.worked +=  parseFloat(self.flexHours());
						self.chart.series[1].setData([self.worked]);
						self.flexDate("");
						self.flexDesc("");
						self.flexHours("");
						self.errors.showAllMessages(false);
						self.hasErrors({ hideErrors: true })

						self.registrations.push(flex);
						self.insertDates();
					}
				});
			};

			self.spendFlex = function() {
				if(self.hasErrors())
					return;

				var flex = new TimeEntry({ date: self.flexDate(), hours: self.flexHours(),
					description: self.flexDesc(), spent: true});
				$.ajax("/api/flex", {
					data: ko.toJSON(flex),
					type: "post", contentType: "application/json",
					success: function(result) {
						console.log(result);
						self.spent +=  parseFloat(self.flexHours());
						self.chart.series[0].setData([self.spent]);
						self.flexDate("");
						self.flexDesc("");
						self.flexHours("");
						self.errors.showAllMessages(false);
						self.hasErrors({ hideErrors: true });

						self.registrations.push(flex);
						self.insertDates();
					}
				});
			};

			self.removeRegistration = function(flex) {
				$.ajax("/api/flex/" + flex.id(), {
					data: ko.toJSON(flex),
					type: "delete",
					success: function(result){
						console.log("Removed line. " + result);
					}
				});
				if(flex.spent()){
					self.spent -=  parseFloat(flex.hours());
					self.chart.series[0].setData([self.spent]);
				}
				else {
					self.worked -=  parseFloat(flex.hours());
					self.chart.series[1].setData([self.worked]);
				}
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

			ko.bindingHandlers.FlexValidationMsg = {
				update: function(element, valueAccessor, allBindingsAccessor, viewmodel) {
					var observable = valueAccessor(), $element = $(element);
					if(observable.isValid) {
						observable.isValid.subscribe(function(valid) {
							console.log("valid: " + valid);
							console.log("observable: " + observable);
							console.log("el: " + $element);
							console.log("error: " + observable.error);
							if(!valid) {
								$element.addClass('validation-error');
								$element.tooltip({ placement: 'right', title: observable.error, trigger: 'manual' });
								$element.tooltip('show');
							} else {
								$element.tooltip('destroy');
								$element.removeClass('validation-error');
							}
						});
					}
				}
			}
			var series = function() {
				self.worked = 0;
				self.spent = 0;
				for (var i = 0; i < self.registrations().length; i++) {
					var hours = parseFloat(self.registrations()[i].hours());
					if(self.registrations()[i].spent()){
						self.spent += hours;
					} else
					{
						self.worked += hours;
					}
				}
				return [{
        					name: 'Brukt',
					        data: [self.spent]
					    },
					    {
					    	name: 'Arbeidet',
					    	data: [self.worked]
				    	}];
			};

			ko.bindingHandlers.highcharts = {

				init: function(element) {
					self.chart = new Highcharts.Chart({
         				chart: {
            				renderTo: element,
            				type: 'column'
         				},
				         title: {
				            text: 'Balanse'
				         },
				         xAxis: {
				         	title: {
				         		text: 'Type'
				         	}
				         },
				         yAxis: {
				            title: {
				               text: 'Timer'
				            }
				         },
				         series: series()
      				});
				}
			}
		};

		return FlexViewModel;
	});
