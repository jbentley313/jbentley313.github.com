//Wait until the DOM is ready
$(document).bind("pageinit", function(){

	var save = $("#submit");
	
	save.on("click", function(){
		
		var lastName = $("#studentLastName").val();
		var firstName = $("#studentFirstName").val();
		var score = $("#score").val();

		
		alert(lastName);
		Native.collectScore(lastName,firstName, score);

	});
});