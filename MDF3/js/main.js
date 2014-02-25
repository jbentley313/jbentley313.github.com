//Wait until the DOM is ready
$(document).bind("pageinit", function(){

	var save = $("#submit");
	save.on("click", function(){
		var arform = $("#addRecipeForm");
		arform.validate({
			
			submitHandler: function(){


				Native.uselessMethod("My very special String");
			}





		});