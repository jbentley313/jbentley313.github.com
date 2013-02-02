// Jason Bentley AVF Project4Term 0113	

//Twitter Data with Native Device Info Mashup
$(document).on("pageshow", "#twit", function() {
    $("#twit-data-output").empty();
	$(function() {
            
        var devId = device.model;
    
   
 
        $.getJSON("http://search.twitter.com/search.json?q=" + devId + "&rpp=10&include_entities=true&lang=en&result_type=recent&callback=?",
            function(data) {
                console.log(data);
                $("#data-msg").html("<p>Latest Tweets about Your Device!</p>");

                for(i=0, j=data.results.length; i<j; i++) {
                    $("#twit-data-output")
                    .append("<li>" + "<p>" + "<img src='" + data.results[i].profile_image_url + "' /><br />" + data.results[i].text + ", <em>" + "<br />" + data.results[i].created_at + "<em>" + 
                    "</p>" + "<br />" + "</li>");
                };

            }
        );

        
    });
		
	
});


//Flickr Data and Geolocation Mashup	
$(document).on("pageshow", "#flikr", function() {
    $("#flik-data-output").empty();
	$(function() {
        function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    onDeviceReady();

    function onSuccess(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        $("#flik-data-output").append("<h1>" + 'Latitude: '  + lat  + '<br />' +
                                       'Longitude: ' + lon   + '<br />' + "</h1>"); 
        $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d6181cc5908b0d9e18d7ca7f30ee5d47&tags=recording&text=recording+studios&lat=" + lat + "&lon=" + lon + "&per_page=24&page=2&format=json&nojsoncallback=1",
            function(flikrd) {
                console.log(flikrd);
                if (flikrd.stat != "ok"){
                    alert("Flickr didn't work!");

                  return;
                 }
                $("#fdata-msg").html("<p>Recording Studio Pics around Your Location!</p>");
                
                for (i=0, j=flikrd.photos.photo.length; i<j; i++) {
                    tphoto = flikrd.photos.photo[i];
                    tUrl = "http://farm" + tphoto.farm + ".static.flickr.com/" + tphoto.server + "/" + tphoto.id + "_" + tphoto.secret + "_" + "m.jpg";
                    pUrl = "http://www.flickr.com/photos/" + tphoto.owner + "/" + tphoto.id;
                    $("#flik-data-output")
                    .append("<a" + "" + ' href="' + pUrl + '">' + '<img alt="'+ 
                    tphoto.title + '"src="' + tUrl + '"/>' + "</a>");

                }
            }
        );

               
    }
    

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
		
	});
});


//Compass 
$(document).on("pageshow", "#compass", function() {
	 document.addEventListener("deviceready", onDeviceReady, false);

     function onDeviceReady() {
        startWatch();
    }

    // Start watching the compass
    
    function startWatch() {

        var timeOptions = { frequency: 1000 };

        watchID = navigator.compass.watchHeading(onSuccess, onError, timeOptions);
    }

    // Stop watching the compass
    
    function stopWatch() {
        if (watchID) {
            navigator.compass.clearWatch(watchID);
            watchID = null;
        }
    }


    
    function onSuccess(heading) {
    	var	fullHeading = heading.magneticHeading;
    	var chead = Math.round(fullHeading);
    	var direction;
    	if(chead > 350 || chead <=10) {
    		direction = "North";
    	} 
    	if(chead >=11 && chead <= 60) {
    		direction = "Northeast";
    	}
    	if(chead >=61 && chead <= 110) {
    		direction = "East";
    	}
    	if(chead >=111 && chead <= 170) {
    		direction = "Southeast";
    	}
    	if(chead >=171 && chead <= 190) {
    		direction = "South";
    	}
    	if(chead >=191 && chead <= 260) {
    		direction = "Southwest";
    	}
    	if(chead >=261 && chead <= 310) {
    		direction = "West";
    	}
    	if(chead >=311 && chead <= 350) {
    		direction = "Northwest";
    	}
       $("#cmain").html("<h1>" + chead + " degrees " + "<br/>" + direction + "</h1>");
    }

    // onError: Failed to get the heading
    
    function onError(compassError) {
        alert('Compass error: ' + compassError.code);
    }
	    	
	   
});

// Connection Test
$(document).on("pageshow", "#connection", function() {
	$("#check").on("click", function () {

	        var network = navigator.connection.type;

	        var Ctype = {};
	        Ctype[Connection.UNKNOWN]  = 'Unknown';
	        Ctype[Connection.ETHERNET] = 'Ethernet';
	        Ctype[Connection.WIFI]     = 'WiFi';
	        Ctype[Connection.CELL_2G]  = '2G';
	        Ctype[Connection.CELL_3G]  = '3G';
	        Ctype[Connection.CELL_4G]  = '4G';
	        Ctype[Connection.NONE]     = 'No network connection';

	        $("#connectionMain").html("<h3>" + 'Connection type: ' + Ctype[network] + "</h3>");
	    
	});

});


//Device Test

$(document).on("pageshow", "#devicePage", function() {
	$("#devCheck").on("click", function () {

	       $("#deviceMain").html("<h1>" + "Device Name: "     + device.name     + "<br />" + 
	                            "Cordova Version: "  + device.cordova + "<br />" + 
	                            "Platform: " + device.platform + "<br />" + 
	                            "Device Model: "    + device.model     + "<br />" + 
	                            "Device Version: "  + device.version  + "<br />" + "</h1>");

	});
	

});

//
$(document).on("pageshow", "#geoPage", function()  {

    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    onDeviceReady();

    function onSuccess(position) {
        $("#geoSection").html("<h1>" + 'Latitude: '  + position.coords.latitude  + '<br />' +
                                       'Longitude: ' + position.coords.longitude   + '<br />' + "</h1>"); 
                            
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
});

$(document).on("pageshow", "#mash", function()  {
   onDeviceReady();


});
			
