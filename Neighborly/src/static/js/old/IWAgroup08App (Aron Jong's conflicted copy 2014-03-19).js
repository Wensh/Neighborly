	var venuelat;
	var venlong;
	var counterpark = 0;

	var map;
	var fsVenues;


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
				//var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT ?crimevalue WHERE {<http://iwagroup08.org/Westland> cbs:drugsmisdrijven ?crimevalue. }';
				
				//todo: <http://iwagroup08.org/Westland> door [var] aanpassen
				
				var query = 'PREFIX cbs: <http://www.cbs.nl/> SELECT * WHERE {<http://iwagroup08.org/Westland> cbs:drugsmisdrijven ?drugsmisdrijven; cbs:seksmisdrijf ?seksmisdrijf;cbs:vermogensmisdrijven ?vermogensmisdrijven; cbs:vernielingen ?vernielingen; cbs:wapenmisdrijven ?wapenmisdrijven; cbs:verkeersmisdrijf ?verkeersmisdrijf; cbs:oningedeeld ?oningedeeld; cbs:overigemisdrijf	?overigemisdrijf.}';
				
				var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
				var format = 'json';

				$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){		
						console.log(json);
			try {
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

						// If the value is a URI, create a hyperlink
						if (v_type == 'uri') {
							var a = $('<a></a>');
							a.attr('href',v_value);
							a.text(v_value);
							li.append(a);
						// Else we're just showing the value.
						} else {
							li.append(v_value);
						}
						li.append('<br/>');
					});
					ul.append(li);
				});
				$('#linktarget2').html(ul);
			} catch(err) {
				$('#linktarget2').html('Something went wrong!');
			}
						//!!!!!Maybe important!!!!
						// var pre = json.head.vars;
						// var pre = $('<pre></pre>');
						// pre.text(JSON.stringify(json));
						// $('#linktarget2').html(pre);
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
				var query = 'PREFIX cbs:<http://www.cbs.nl/> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT distinct ?mLabel ?pLabel WHERE{	?municipality 	rdf:type cbs:Municipality.	?municipality rdf:label ?mLabel. 		OPTIONAL{		?partOfMunicipal dbpedia-owl:isPartOf ?municipality.	}	?partOfMunicipal rdf:label ?pLabel	FILTER CONTAINS(?mLabel, "' + location + '")	FILTER CONTAINS(?pLabel, "' + location + '")	}' ;
				
				// maybe faster:

				//var query = 'PREFIX cbs:<http://www.cbs.nl/> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT distinct ?mLabel ?pLabel WHERE{	?municipality 	rdf:type cbs:Municipality.	?municipality rdf:label ?mLabel. FILTER CONTAINS(?mLabel, "' + location + '")	}' ;
				
				var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
				var format = 'json';

				$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){
					var i;
					var settlementsArr = [];
					length = Math.sqrt(json.results.bindings.length);
					
					for(i=0; i<length; i++){
						settlementsArr.push(json.results.bindings[i].pLabel.value);
					}
					
					$( "#inputSearchLoc" ).autocomplete({
						source: settlementsArr
					});
					
					// Remove this
					/*
					var pre = $('<pre></pre>');
					pre.text(JSON.stringify(json));
					$('#divOuputLocations').html(pre);
					*/
				});
		}


	$(document).ready(function() {
		$('#btnSearchLoc').on('click', function(e){
			var location = $('#inputSearchLoc').val();
			
			//var location = "Delft";
			//var query = "TU";
			
			//Step 1: get foursquare data
			getFoursquareVenues(query, location);
		});
	});	

		function querySearchMunicipality(location){				
				var query = 'PREFIX cbs:<http://www.cbs.nl/> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT distinct ?mLabel ?pLabel WHERE{	?municipality 	rdf:type cbs:Municipality.	?municipality rdf:label ?mLabel. 		OPTIONAL{		?partOfMunicipal dbpedia-owl:isPartOf ?municipality.	}	?partOfMunicipal rdf:label ?pLabel	FILTER CONTAINS(?mLabel, "' + location + '")	FILTER CONTAINS(?pLabel, "' + location + '")	}' ;
				
				// maybe faster:
				//var query = 'PREFIX cbs:<http://www.cbs.nl/> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT distinct ?mLabel ?pLabel WHERE{	?municipality 	rdf:type cbs:Municipality.	?municipality rdf:label ?mLabel. FILTER CONTAINS(?mLabel, "' + location + '")	}' ;
				
				var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/Neighborly';
				var format = 'json';

				$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){
					var i;
					var settlementsArr = [];
					length = Math.sqrt(json.results.bindings.length);
					
					for(i=0; i<length; i++){
						settlementsArr.push(json.results.bindings[i].pLabel.value);
					}
					
					$( "#inputSearchLoc" ).autocomplete({
						source: settlementsArr
					});
					
					// Remove this
					/*
					var pre = $('<pre></pre>');
					pre.text(JSON.stringify(json));
					$('#divOuputLocations').html(pre);
					*/
				});
		}
		
		/*
		// ############
		//  Example:  query linkedLifeData.com
		// ############
		*/

	$('#messageInput8').on('input', function(e){
		var message = $('#messageInput8').val();

		var lld_autocomplete_url = 'http://linkedlifedata.com/autocomplete.json?callback=?';

		var data = {'q': message, 'limit': 100}

		$.getJSON(lld_autocomplete_url, data=data, function(json){

			var ul = $('<ul></ul>');
			ul.addClass('list-group');
			for (var i in json.results) {
				var r = json.results[i];

				var uri = r.uri.namespace + r.uri.localName;
				var label = r.label;

				var li = $('<li></li>');
				li.addClass('list-group-item');
				var a = $('<a></a>');
				a.html(label);

				a.on('click', function(e){
					alert('You clicked '+ uri);
				});

				li.append(a);
				ul.append(li);
			}

			$('#linktarget8').html(ul);
		});
	});

		
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
				clickButton = '<td><button" class="editbtn">Select Venue</button></td>';
				tablerow = '<tr>' + tableRow + name + category + locationAddress + locationCity + locationCountry + clickButton + '</tr>';
				count = count + 1;
				
				table = table + tablerow;
			});
			table = table + '</table>';
			$("#queryResult").html(table);
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


	*/