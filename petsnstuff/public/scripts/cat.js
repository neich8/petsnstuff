$( document).ready(function(){
	console.log("asdfdfasd")
		$.get( "/weather", function( data ) {
			console.log(data.weather)
			console.log(data.temp)
  		$(".photo").append("<img id='cat-pic' src=" + data.img + ">")
		});
})