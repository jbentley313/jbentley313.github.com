//Jason Bentley
//MiU 1207 
//Project 2

//Wait until the DOM is ready
window.addEventListener("DOMContentLoaded", function(){




	//Get ElementById function
	function gE(x){
		var theElement = document.getElementById(x);
		return theElement;
	}


	//Create select field element and populate with options
	function makeCats() {
		var formTag = document.getElementsByTagName("form"),
			selectLi = gE("select"),
			makeSelect = document.createElement("select");
			makeSelect.setAttribute("id", "groups");
		for(var i=0, j=mealType.length; i<j; i++){
			var makeOption = document.createElement("option");
			var optText = mealType[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}

	function getCheckboxValues(){
		 	var	checkBoxes = document.forms[0].mealTime;
				tcheckedBoxes = [];
		for(var i=0; i<checkBoxes.length; i++){
			if(checkBoxes[i].checked){
			 newSelected = checkBoxes[i].value;
			tcheckedBoxes.push(newSelected);
			}	
		}
	}

	function toggleControls(n){
		switch(n){
			case "on":
				gE("recipeForm").style.display = "none";
				gE("clear").style.display = "inline";
				gE("display").style.display = "none";
				gE("addNew").style.display = "inline";
				break;
			case "off":
				gE("recipeForm").style.display = "block";
				gE("clear").style.display = "inline";
				gE("display").style.display = "inline";
				gE("addNew").style.display = "none";
				gE("items").style.display = "none";
				break;
			default:
				return false;
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
		getCheckboxValues()
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
	}
	function getData(){
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There are no recipes to display! Default Data has been populated!");
			autoFillData();			
		}
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement("ul");

		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		gE("items").style.display = "block";
		for(var i=0, len=localStorage.length; i<len;i++){
			var makeLi = document.createElement("li");
			makeLi.setAttribute("id", "ele");
			var linksLi= document.createElement("li");
			linksLi.setAttribute("id", "dL")
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
	//get image for catefory
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
		editLink.href = "#";
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
		deleteLink.href = "#";
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
		toggleControls("off");

		//Populate form fields w/current lstorage vals
		gE("groups").value = item.groups[1];
		gE("recipename").value = item.recipename[1];
		gE("rating").value = item.rating[1];
		gE("date").value = item.date[1];
		gE("directions").value = item.directions[1];
		
		var placeValues = function(){
			var checkboxes = document.forms[0].mealTime;
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

		//remove initial listener from the input 'save recipe' button
		save.removeEventListener("click", storeData);
		//Change submit button value to Edit Button
		gE("submit").value = "Edit Recipe";
		var editSubmit = gE("submit");
		//save the key value estab in this func as a prpty of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
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
		if(localStorage.length === 0){
			alert("There is no data to clear.")
		}else{
			localStorage.clear();
			alert("All recipes are deleted!");
			window.location.reload();
			return false;
		}
	}

	function validate(e){
		//define elements we want to check
		var getGroup = gE("groups");
		var getRecipeName = gE("recipename");
		var getDirections = gE("directions");

		//Reset Error Messages
		errMsg.innerHTML = "";
		getGroup.style.border ="1px solid black";
		getRecipeName.style.border ="1px solid black";
		getDirections.style.border ="1px solid black";

		//Get error messages
		var messageAry = [];

		//recipe name val
		if(getRecipeName.value === ""){
			var recipeNameError = "Please enter a recipe name."
			getRecipeName.style.border ="1px solid red";
			messageAry.push(recipeNameError);
		}

		//group val
		if(getGroup.value === "--Select--"){
			var groupError = "Please select type of dish.";
			getGroup.style.border ="1px solid red";
			messageAry.push(groupError);
		}

		//directions val
		if(getDirections.value === ""){
			var directionTxtsError = "Please enter the recipe directions.";
			getDirections.style.border ="1px solid red";
			messageAry.push(directionTxtsError);
		}

		//if errors present, then display them on the screen.
		if(messageAry.length >= 1){
			for(var i=0, j=messageAry.length; i < j; i++){
				var txt = document.createElement("li");
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		}else{
			//all good = then save the data
			//send key value (from editData func)
			storeData(this.key);
		}

	}

	//Variable Defaults
	var mealType = ["--Select--", "Chicken", "Beef", "Pork", "Veggie"],
		tcheckedBoxes,
		errMsg = gE("errors")
	;

	makeCats();

	//Set Link and Submit Click Events
	var displayLink = gE("display");
	displayLink.addEventListener("click", getData);
	var clearLink = gE("clear");
	clearLink.addEventListener("click", clearLocal);
	var save = gE("submit");
	save.addEventListener("click", validate);



});

