var Post = require("../models/post");
module.exports = function(app) {

	app.get('/messageboard', function(req, res){
		Post.find({}, function(err,post){
			if (err) {
				res.redirect('/')
			}
			else {
				console.log(post)
				res.render('messageboard', {
					'messageboard' : post
				})
			}
		})

	});



	app.post("/delete/:id", function(req, res){
		console.log("in the delete method")
		var id = req.params.id
		Post.findById(id, function(err, post){
			if(err) {
				console.log("BOOM...broken")
			}
			else {
				console.log("Found right Id")
				console.log(post)
				 post.remove( function ( err, post ){
				 	if(err) {
				 		console.log("its not deleted")
				 	}
				 	else {
				 		console.log("Deleted")
				 		res.redirect("/messageboard")
				 	}
				}); 	
			}
		});
	});

	app.post("/post", function(req, res){
		var post = new Post({
			title: req.body.title,
			post: req.body.content});
		SavePost(post, res)
	});


	app.get("/edit/:id", function(req,res) {
		var id = req.params.id
		Post.findById(id, function(err, post){
			console.log(post)
			res.render('edit', {
				'edit' : post
			})
		})
	});

	app.post("/edit/:id", function(req, res){
		var id = req.params.id
		var newPost = {
			title: req.body.title,
			post: req.body.post
		}
		Post.findById(id, function(err, post) {
			post.update(newPost)
			SavePost(post, res)
		})
	});
}


function SavePost(post, res){
	post.save(function (err, post) {
		if(err){
			console.log('meow')
		}
		else {
			res.redirect("/messageboard")
		}
	});
}
