$(function(){
	var nav= $("nav");
	console.log();

	$("#hamburger").on("click", function(){
		nav.toggleClass("open");
	});
});