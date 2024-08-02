var seoul = { lat: 37.5665, lng: 126.9780 };
let defaultLocation = {
    center: seoul,
    zoom: 13,
    mapTypeControl: false
}
let map;
$(function () {
    initMap();
    //$("#map").attr("center", JSON.stringify(seoul));
})

function initMap() {
    const defaultLocation = { lat: 37.5665, lng: 126.9780 }; // 서울의 위치
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15,
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });
}

function searchLocation() {
    const userInput = document.getElementById("location-input").value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: userInput }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;

            map.setCenter(location);

            // 검색된 위치에 마커를 추가합니다.
            const userMarker = new google.maps.Marker({
                position: location,
                map: map,
                title: userInput
            });

            const request = {
                location: location,
                radius: '5000',
                query: 'climbing gym'
            };

            service.textSearch(request, callback);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

window.searchLocation = searchLocation;