$( document).ready(function(){
	console.log("asdfdfasd")
		$.get( "/weather", function( data ) {

  		$(".photo").append("<img id='cat-pic' src=" + data + ">")
		});
})