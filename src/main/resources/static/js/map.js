
let map;
let userMarker;
let markers = [];
let service;
let infowindow;
$(function () {
    initMap();
    //$("#map").attr("center", JSON.stringify(seoul));
})

function initMap() {
    let defaultLocation = {
        center: { lat: 37.5665, lng: 126.9780 }, //서울
        zoom: 15,
        mapTypeControl: false
    }
    map = new google.maps.Map(document.getElementById("map"), defaultLocation);

    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();
}

function searchClimbingGyms(location, radius) {
    const request = {
        location: location,
        radius: radius,
        query: 'climbing gym'
    };

    service.textSearch(request, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearMarkers();
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = []; // 배열 초기화
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });

    markers.push(marker); // 마커 배열에 추가
}

function searchLocation() {
    const mapInput = document.getElementById("map-input").value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: mapInput }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;

            map.setCenter(location);

            if(userMarker) {
                userMarker.setMap(null);
            }
            // 검색된 위치에 마커를 추가합니다.
            // userMarker = new google.maps.Marker({
            //     position: location,
            //     map: map,
            //     title: mapInput
            // });

            // 검색한 장소 주변의 클라이밍장 검색
            searchClimbingGyms(location, '5000'); // 검색한 장소와 반경 5km
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

window.searchLocation = searchLocation;

$("#map-input").keydown(function (e) {
    if(e.keyCode == 13) {
        // enter key(13) 눌렀을 때 이벤트
        searchLocation();
    }
});