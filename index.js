var
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),

	GeoStore = require('./lib/GeoStore').GeoStore,
	Store = require('./lib/Store').Store,
	GeoAggregator = require('./lib/GeoAggregator').GeoAggregator;
// BibFetcher = require('./lib/bib/Fetcher').Fetcher;

var config = JSON.parse(fs.readFileSync('etc/config.json', 'utf8'));
// console.log("Config", config);


app.set('json spaces', 2);
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var geostore = new GeoStore();
var bibstore = new Store(config, "bib");



var georouter = express.Router();
var bibrouter = express.Router();


Promise.all(
		[geostore.init(), bibstore.init()]
	)
	.then(function() {

		console.log("setup complete");

		georouter.get('/', function(req, res) {
			geostore.list()
				.then(function(data) {
					res.writeHead(200, {
						'Content-Type': 'application/json'
					});
					res.write(JSON.stringify(data, undefined, 2));
					res.end();
				});
		});
		georouter.get('/summary', function(req, res) {
			geostore.list()
				.then(function(data) {
					var a = new GeoAggregator(data);
					return a.get();
				})
				.then(function(data) {
					res.writeHead(200, {
						'Content-Type': 'application/json'
					});
					res.write(JSON.stringify(data, undefined, 2));
					res.end();
				});
		});
		georouter.post('/post', function(req, res) {
			geostore.insert(req, res);
		});
		app.use('/geo', georouter);


		bibrouter.get('/list/', function(req, res) {
			console.log("about to make a request");
			bibstore.list({})
				.then(function(data) {
					console.log("We got data", data);
					res.json(data);
				});

		});
		app.use('/bib', bibrouter);

		app.listen(app.get('port'), function() {
			console.log('Node app is running on port', app.get('port'));
		});


	})
	.catch(function(err) {
		console.error("Error", err);
	});