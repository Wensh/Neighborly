var venuelat;
var venlong;
var counterpark = 0;

var map;
var fsVenues;


/*
// ############
//    Part 1 - get foursquare data
// ############
*/


$(document).ready(function() {
	initialiseGoogleMaps();
});
	
$(document).ready(function() {
	$('#btnSubmit').on('click', function(e){
		var location = $('#messageInputLoc').val();
		var query = $('#messageInputName').val();
		
		//var location = "Delft";
		//var query = "TU";
		
		//Step 1: get foursquare data
		getFoursquareVenues(query, location);
	});
});	


	/*
	// ############
	//    Part - Query
	// ############
	*/
	
	$(document).ready(function() {
		$('#btnQuery').on('click', function(e){

			query();
			
		});
	});	
	
	function query(){	
			var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT ?data WHERE {<http://iwagroup08.org/Westland> cbs:drugsmisdrijven ?data }';
			var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
			var format = 'json';

			$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){		
					console.log(json);
					var pre = $('<pre></pre>');
					pre.text(JSON.stringify(json));
					$('#linktarget2').html(pre);
			});
			//$('#linktarget1').html(ul);
	}



	/*
	// ############
	//    Part 1 - get foursquare data
	// ############
	*/


function foursquareVenuesGoogleMaps(city){
	 var lld_autocomplete_url = 'https://api.foursquare.com/v2/venues/search?radius=3000';
	
	 var data = {'near': city, 'categoryId': '4bf58dd8d48988d163941735', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140317'}
	
	 $.getJSON(lld_autocomplete_url, data=data, function(json){
	
	});
}
	
	
	function getFoursquareVenues(query, location){
		//Login details
		var foursquareURL = 'https://api.foursquare.com/v2/venues/search?radius=3000';
		
		var data = {'near': location, 'categoryId': '4bf58dd8d48988d163941735', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140317'}
	 
		
		var limit = 50;

		$.getJSON(foursquareURL, data=data, function(foursquareJson){
			//Step 1.2:  Show foursquare data in table
			foursquareToTable(foursquareJson);
			
			//Store all foursquare venues in global variable 'fsVenues'
			storeFoursquareVenues(foursquareJson);	
					
			//Part 2: Plot foursquare data on Google Maps
			adaptGoogleMaps(foursquareJson);
		});
	}
	
	function storeFoursquareVenues(foursquareJson){
		this.fsVenues = foursquareJson.response.venues;
	}
	
	function foursquareToTable(foursquareJson){
		var table = '<table class="table table-condensed" style="width:100%"><tr><th> </th><th>Name</th><th>Category</th><th>Address</th><th>City</th><th>Country</th></tr>';
		var count = 1; 
		
		$.each(foursquareJson.response.venues, function(i,venues){
			tableRow = '<td>' + count + '</td>';
            name = '<td>' + venues.name + '</td>';
			
			if(venues.categories.length == 0 ){
				category = '<td>undefined</td>';
			}
			else{
				category = '<td>' + venues.categories[0].name + '</td>';
			}
            locationAddress = '<td>' + venues.location.address + '</td>';
			locationCity = '<td>' + venues.location.city + '</td>';
			locationCountry = '<td>' + venues.location.country + '</td>';
			clickButton = '<td><button onclick ="selectVenue('+ i +')" class="editbtn">Select Venue</button></td>';
			tablerow = '<tr>' + tableRow + name + category + locationAddress + locationCity + locationCountry + clickButton + '</tr>';
			count = count + 1;
			
			table = table + tablerow;
		});
		table = table + '</table>';
		$("#queryResult").html(table);
	}

/* #############
// ### Part 1b - get venue user's tips ###
// ############
*/
	/* Selects the venue (i) from the fsVenues array
		- to get tips [Foursquare], display tips and apply sentiment analysis
	*/
	function selectVenue(i){
		var pre = $('<pre></pre>');
		pre.text(JSON.stringify(fsVenues[i]));
		$("#tblVenueOverall").html(pre);
		
		//Get user tips about Foursquare venue
		getFoursquareVenueTips(fsVenues[i].id);		
	}
	
	// To get the tips (comments from users) about venues on Foursquare
	/* 	-Example on FS:
	https://developer.foursquare.com/docs/explore#req=venues/4a27db80f964a5202c941fe3/tips%3Fv%3D20140218
	*/
	function getFoursquareVenueTips(fsVenue_id){
		var foursquare_url = 'https://api.foursquare.com/v2/venues/'+fsVenue_id+'/tips';
		
		var client_id = 'DU13IWX4P0Z1UPFMQFCPZ0GKP5S11YOQAUXVJLOU1KX35OWR';
		var client_secret = 'F4JZL1GFIPWAMN42WR513QHGUEPLNZ1AO04EPM25EGH1WWX3';
		var v_key = '20140223';
		//var limit =500; // Max number of result 
		
		var data = {'client_id': client_id, 'client_secret': client_secret, 'v': v_key} // {, 'limit':limit} 

		$.getJSON(foursquare_url, data=data, function(foursquareJson){
			var pre = $('<pre></pre>');
			pre.text(JSON.stringify(foursquareJson));
			$("#tblVenueTips").html(pre);
			tipsToTable(foursquareJson);
		});
	}
	
	function tipsToTable(foursquareJson){
		var table = '<table class="table table-condensed" style="width:100%"><tr><th> </th><th>Text</th><th>Language</th><th>User firstName</th><th>User gender</th><th>Sentiment</th></tr>';
		var count = 1; 
		
		$.each(foursquareJson.response.tips.items, function(i,items){
			//if(items.lang == "en"){
				tableRow = '<td>' + count + '</td>';
				tipText = '<td>' + items.text + '</td>';
				tipLang = '<td>' + items.lang + '</td>';
				userFirstName = '<td>' + items.user.firstName + '</td>';
				userGender = '<td>' + items.user.gender + '</td>';
				
				//sentiment = sentimentAnalyser(items.text);
				sentiment = sentimentVivekn(items.text);
				
				sentiment = '<td>' + sentiment + '</td>';
				
				tablerow = '<tr>' + tableRow + tipText + tipLang + userFirstName + userGender + sentiment + '</tr>';
				count = count + 1;
			//}
			table = table + tablerow;
		});
		table = table + '</table>';
		$("#tblVenueTipsFormated").html(table);
	}

/* #############
// ### Part 1c - Apply sentiment analysis on user's tips ###
// ############
*/
	/* Analyser: Datumbox
	
	Documentation:
	-Options:
	http://www.datumbox.com/api-sandbox/
	
	-API:
	http://www.datumbox.com/api-sandbox/listings/Document-Classification
	
	-Example:
	http://api.datumbox.com/1.0/SentimentAnalysis.json?api_key=1bce051279fc6005c060e0360b7b16c6&text=stupid
	*/
	
	function datumBoxsentimentAnalyser(text){
		console.log("Text: " + text);
		
		var api_key = '1bce051279fc6005c060e0360b7b16c6';
		var datumbox_base_url = 'http://api.datumbox.com/1.0/';
		var analyser = 'SentimentAnalysis.json'
		var datumbox_url = datumbox_base_url + analyser;
		
		var data = {'api_key': api_key, 'text': text}
	
		var sentiment;
		
		//Get request on Datumbox API
		$.ajax({ 
			url: datumbox_url, 
			dataType: 'json', 
			data: data, 
			async: false, 
			success: function(json){ 
				if(json.output.status != 0){
					sentiment =  json.output.result;
				}
				else{
					sentiment = 'error';
				}
			} 
		});
		return sentiment;
	}
	
	

	function processReaction(json){
		var result;
		
		if(json.output.status != 0){
			result =  json.output.result;
		}
		else{
			console.log(json);
			result = 'error';
		}
		
		return result;
	}
	
	
	/*==============================
	== 2. http://sentiment.vivekn.com/ ==
	================================
	*/
	function sentimentVivekn(text){
		//console.log("Text: " + text);
		var url = 'http://sentiment.vivekn.com/api/text/';
		var data = {'txt': text}
		var result; 
		
		//POST request on Sentiment Vivekn API
		$.ajax({ 
			type: "POST",
			url: url, 
			dataType: 'json', 
			data: data, 
			async: false, 
			success: function(json){
				result = '' + json.result.sentiment + ', confidence: \'' + json.result.confidence + '\'.';
			} 
		});
		//console.log(result);
		return result;
	}
	
	http://text-processing.com/

	/*==================================
	== 3. http://text-processing.com/ ==
	====================================
	*/
	
	function ntlkTextProcessing(text){
		
		var url = 'http://text-processing.com/api/sentiment/';
		var data = {'text': text};
		var result; 
		
		//Get request on Datumbox API	
		$.ajax({ 
			// ERROR: 
			// XMLHttpRequest cannot load http://text-processing.com/api/sentiment/. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:5000' is therefore not allowed access.
			type: "POST",
			crossDomain: true,
			url: url, 
			dataType: 'json', 
			data: data, 
			async: false, 
			success: function(json){
				console.log(json);
				result = '' + json.result.sentiment + ', confidence: \'' + json.result.confidence + '\'.';
				
			} 
			
		});
		
		console.log(result);
		return result;
	}
	
	
	
	/*
	// ############
	//    Sentiment Analysis - test button
	// ############
	*/
	
$(document).ready(function() {
	$('#btnSentiment').on('click', function(e){
		var sentimentArr = [];
		var sentiment;

		var text = 'There are several lines. Just walk up to the register.';
		
		sentiment = sentimentVivekn(text);		
		sentimentArr.push({'text':text, 'sentiment':sentiment});
		
		/*
		var text = 'Try the Apple Juice (via @Foodspotting)';
		sentiment = sentimentAnalyser(text);
		sentimentArr.push({'text':text, 'sentiment':sentiment});
		
		var text = 'Always go to far left register when its busy';
		sentiment = sentimentAnalyser(text);
		sentimentArr.push({'text':text, 'sentiment':sentiment});
		
		*/
		sentimentToTable(sentimentArr)	
		
	});
});

	function sentimentToTable(sentimentArr){
		var table = '<table class="table table-condensed" style="width:100%"><tr><th> </th><th>Text</th><th>Sentiment</th></tr>';
		var count = 1; 
		
		$.each(sentimentArr, function(item){
			//if(items.lang == "en"){
				tableRow = '<td>' + count + '</td>';
				text = '<td>' + sentimentArr[item].text + '</td>';
				sentiment = '<td>' + sentimentArr[item].sentiment + '</td>';
				
				tablerow = '<tr>' + tableRow + text + sentiment + '</tr>';
				count = count + 1;
			
			table = table + tablerow;
		});
		table = table + '</table>';
		$("#tblVenueTipsFormated").html(table);
	}
	
	

	
	/*
	// ############
	//    Part 2 - Google Maps
	// ############
	*/

	// When entering website, initialise Google Maps
	function initialiseGoogleMaps() {
	  var myLatlng = new google.maps.LatLng(52.3,4.88);
	  var mapOptions = {
		zoom: 4,
		center: myLatlng
	  }
	  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}

	// After submit button pressed, adapt Google Maps
	function adaptGoogleMaps(foursquareJson) {
		var firstVenue = 'false';
		
		//Loop over all venues of Foursquare
		$.each(foursquareJson.response.venues, function(i,venue){
			// Refresh map, to zoom to first venue result
			if(firstVenue == 'false'){
				refreshGoogleMaps(venue)
				firstVenue = 'true';
			}
			createVenueMarkerOnGoogleMaps(i, venue);
		});
	}

	function refreshGoogleMaps(venue){
		  var venueLatlng = new google.maps.LatLng(venue.location.lat,venue.location.lng);
		  var mapOptions = {
			zoom: 13,
			center: venueLatlng
		  }
		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	
	function createVenueMarkerOnGoogleMaps(i, venue){
		var venueLatlng = new google.maps.LatLng(venue.location.lat,venue.location.lng);
		var marker = new google.maps.Marker({
			  position: venueLatlng,
			  map: map,
			  icon:'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+ (i + 1) +'|FF776B|000000',
            
			  title: venue.name
		  });
		  
		var infowindow = new google.maps.InfoWindow({
			content: "" + venue.name
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});
	}





/*

 //Search Foursquare
$('#btnSubmit').on('click', function(e){
	var city = $('#messageInput1').val();
	//
	//var venues = foursquare(city);
	
	//googleMaps();
	

	
	//var foursquare = foursquareVenuesGoogleMaps();
	//googleMaps()
});


function foursquare(city){
	var lld_autocomplete_url = 'https:api.foursquare.com/v2/venues/search?radius=3000';
	
	 var data = {'near': city, 'categoryId': '4bf58dd8d48988d163941735', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140317'}
	
	 $.getJSON(lld_autocomplete_url, data=data, function(json){
		return json.response.venues;
	});
}


function googleMaps(venues){
	var ul = $('<ul></ul>');
	ul.addClass('list-group');

	var map_canvas = document.getElementById('map_canvas');
	var map_options = {
		 center: new google.maps.LatLng(-25.363882,131.044922),
		 zoom: 8,
		 mapTypeId: google.maps.MapTypeId.ROADMAP
	};
		 
	var map = new google.maps.Map(map_canvas, map_options);
	
	for (var i in json.response.venues) {
		counterpark++;
		var r = json.response.venues[i];
		var label = r.name;
		var venuelat = r.location.lat;
		var venlong = r.location.lng;

		var li = $('<li></li>');
		li.addClass('list-group-item');
		var a = $('<a></a>');
		a.html(label);

		li.append(a);
		ul.append(li);

		var myLatlng = new google.maps.LatLng(venuelat, venlong);
		 var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: label,
			});
		map.panTo(marker.getPosition());
	}
}


function foursquareVenuesGoogleMaps(city){
	 var lld_autocomplete_url = 'https:api.foursquare.com/v2/venues/search?radius=3000';
	
	 var data = {'near': city, 'categoryId': '4bf58dd8d48988d163941735', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140317'}
	
	 $.getJSON(lld_autocomplete_url, data=data, function(json){
	
	});
}


function query(){	
		var query = 'PREFIX cbs: <http:www.cbs.nl/> SELECT ?data WHERE {<http:iwagroup08.org/Westland> cbs:seks ?data .}';
		var endpoint = 'http:localhost:8080/openrdf-sesame/repositories/owlim-lite-test';
		var format = 'RDF';

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){
				var pre = $('<pre></pre>');
				pre.text(JSON.stringify(json));
				$('#linktarget2').html(pre);
		});
		$('#linktarget1').html(ul);
}
*/