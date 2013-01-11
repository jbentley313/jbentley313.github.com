//Jason Bentley
//ASD 1211 
//Project 4


var urlVars = function() {
	var urlData = $($.mobile.activePage).data("url");
	var urlParts = urlData.split('?');
	var urlPairs = urlParts[1].split('&');
	var urlValues = {};
	for (var pair in urlPairs) {
		var keyValue = urlPairs[pair].split('=');
		var key = decodeURIComponent(keyValue[0]);
		var value = decodeURIComponent(keyValue[1]);
		urlValues[key] = value;
	}
	return urlValues;
};

$(document).on("pageshow", "#recipeListPage", function() {
	var cat = urlVars()["cat"];
	$('#recipeList').empty();
	$.couch.db("asdproject").view("recipekeeper/" + cat, {
		"success": function(response){
			console.log(response);
			$.each(response.rows, function(index, recipe) {
					var RecipeName = recipe.value.RecipeName;
					var Rating = recipe.value.Rating;
					var Directions = recipe.value.Directions;
					var Recipe = recipe.value.Recipe;
					$('#recipeList').append(
						$('<li>').append(
							$('<a>').attr("href", "detailsPage.html?recipe=" + Recipe).text(RecipeName)
						)
					);
				});
				$('#recipeList').listview('refresh');

            },
            error: function(msg) {
            	console.log("Error.");
            	console.log(msg);
            }
	});

});

$(document).on("pageshow", "#detailsPage", function() {
	var recipeT = urlVars()["recipe"];


	$('#details').empty();
	$.couch.db("asdproject").openDoc(recipeT, {
		key: recipeT,
		"success": function(data) {
			var RecId = recipeT;
			var RecRev = data._rev;
			console.log("details id: " + RecId);
			console.log("details rev: " + RecRev);
			var RecipeName = data.RecipeName;
			var Rating = data.Rating;
			var Group = data.Group;
			var Directions = data.Directions;
			$('#details').append(
					$('<h2>').text(RecipeName),
					$('<p>').text("Group: " + Group),
					$('<p>').text("Rating: " + Rating),
					$('<p>').text("Directions: " + Directions)
			);
			$('#editButton').on('click', function() {
				$('#id').val(RecId);
				$('#rev').val(RecRev);
				$('#recipename').val(RecipeName);
				$('#rating').val(Rating);
				$('#groups').val(Group);
				$('#directions').val(Directions);
//				console.log("edit id: " + RecId);
//				console.log("edit rev: " + RecRev);
			});
			$('#deleteButton').on('click', function() {
				var ask = confirm("Are you sure you want to delete this recipe?");
				if(ask){
					var doc = {
						    _id: RecId,
						    _rev: RecRev
						};
						$.couch.db("asdproject").removeDoc(doc, {
						     success: function(data) {
						    	 alert('Recipe Deleted');
						    	 window.location.href="#home"; 
						    },
						    error: function(status) {
						        console.log(status);
						    }
						});


				}else{
					alert("Recipe was NOT deleted.");
				}		
			});
			

		}
	

	});

});

$(document).on('pageshow', "#addRecipe", function() {
	function storeData(){
//		alert('StoreDatafired');

	//Get all of our form field value and store in an object.
	//Object properties contain array with the form label and input values.
	var item 			= {};

		item._id		= $("#id").val();
		item._rev		= $("#rev").val();
		item.RecipeName	= $("#recipename").val();
		item.Group 		= $("#groups").val();
		item.Rating		= $("#rating").val();
		item.Directions = $("#directions").val();
//		console.log("store id: " + item._id);
//		console.log("store rev: " + item._rev);

	//Save data 
		var idcheck = item._id;
		if (idcheck === "") {
//			alert('id and rev not defined!!!!');
			delete item._id;
			delete item._rev;
		}
		$.couch.db("asdproject").saveDoc( item,	{
			success: function(data) {
				alert("Recipe Saved!"); 
				window.location.reload();
			},
			error: function(status) {
		        console.log(status);
		    }
		});


	}
	var save = $("#submit");
	save.on("click", function(){
		var arform = $("#addRecipeForm");
		arform.validate({
			invalidHandler: function(form, validator){
			},
			submitHandler: function(){
//				var data = arform.serializeArray();
//				parseRecipeForm(data);

				storeData();
			}
		});			
	});
});	

