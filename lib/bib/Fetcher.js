var Store = require('../Store').Store;

var Fetcher = function(config) {
    this.config = config;
    this.store = new Store(config, 'bib');
};

Fetcher.prototype.init = function() {
    return this.store.init();
}

Fetcher.prototype.fetchAccount = function(acct) {
    var that = this;
    var TFB = require('tfbjs').TFB;
    var b = new TFB(acct);
    b.getList()
        .then(function(books) {
            console.log("About to remove", {
                "username": acct.username
            });
            return that.store.remove({
                    "username": acct.username
                })
                .then(function() {
                    console.log(JSON.stringify(books, undefined, 2));
                    if (books.length === 0) {
                        return null;
                    }
                    for (var i = 0; i < books.length; i++) {
                        books[i].updated = new Date();
                    }
                    return that.store.insert(books);
                })
                .then(function(res) {
                    console.log("Successsfully updated storage..")
                })
                .catch(function(err) {
                    console.error("Error storing books");
                    console.error(err);
                    console.error(err.stack);
                });

            // that.store.insert(books);
            // 
        })
        .catch(function(err) {
            console.error("Error processing username " + acct.username);
            console.error(err.stack);
        });
}

Fetcher.prototype.fetch = function() {

    var bc = this.config.bib;
    for (var i = 0; i < bc.accounts.length; i++) {
        console.log("Processing account [" + bc.accounts[i].title + "]")
        var acct = {
            "username": bc.accounts[i].username
        };
        if (!process.env.hasOwnProperty("BIB_" + bc.accounts[i].username)) {
            console.log("Missing password for account " + bc.accounts[i].username);
            continue;
        }
        acct.password = process.env["BIB_" + bc.accounts[i].username];
        this.fetchAccount(acct);
    }

}



exports.Fetcher = Fetcher;