//Wait until the DOM is ready
$(document).bind("pageinit", function(){

	var save = $("#submit");


	//save on click handler
	save.on("click", function(){

		var lastName = $("#studentLastName").val();
		var firstName = $("#studentFirstName").val();
		var score = $("#score").val();


		alert(score + lastName + firstName);

		//call method on device
		Native.collectScore(lastName,firstName, score);
		$["home"].reset(); 

	});

var scoresList = $("#scores");
scoresList.on("click", function () {
	// alert("display scores clicked!");
	Native.displayScores();
})

});