//Jason Bentley
//ASD 1209 
//Project 1




//Wait until the DOM is ready
$(document).bind("pageinit", function(){

	var arform = $("#addRecipeForm");
	arform.validate({
		invalidHandler: function(form, validator){
			
		},
		submitHandler: function(){
			var data = arform.serializeArray();
			localStorage.setItem("arform", data);
			parseRecipeForm(data);
			// storeData();

		}
	});
	
	//Get ElementById function
	// function gE(x){
	// 	var theElement = document.getElementById(x);
	// 	return theElement;
	// }

function toggleControls(n){
		switch(n){
			case "on":
				$("#addRecipeForm").hide();
				$("#clear").show();
				$("#display1").hide();
				$("#addNew").show();
				break;
			case "off":
				
				// $("#addRecipe").show();
				$("#addRecipeForm").show();
				$("#clear").show();
				$("#display1").show();
				$("#addNew").hide();
				$("#items").hide();
				break;
			default:
				return false;
		}
	}
	

	function getCheckboxValues(){
		 	var	checkBoxes = document.getElementById("addRecipeForm").mealTime;
				tcheckedBoxes = [];
		for(var i=0; i<checkBoxes.length; i++){
			if(checkBoxes[i].checked){
			 newSelected = checkBoxes[i].value;
			tcheckedBoxes.push(newSelected);
			}	
		}
	}
	

	

	function storeData(key){
		//if no key, means brand new item that needs a key
		if(!key){
			var id 			= Math.floor(Math.random()*100000001);
		}else{
			//set id to existing key we are editing to save OVER data
			//the key is same key that's been passed along from editSubmit event handler
			//to the validate function, then passed here, into storeData function
			id = key;
		}
		getCheckboxValues();
		//Get all of our form field value and store in an object.
		//Object properties contain array with the form label and input values.
		var item 			= {};
			item.recipename	= ["Recipe Name:", $("#recipename").val()];
			item.groups 	= ["Group: ",$("#groups").val()];
			item.rating		= ["Rating: ", $("#rating").val()];
			item.date		= ["Date Added: ", $("#date").val()];
			item.checks 	= ["Meal Time: " , tcheckedBoxes];
			item.directions = ["Directions: ", $("#directions").val()];
		//Save data into Local Storage: Use Stringify to convert the object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Recipe Saved!");
		window.location.reload();
		
	}
	function getData(){

		// toggleControls("on");

		if(localStorage.length === 0){
			alert("There are no recipes to display! Default Data has been populated!");
			autoFillData();			
		}
		var makeDiv = $("<div>");
		makeDiv.attr("id", "items");
		var makeList = $("<ul>");

		makeDiv.append(makeList);
		$("#displayTarget").append(makeDiv);
		$("#items").show();
		for(var i=0, len=localStorage.length; i<len;i++){
			var makeLi = $("<li>");
			// makeLi.setAttribute("id", "ele");
			var linksLi= $("<li>");
			// linksLi.setAttribute("id", "dL");
			makeList.append(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var obj = JSON.parse(value);
			var makeSublist = $("<ul>");
			makeLi.append(makeSublist);
			getImage(obj.groups[1], makeSublist);
			for(var n in obj){
				var makeSubli = $("<li>");
				makeSublist.append(makeSubli);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubli.text(optSubText);
				makeSublist.append(linksLi);

			}

			makeItemLinks(localStorage.key(i), linksLi); //Create edit and delete buttons for each item
		} 

	}
	//get image for category
	function getImage(catName, makeSublist){
		var imageLi = $("<li>");
		makeSublist.append(imageLi);
		var newImg = $("<img>");
		var setSrc = newImg.attr("src", "images/"+ catName + ".png");
		imageLi.append(newImg);
	}
	//Auto Populate Local Storage
	function autoFillData(){
		//The actual JSON OBJECT data required is coming from json.js loaded from html page
		//Store JSON OBJ to Local Storage
		for(var n in json){
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));

		}
	}
	//Make Item Links
	//Create edit and delete links for eachstored item when disp
	function makeItemLinks(key, linksLi){
		var editLink = $("<a>");
		editLink.attr("href", "#");
		editLink.attr("key", key);
		var editText = "Edit Recipe";
		editLink.on("click", editItem);
		editLink.text(editText);
		linksLi.append(editLink);

		//add line break
		var breakTag = $("<br>");
		
		linksLi.append(breakTag);


		//add delete single item link
		var deleteLink = $("<a>");
		deleteLink.attr("href", "#");
		deleteLink.attr("key", key);
		var deleteText = "Delete Recipe";
		deleteLink.on("click", deleteItem);
		deleteLink.text(deleteText);
		linksLi.append(deleteLink);


	}

	function editItem(key){
		//grab data from item in l storage
		var value = localStorage.getItem(key);
		var item = JSON.parse(value);

		//Show form
		toggleControls("off");

		//Populate form fields w/current lstorage vals

		
		$("#recipename").val(item.recipename[1]);
		$("#groups").val(item.groups[1]);
		$("#rating").val(item.rating[1]);
		$("#date").val(item.date[1]);
		$("#directions").val(item.directions[1]);
		
		var placeValues = function(){
			var checkboxes = document.getElementById("addRecipeForm").mealTime;
			for(i=0, j=checkboxes.length; i<j; i++){
				for(n=0, m=item.checks[1].length; n<m; n++){
					if(checkboxes[i].value === item.checks[1][n]){
						checkboxes[i].setAttribute("checked", "checked");
					}
				}
			}
			//console.log(item.checks);//console log to make sure the correct items have been saved
		};
		placeValues();
		// console.log(item.checks);
		
		// alert("yo");

		//remove initial listener from the input 'save recipe' button
		save.off("click", storeData);
		//Change submit button value to Edit Button
		$("#submit").attr("value", "Save Edited Recipe");
		var editSubmit = $("#submit");
		//save the key value estab in this func as a prpty of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.on("click", submit);
		editSubmit.attr ("key", this.key);
		

	};

	

	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this recipe?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Recipe was deleted!");
			window.location.reload();
			

		}else{
			alert("Recipe was NOT deleted.");
		}		
	}

	function clearLocal(){
		var ask = confirm("Are you sure you want to delete ALL of your recipes?");
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			if(ask){
				localStorage.clear();
				alert("All recipes are deleted!");
				
				return false;
			}else {
				alert("No Recipes Deleted!");
			}
window.location.reload();
		}
		return false;
	}

	

	//Variable Defaults
	var tcheckedBoxes
	;
	var parseRecipeForm = function(data){
		//uses form data here
		// console.log(data);
		storeData();

	};
	

	//Set Link and Submit Click Events
	var displayLink = $("#display1");
	displayLink.on("click", getData);
	var clearLink = $("#clear");
	clearLink.on("click", clearLocal);
	var save = $("#submit");
	save.on("click", storeData);



	
});

