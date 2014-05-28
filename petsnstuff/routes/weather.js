var darksky = require("darksky");
var client = new darksky.Client("30a281d92fd821b0e1ce3ef138ab59d4");

client.forecast('37.8267','-122.423', 
    function(err, data) {
        if (err) {
            console.error(err);
        }
        process.stdout.write(data);
    }
);
client