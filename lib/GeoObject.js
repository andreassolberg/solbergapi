// var moment = require('moment');
var moment = require('moment-timezone');

moment.locale('nb');
moment.tz.setDefault("Europe/Amsterdam");


var Location = require('./Location').Location;

/*
{
    "device": "0459A19C-4F7E-4286-B032-CA488829C8AB",
    "major": "*",
    "longitude": "10.46354530380151",
    "id": "7A34612D-E0E4-458C-9A54-C6C966630A95",
    "beaconUUID": "DFDCC2CD-EB54-44B4-8C9F-AD33ACEF8D76",
    "minor": "*",
    "date": "2015-09-26T17:59:09Z",
    "latitude": "63.45022493513622",
    "entry": "1",
    "name": "Hjemmekontor"
}
 */

var GeoObject = function(data) {
	this.data = data;
	this.ts = moment(this.data.timestamp);
};

GeoObject.prototype.getMongoObject = function() {
	return this.data;
}

GeoObject.prototype.getLocation = function() {
	var object = {};
	var attrs = ['id', 'name', 'device', 'major', 'minor', 'beaconUUID'];
	for(var i = 0; i < attrs.length; i++) {
		if (this.data.hasOwnProperty(attrs[i])) {
			object[attrs[i]] = this.data[attrs[i]];
		}
	}
	var l = new Location(object);
	return l;
}

GeoObject.prototype.getSummary = function() {

	console.log("");
	console.log("" + this.data.name + "  " + (this.data.entry ? "enter" : "leave"));
	console.log(" at " + this.ts.format());

}

GeoObject.fromGeofency = function(data) {

	var object = {};

	var attrs = ['id', 'name', 'device', 'major', 'minor', 'beaconUUID'];
	// lat lon date entry 
	for(var i = 0; i < attrs.length; i++) {
		if (data.hasOwnProperty(attrs[i])) {
			object[attrs[i]] = data[attrs[i]];
		}
	}

	if (data.hasOwnProperty("latitude")) {
		object.loc = {
			"type": "Point",
			"coordinates": [parseFloat(data.latitude), parseFloat(data.longitude)]
		};
	}

	if (data.hasOwnProperty("entry")) {
		object.entry = (data.entry === '1');
	}

	if (data.hasOwnProperty("date")) {
		object.date = new Date(data.date); // Date.parse(data.date).toISOString();
	}

	var now = new Date();
	object.timestamp = now;

	return new GeoObject(object);

}

GeoObject.sorter = function(a, b) {

	if (a.ts.isBefore(b.ts)) {
		return -1;
	}
	if (b.ts.isBefore(a.ts)) {
		return 1;
	}
	return 0;
}


exports.GeoObject = GeoObject;