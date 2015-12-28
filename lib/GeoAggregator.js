
var GeoAggregator = function(data) {
	this.data = data;
};

GeoAggregator.prototype.get = function() {
	
	var locations = {};
	for(var i = 0; i < this.data.length; i++) {
		var e = this.data[i];
		if (!locations.hasOwnProperty(e.data.id)) {
			locations[e.data.id] = e.getLocation();
		}
		locations[e.data.id].addEvent(e);
	}


	var nested = {
		"7A34612D-E0E4-458C-9A54-C6C966630A95": "49E52D43-FB9F-4B21-8ED2-8ACC1507B3D1", // Hjemmekontor i jan voigts vei
		"B468EF27-AC8B-4AE2-B3FD-2AB5693C5456": "20F67175-EC10-4042-8577-B61203D04E33" // Andreas kontor i teknobyen
	};


	var list = [], key;

	for(key in locations) {
		locations[key].process();
		if (nested.hasOwnProperty(key)) {
			var target = nested[key];
			if (locations.hasOwnProperty(target)) {
				locations[target].addNested(locations[key]);
				delete locations[key];
				continue;
			}
		}
	}
	for(key in locations) {
		list.push(locations[key]);
	}


	list.sort(GeoAggregator.LocationSorter);
	return list.map(function(x) {
		return x.getInfo();
	});

}



GeoAggregator.LocationSorter = function(a, b) {

	if (a.current.ts.isBefore(b.current.ts)) {
		return -1;
	}
	if (b.current.ts.isBefore(a.current.ts)) {
		return 1;
	}
	return 0;
}

exports.GeoAggregator = GeoAggregator;