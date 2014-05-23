// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: "Pets 'n Stuff" });
// });

// router.post("/newuser", function(req, res) {
// 	var db = req.db;

// 	var userName =  req.body.username;
// 	var email = req.body.email;

// 	var collection = db.get('petsnstuff')

// 	collection.insert({
// 		"username" :userName,
// 		"email" : email
// 	}, function(err, doc) {
// 		if(err) {
// 			res.send("We didnt save your info")
// 		}
// 		else {
// 			// res.location("profile");
// 			res.redirect("profile");
// 		}
// 	});
// });

// router.post("/signin", function(req, res) {



// })

// router.get("/profile", function(req, res) {
// 	    var db = req.db;
//     var collection = db.get('petsnstuff');
//     collection.find({},{},function(e,docs){
//     	console.log(docs)
//         res.render('profile', {
//             "profile" : docs
//         });
//     });
// })


// module.exports = router;
