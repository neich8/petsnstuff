var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var petSchema = new Schema ({
	name: String,
	age: Number,
	shots: String,
	weight: Number,
	type: String,
	photo: String
});

module.exports = mongoose.model('Pet', petSchema);

//function addTab(pet) {
//       // $("#tabs ul").append("<li><a href='#tabs-" + tabCounter + "'>" + pet.name + "</a></li>")
//       // $("#tabs").append("<div id='tabs-" + tabCounter + "'>" + pet + "</div>")

//       var label = pet.name,
//         id = "tabs-" + tabCounter,
//         li = "<li><a href='#tabs-" + tabCounter + "'>" + pet.name + "</a></li>",
//         tabContentHtml = pet.name;
//         tabs.find( ".ui-tabs-nav" ).append( li );
//         tabs.append( "<div id='" + id + "'><p>" + pet + "</p></div>" );
//       tabs.tabs( "refresh" );
//       tabCounter++;
//     }
