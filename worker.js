var
    fs = require('fs'),
    GeoStore = require('./lib/GeoStore').GeoStore,
    Store = require('./lib/Store').Store,
    BibFetcher = require('./lib/bib/Fetcher').Fetcher;

var config = JSON.parse(fs.readFileSync('etc/config.json', 'utf8'));
console.log("Config", config);

var interv = 1000 * 60 * 15; // 15 minutes


var bib = new BibFetcher(config);
bib.init()
    .then(function() {
        console.log("Initialization complete");
        bib.fetch();

        setInterval(function() {
            bib.fetch();
        }, interv);

    })
    .catch(function(err) {
        console.error("--- Error ");
        console.error(err.stack);
    });