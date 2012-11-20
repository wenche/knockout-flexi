require.config({
	paths: {
		knockout: 'libs/knockout-2.2.0',
		jquery: 'libs/jquery.min',
		ko_validation: 'libs/knockout.validation',
		tooltip: 'libs/bootstrap-tooltip',
		highcharts: 'libs/highcharts'
	},
	shim : {
		highcharts : {
			exports : 'Highcharts', 
			deps : ['jquery']
		}	
	}

});

require([
	'knockout',
	'jquery',
	'config/global',
	'viewmodels/flex'
], function(ko, $, g, ViewModel){
	'use strict';

	$.getJSON(g.url, function(data) {
		console.log( data);
		ko.applyBindings( new ViewModel(data));
	});

});
