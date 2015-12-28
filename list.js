
var GeoStore = require('./lib/GeoStore').GeoStore;
var GeoAggregator = require('./lib/GeoAggregator').GeoAggregator;




var geostore = new GeoStore();
geostore.init()
	.then(function() {

		return geostore.list()
			.then(function(list) {
				console.log(" ---- List ----");
				// console.log(list);

				list.forEach(function(item) {
					item.getSummary();
				});

				console.log(" ---- Aggregate ----");

				var a = new GeoAggregator(list);
				var locations = a.get();

				console.log(JSON.stringify(locations, undefined, 3));

				// locations.forEach(function(item) {
				// 	console.log(item.getInfo());
				// });


				// for (var key in locations) {
				// 	locations[key].getSummary();
				// }

			});

	})
	.then(function() {
		geostore.shutdown();
	})
	.catch(function(err) {
		console.error("Error", err);
		console.error(err.stack);
	});





