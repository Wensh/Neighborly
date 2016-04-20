var venuelat;
var venlong;

var map;
var fsVenues;
var location;


	/*
	// ############
	//   Buttons - Event handlers
	// ############
	*/


	$(document).ready(function() {
		initialiseGoogleMaps();
	});
	
	$(document).ready(function() {
		$('#btnSubmit').on('click', function(e){
			// var location = $('#messageInputLoc').val();
			// var query = $('#messageInputName').val();

		//var location = "Delft";
		//var query = "TU";
		
		//Step 1: get foursquare data
		// getFoursquareVenues(query, location);
	});
	});	


	/*
	// ############
	//    Part - Query
	// ############
	*/
	$(document).ready(function() {
		$('#btnQuery').on('click', function(e){
			var location = $('#cityInput').val();
			var location = capitaliseFirstLetter(location);
			query(location);
			queryTotalCrimes(location);
			queryDistanceTrain(location);
			queryDistanceRoad(location);
			getFoursquareVenues(location);		
		});
	});	
	
	function query(location){	
		var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT * WHERE {<http://iwagroup08.org/'+location+'> cbs:drugsmisdrijven ?drugsmisdrijven; cbs:seksmisdrijf ?seksmisdrijf;cbs:vermogensmisdrijven ?vermogensmisdrijven; cbs:vernielingen ?vernielingen; cbs:wapenmisdrijven ?wapenmisdrijven; cbs:verkeersmisdrijf ?verkeersmisdrijf; cbs:oningedeeld ?oningedeeld; cbs:overigemisdrijf	?overigemisdrijf.}';
		var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
		var format = 'json';

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){		
			console.log(json);	
			var vars = json.head.vars;
			var ul = $('<ul></ul>');
			ul.addClass('list-group');

			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');
				li.addClass('list-group-item');

				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];

					li.append('<strong>'+v+'</strong><br/>');
					li.append(v_value);
					li.append('<br/>');
				});
				ul.append(li);
			});
			$('#linktarget2').html(ul);
		});
	}

	function queryTotalCrimes(location) {
		var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT ?totaalmisdrijven WHERE { <http://iwagroup08.org/'+location+'> cbs:totaalmisdrijven ?totaalmisdrijven.}';
		var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
		var format = 'json';

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){		
			console.log(json);	
			var vars = json.head.vars;
			var ul = $('<ul></ul>');
			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');

				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
					if (v_value <25) {
						var starNumber = 5;
					}
					else if (v_value >25 && v_value <50) {
						var starNumber = 4;
					}
					else if (v_value >50 && v_value <75) {
						var starNumber = 3;
					}
					else if (v_value >75 && v_value <100) {
						var starNumber = 2;
					}
					else {
						var starNumber = 1;
					}
					li.append('<strong>'+v+'</strong><br/>');
					li.append(starNumber);
				});
				ul.append(li);
			});
			$('#linktarget3').html(ul);
		});
	}

	function queryDistanceTrain(location) {
		var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT ?afstandtrein WHERE { <http://iwagroup08.org/'+location+'> cbs:afstandtrein ?afstandtrein.}';
		var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
		var format = 'json';

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){		
			console.log(json);	
			var vars = json.head.vars;
			var ul = $('<ul></ul>');
			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');

				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
					if (v_value <1) {
						var starNumber = 5;
					}
					else if (v_value >1 && v_value <5) {
						var starNumber = 4;
					}
					else if (v_value >5 && v_value <10) {
						var starNumber = 3;
					}
					else if (v_value >10 && v_value <15) {
						var starNumber = 2;
					}
					else {
						var starNumber = 1;
					}
					li.append('<strong>'+v+'</strong><br/>');
					li.append(starNumber);
				});
				ul.append(li);
			});
			$('#linktarget4').html(ul);
		});
	}

	function queryDistanceRoad(location) {
		var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT ?weg WHERE { <http://iwagroup08.org/'+location+'> cbs:afstandweg ?weg.}';
		var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
		var format = 'json';

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){		
			console.log(json);	
			var vars = json.head.vars;
			var ul = $('<ul></ul>');
			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');

				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
					if (v_value <1) {
						var starNumber = 5;
					}
					else if (v_value >1 && v_value <5) {
						var starNumber = 4;
					}
					else if (v_value >5 && v_value <10) {
						var starNumber = 3;
					}
					else if (v_value >10 && v_value <15) {
						var starNumber = 2;
					}
					else {
						var starNumber = 1;
					}
					li.append('<strong>'+v+'</strong><br/>');
					li.append(starNumber);
				});
				ul.append(li);
			});
			$('#linktarget5').html(ul);
		});
	}

	function convertToStart(){

	}

	/*==========================
	  === AUTOCOMPLETE ===
	  ========================
	  */

	  $(document).ready(function() {
	  	$('#inputSearchLoc').on('input', function(e){
	  		var location = $('#inputSearchLoc').val();
	  		var length = location.length;
	  		if(location.length > 2){
	  			queryAutocompleteLocation(location);
	  		}
	  	});
	  });


	  function queryAutocompleteLocation(location){				
	  	var query = 'PREFIX iwa: <http://www.iwagroup08.org/>  PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dbpedia:	<http://dbpedia.org/resource/> SELECT distinct ?label WHERE{		?city a iwa:Settlement.    ?city rdfs:label ?label	FILTER CONTAINS(?label, "' +  location + '") }' ;
			
			var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
			var format = 'json';
			
			console.log('werkt dit?');

			$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){
				//console.log('sparql output');
				console.log(json);
				var i;
				var settlementsArr = [];
				var length = json.results.bindings.length;	
				for(i=0; i<length; i++){
					//settlementsArr.push(json.results.bindings[i].label.value);	
					if(json.results.bindings[i].label['xml:lang'] == "en"){
						settlementsArr.push(json.results.bindings[i].label.value)
						console.log(json.results.bindings[i]);
						
					}
				}
				
				$( "#inputSearchLoc" ).autocomplete({
					source: settlementsArr
				});
			});
		}
		
		$(document).ready(function() {
			$('#btnSearchLoc').on('click', function(e){
				var location = $('#inputSearchLoc').val();
				
				
				
			});
		});	
		
		function askIfMunicipality(location){
			var query = 'PREFIX cbs:<http://www.cbs.nl/> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> ASK{	?municipality rdf:label "' + location + '"@en. 	?municipality 	rdf:type cbs:Municipality.}'

			$.get('/sparql',data={'endpoint': 'http://localhost:8080/openrdf-sesame/repositories/Neighborly', 'query': query, 'format': 'json'}, function(json){
				//console.log('sparql output');
				console.log(json);
			
			});
		}
		
		
		/*
		$(document).ready(function() {
			$('#btnSearchLoc').on('click', function(e){
				var location = $('#inputSearchLoc').val();

		//var location = "Delft";
		//var query = "TU";
		
		//Step 1: get foursquare data
		getFoursquareVenues(query, location);
	});
		});	
	*/

	/*
	// ############
	//    Foursquare - get venues on CATEGORY-ID 
	// ############
	*/

	function foursquareVenuesGoogleMaps(city){
		var lld_autocomplete_url = 'https://api.foursquare.com/v2/venues/search?radius=3000';

		var data = {'near': city, 'categoryId': '4bf58dd8d48988d163941735', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140317'}

		$.getJSON(lld_autocomplete_url, data=data, function(json){

		});
	}

	function getFoursquareVenues(location){
		//Login details
		var foursquareURL = 'https://api.foursquare.com/v2/venues/search?radius=3000';		
		var data = {'near': location, 'categoryId': '4bf58dd8d48988d163941735', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140320'}
		var dataSchools = {'near': location, 'categoryId': '4f4533804b9074f6e4fb0105', 'oauth_token': 'YQEWT1Z4OMHUYE3CEXIAD1QLHH0GFXVMPQOO14X0FMQ3V40K', 'v': '20140320'}

		$.getJSON(foursquareURL, data=data, function(json){

			var ul = $('<ul></ul>');
			ul.addClass('list-group');

			for (var i in json.response.venues) {
				var r = json.response.venues[i];
				var label = r.name;

				var li = $('<li></li>');
				li.addClass('list-group-item');
				var a = $('<a></a>');
				a.html(label);

				li.append(a);
				ul.append(li);
			}
			$('#linktarget6').html(i);
		});

		$.getJSON(foursquareURL, data=dataSchools, function(json){

			var ul = $('<ul></ul>');
			ul.addClass('list-group');

			for (var i in json.response.venues) {
				var r = json.response.venues[i];
				var label = r.name;

				var li = $('<li></li>');
				li.addClass('list-group-item');
				var a = $('<a></a>');
				a.html(label);

				li.append(a);
				ul.append(li);
			}
			$('#linktarget7').html(i);
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
			clickButton = '<td><button" class="editbtn">Select Venue</button></td>';
			tablerow = '<tr>' + tableRow + name + category + locationAddress + locationCity + locationCountry + clickButton + '</tr>';
			count = count + 1;

			table = table + tablerow;
		});
		table = table + '</table>';
		$("#queryResult").html(table);
	}

	function capitaliseFirstLetter(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	/*
	// ############
	//   Google Maps
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