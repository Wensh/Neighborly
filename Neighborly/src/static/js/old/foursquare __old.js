var venuelat;
var venlong;
var counterpark = 0;

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