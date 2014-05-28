$( document).ready(function(){
	console.log("asdfdfasd")
		$.get( "/weather", function( data ) {
			console.log(data)
  		$(".photo").append("<img src=''" + data + "'>")
		});
})