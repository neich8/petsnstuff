var User = require("../models/user")["User"];
var Nutrition = require("../models/nutrition");
var Ingredient = require("../models/ingredient")
var passport = require('passport')
var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('././AwsConfig.json');
var s3 = new aws.S3();

module.exports = function(app){

app.get('/', function(req, res) {
	Nutrition.find({ Brand: "Alpo Dog Food (Dry)"}).select('-_id').exec(function(err, food) {
		Ingredient.find({}, function(err, ingredients) {
			res.render('index', { title: "Pets 'n Stuff", foods: food, ingredients: ingredients} );
		});
	});
});

app.post('/brands/:brand_name', function(req, res) {
	Nutrition.find({ Brand: req.params.brand_name}, function(err, food) {
		Ingredient.findOne({ Brand: req.params.brand_name}, function(err, ingredient) {
				res.send({foods: food, ingredient:ingredient});
		});
	});
});

app.post('/file-upload/:pet_id', function (req, res){
	console.log(req.files)
 // function uploadImages() {
 //  var CODE_PATH = 'resources/images/';
 //  var fileList = getFileList('./' + CODE_PATH);

 //  fileList.forEach(function(entry) {
 //    uploadFile(CODE_PATH + entry, './' + CODE_PATH + entry);
 //  });
//}


// function getFileList(path) {
//   var i, fileInfo, filesFound;
//   var fileList = [];

//   filesFound = fs.readdirSync(path);
//   for (i = 0; i < filesFound.length; i++) {
//     fileInfo = fs.lstatSync(path + filesFound[i]);
//     if (fileInfo.isFile()) fileList.push(filesFound[i]);
//   }

//   return fileList;
// }

// uploadFile("burhle", "./public/images/IMG_1568.jpg")

// function uploadFile(remoteFilename, fileName) {
//   var fileBuffer = fs.readFileSync(fileName);
//   var metaData = getContentTypeByFile(fileName);

//   s3.putObject({
//     ACL: 'public-read',
//     Bucket: 'pets-n-stuff/pets',
//     Key: remoteFilename,
//     Body: fileBuffer,
//     ContentType: metaData
//   }, function(error, response) {
//     console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
//     console.log(arguments);
//   });
// }


// function getContentTypeByFile(fileName) {
//   var rc = 'application/octet-stream';
//   var fileNameLowerCase = fileName.toLowerCase();

//   if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
//   else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
//   else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
//   else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
//   else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
//   else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

//   return rc;
// }
// 	res.render('image_load', {title: "FUCKBEANS"})
// });

// app.post("/newuser", function(req, res) {
// 	var user = new User({
// 		userName: req.body.username,
// 		email: req.body.email});
// 		user.save(function (err, user) {
// 	  if (err) {
// 	 	  console.log('meow');
// 		}
// 		else {
// 			req.session.userid = user._id
// 			console.log(req.session.userid)
// 			res.redirect("/profile");
// 		}
// 	});
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook',
  	 { successRedirect: '/',
      failureRedirect: '/login' }
  )
);

app.post("/signin/:id", function(req, res) {
		var username = req.body.username
		var email = req.body.email
		User.find({userName: username}, function(err, user) {

		if(user[0].email === email) {

			res.redirect("/profile")
		}
		else {
			console.log('user login failed')
			res.redirect("/")
		}
	});
})

app.get("/profile", function(req, res) {
	console.log("hello")
	console.log(req.session.userid)

	var id = req.session.userid
	if(id) {
	User.findById(id, function(err,user) {
		if (err) {
			console.log("Search Error")
	 	  res.redirect("/")
		}
		else {
			console.log(user)
			res.render('profile', {
        "title" : "User profile",
        "profile" : user,
        "pets" : user.pets.reverse()
      });
		}
	});
	}
	else {
	res.redirect("/")
	};
});

app.get("/profile/:id", function(req, res) {
	console.log("Hello PROLFIE IDF")
});


app.post("/edit/:id")

}

