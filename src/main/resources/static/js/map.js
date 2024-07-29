$(function() {
    initMap();
})

function initMap() {
    var seoul = { lat: 37.5665, lng: 126.9780 };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: seoul,
        zoom: 13
    });

    var service = new google.maps.places.Place
    var request = {
        query: '경복궁',
        fields: ['name', 'geometry']
    };

    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            map.setCenter(results[0].geometry.location);
        }
    });

    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });

        var infowindow = new google.maps.InfoWindow({
            content: place.name
        });

        marker.click(function() {
            infowindow.open(map, marker);
        });
    }
}