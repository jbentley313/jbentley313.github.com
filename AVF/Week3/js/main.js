// Jason Bentley AVF Project3 Term 0113	

//Twitter Integration
$(document).on("pageshow", "#twit", function() {
	$(function() {
		$.getJSON("http://search.twitter.com/search.json?q=pro%20tools&rpp=10&include_entities=true&lang=en&result_type=recent&callback=?",
			function(data) {
				console.log(data);
				$("#data-msg").html("<p>Latest Tweets about Avid Pro Tools!</p>");
				for(i=0, j=data.results.length; i<j; i++) {
					$("#twit-data-output")
					.append("<li>" + "<p>" + "<img src='" + data.results[i].profile_image_url + "' /><br />" + data.results[i].text + ", <em>" + "<br />" + data.results[i].created_at + "<em>" + 
					"</p>" + "<br />" + "</li>");
				};
			}
		);
	});
});


//Flickr Integration	
$(document).on("pageshow", "#flikr", function() {
	$(function() {
		$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d6181cc5908b0d9e18d7ca7f30ee5d47&tags=protools%2C+pro+tools&per_page=12&page=1&format=json&nojsoncallback=1",
			function(flikrd) {
				console.log(flikrd);
				if (flikrd.stat != "ok"){
					alert("Flickr didn't work!");

				  return;
				 }
				console.log(flikrd);
				$("#fdata-msg").html("<p>Latest Flickr Pics about Avid Pro Tools!</p>");
				
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
 // http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=08388e6665cb979637d57eccb95938d8&tags=protools&per_page=10&page=1&format=json
// "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f4ea255519afa6ca85e0b894ff4f029d&tags=pro+tools%2C+protools&per_page=10&page=2&format=json&nojsoncallback=1&auth_token=72157632550114110-894718a915ad2459&api_sig=12774dd1b602fd7d851f3ad8dc078ab6",
			
