var MongoClient = require('mongodb').MongoClient;

var GeoObject = require('./GeoObject').GeoObject;

var GeoStore = function() {

	this.db = null;
	this.username = 'andreas';
	this.password = process.env.PASSWORD;
	this.url = 'mongodb://' + this.username + ':' + this.password + '@ds055822.mongolab.com:55822/andreasgeo'


};

GeoStore.prototype.insert = function(req, res) {

	var go = GeoObject.fromGeofency(req.body);
	this.db.collection('geo').insertOne(go.getMongoObject(), 
		function(err, result) {
			res.json({ message: 'Status OK' }); 
		}
	)

}

GeoStore.prototype.init = function() {
	var that = this;
	return new Promise(function(resolve, reject) {
		MongoClient.connect(that.url, function(err, db) {
			if (err) {
				return reject(err);
			}
			that.db = db;
			return resolve();
		});

	});
}

GeoStore.prototype.list = function() {

	var midnight = new Date();
	midnight.setHours(0,0,0,0);
	
	console.log(midnight);

	var query = {
		"date": {
			"$gte": midnight
			// "$lt": new Date()
		}
	};

	console.log(" ---- Query ----");
	console.log("Date " + midnight);
	console.log(query);

	// console.log(this.db);
	return this.db.collection('geo').find(query).toArray()
		.then(function(data) {
			return data.map(function(item) {
				return new GeoObject(item);
			});
		})
		.then(function(data) {
			data.sort(GeoObject.sorter);
			return data;
		});
}



GeoStore.prototype.shutdown = function() {
	this.db.close();
}


exports.GeoStore = GeoStore;