//Jason Bentley
//MiU 1207 
//Project 3




//Wait until the DOM is ready
$(document).bind("pageinit", function(){

	var arform = $("#addRecipeForm");
	arform.validate({
		invalidHandler: function(form, validator){
			
		},
		submitHandler: function(){
			var data = arform.serializeArray();
			parseRecipeForm(data);
			storeData();

		}
	});
	
	//Get ElementById function
	function gE(x){
		var theElement = document.getElementById(x);
		return theElement;
	}

// function toggleControls(n){
// 		switch(n){
// 			case "on":
// 				gE("addRecipeForm").style.display = "none";
// 				gE("clear").style.display = "inline";
// 				gE("display").style.display = "none";
// 				gE("addNew").style.display = "inline";
// 				break;
// 			case "off":
// 				gE("addRecipeForm").style.display = "block";
// 				gE("clear").style.display = "inline";
// 				gE("display").style.display = "inline";
// 				gE("addNew").style.display = "none";
// 				gE("items").style.display = "none";
// 				break;
// 			default:
// 				return false;
// 		}
// 	}
	

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
			item.recipename	= ["Recipe Name:", gE("recipename").value];
			item.groups 	= ["Group: ",gE("groups").value];
			item.rating		= ["Rating: ", gE("rating").value];
			item.date		= ["Date Added: ", gE("date").value];
			item.checks 	= ["Meal Time: " , tcheckedBoxes];
			item.directions = ["Directions: ", gE("directions").value];
		//Save data into Local Storage: Use Stringify to convert the object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Recipe Saved!");
		window.location="index.html";
	}
	function getData(){

		if(localStorage.length === 0){
			alert("There are no recipes to display! Default Data has been populated!");
			autoFillData();			
		}
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement("ul");

		makeDiv.appendChild(makeList);
		document.getElementById("displayTarget").appendChild(makeDiv);
		gE("items").style.display = "block";
		for(var i=0, len=localStorage.length; i<len;i++){
			var makeLi = document.createElement("li");
			makeLi.setAttribute("id", "ele");
			var linksLi= document.createElement("li");
			linksLi.setAttribute("id", "dL");
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var obj = JSON.parse(value);
			var makeSublist = document.createElement("ul");
			makeLi.appendChild(makeSublist);
			getImage(obj.groups[1], makeSublist);
			for(var n in obj){
				var makeSubli = document.createElement("li");
				makeSublist.appendChild(makeSubli);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSublist.appendChild(linksLi);

			}

			makeItemLinks(localStorage.key(i), linksLi); //Create edit and delete buttons for each item
		} 

	}
	//get image for category
	function getImage(catName, makeSublist){
		var imageLi = document.createElement("li");
		makeSublist.appendChild(imageLi);
		var newImg = document.createElement("img");
		var setSrc = newImg.setAttribute("src", "images/"+ catName + ".png");
		imageLi.appendChild(newImg);
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
		var editLink = document.createElement("a");
		editLink.href = "#addRecipe";
		editLink.key = key;
		var editText = "Edit Recipe";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		//add line break
		var breakTag = document.createElement("br");
		
		linksLi.appendChild(breakTag);


		//add delete single item link
		var deleteLink = document.createElement("a");
		deleteLink.href = "#display1";
		deleteLink.key = key;
		var deleteText = "Delete Recipe";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);


	}

	function editItem(){
		//grab data from item in l storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//Show form
		// toggleControls("off");

		//Populate form fields w/current lstorage vals
		gE("groups").value = item.groups[1];
		gE("recipename").value = item.recipename[1];
		gE("rating").value = item.rating[1];
		gE("date").value = item.date[1];
		gE("directions").value = item.directions[1];
		
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
		
		

		//remove initial listener from the input 'save recipe' button
		save.removeEventListener("click", storeData);
		//Change submit button value to Edit Button
		gE("submit").value = "Save Edited Recipe";
		var editSubmit = gE("submit");
		//save the key value estab in this func as a prpty of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", submit);
		editSubmit.key = this.key;
		// window.location="index.html#addRecipe";

	};

	

	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this recipe?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Recipe was deleted!");
			$("#display1").listview("refresh");
			

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
				window.location="index.html";
				return false;
			}else {
				alert("No Recipes Deleted!");
			}

		}
		return false;
	}

	

	//Variable Defaults
	var tcheckedBoxes
	;
	var parseRecipeForm = function(data){
		//uses form data here
		// console.log(data);
		// storeData();

	};
	

	//Set Link and Submit Click Events
	var displayLink = gE("display1");
	displayLink.addEventListener("click", getData);
	var clearLink = gE("clear");
	clearLink.addEventListener("click", clearLocal);
	var save = gE("submit");
	save.addEventListener("click", submit);



	
});

