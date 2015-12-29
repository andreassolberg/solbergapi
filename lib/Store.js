var MongoClient = require('mongodb').MongoClient;

var Store = function(config, collection) {

	this.db = null;
	this.username = 'andreas';
	this.password = config.secrets.PASSWORD;
	this.collection = collection;
	this.url = 'mongodb://' + this.username + ':' + this.password + '@ds055822.mongolab.com:55822/andreasgeo'

};

Store.prototype.insertOne = function(obj) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.db.collection(that.collection).insertOne(obj,
			function(err, result) {
				if (err) {
					return reject(err);
				}
				return resolve(result);
			}
		)
	});
}

Store.prototype.insert = function(arr) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.db.collection(that.collection).insert(arr,
			function(err, result) {
				if (err) {
					return reject(err);
				}
				return resolve(result);
			}
		)
	});
}

Store.prototype.remove = function(obj) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.db.collection(that.collection).remove(obj,
			function(err, result) {
				if (err) {
					return reject(err);
				}
				return resolve(result);
			}
		)
	});

}


Store.prototype.init = function() {
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

Store.prototype.list = function(query) {

	// console.log(" ---- Query ----");
	// console.log(query);

	return this.db.collection(this.collection).find(query).toArray()
		.then(function(data) {
			return data;
		});
}



Store.prototype.shutdown = function() {
	this.db.close();
}


exports.Store = Store;