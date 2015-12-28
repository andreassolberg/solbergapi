// var moment = require('moment');
var moment = require('moment-timezone');

moment.locale('nb');
moment.tz.setDefault("Europe/Amsterdam");

var Location = function(data) {
	this.data = data;
	this.events = [];
	this.nested = [];
}

Location.prototype.addEvent = function(event) {
	this.events.push(event);
}


Location.prototype.process = function() {

	this.current = null;
	this.prev = null;


	if (this.events.length <= 0) {
		return null;
	}

	this.current = this.events[this.events.length-1];

	if (this.events.length >= 2) {

		for(var i = 0; i < this.events.length - 1; i++) {
			var j = this.events.length - 2 - i;
			var x = this.events[j];

			if (this.current.data.entry !== x.data.entry) {
				this.prev = x;
				break;
			}
			console.log("Checking ["+ j + "] of total [0 - " + (this.events.length-1) + "]");
		}

	}

	if (!this.current) {

		this.info = {};
		return;
	}


	var now = moment();
	var et = (this.current.data.entry ? 'Ankom' : 'Forlot');
	var since = Location.tsdiff(now, this.current.ts);



	this.info = {
		"entry": this.current.data.entry,
		"entrytext": (this.current.data.entry ? 'Ankom' : 'Forlot'),
		"since": since
	};

	if (!this.prev) {
		return;

	}


	var dur = Location.tsdiff(this.current.ts, this.prev.ts);
	var dr = this.prev.ts.format('HH:mm') + ' - ' + this.current.ts.format('HH:mm');
	this.info.dur = dur;
	this.info.dr = dr;


	// console.log(" " + et + " " + since);
	// console.log(" " + dur + " (" + dr + ")");
	// console.log("    antall hendelser " + this.events.length);


}

Location.prototype.addNested = function(nested) {
	this.nested.push(nested);
}

Location.prototype.getInfo = function() {
	var o = {
		"name": this.data.name,
		"id": this.data.id,
		"info": this.info,
		"nested": []
	};
	for(var i = 0; i < this.nested.length; i++) {
		o.nested.push(this.nested[i].getInfo());
	}
	return o;
}

Location.prototype.getSummary = function() {
	console.log("Location is " + this.data.name);
	console.log(this.info);

}

Location.tsdiff = function(a, b) {

	var minutes = a.diff(b, 'minutes');
	if (minutes < 60) {
		return minutes + ' minutter';
	}

	var hours = Math.floor(minutes / 60);
	var minutesleft = minutes - (hours*60);
	return hours + 't ' + minutesleft + 'min';	
	
}


exports.Location = Location;