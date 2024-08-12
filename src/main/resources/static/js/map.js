
let map;
let userMarker;
let markers = [];
let service;
let infowindow;
$(function () {
    initMap();
    //유저가 목록 버튼 클릭시
    $("#category-box").click(function() {
        $(".search-overlay").css("display","block");
        $(".search-popup-box").css("display","block");
    })
    //유저가 목록에서 x 버튼 클릭시
    $(".popup-cancel").click(function() {
        $(".search-overlay").css("display","none");
        $(".search-popup-box").css("display","none");
    })
    //wish버튼 클릭시 실행되는 함수
    $("#wish-img").click(function () {
        console.log("wish");
    })
    //check버튼 클릭시 실행되는 함수
    $("#check-img").click(function () {
        console.log("check");

    })
})

function initMap() {
    let defaultLocation = {
        center: { lat: 37.5665, lng: 126.9780 }, //서울
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,  // 전체화면 컨트롤 제거
        streetViewControl: false,  // 스트리트 뷰 컨트롤 제거
    }
    map = new google.maps.Map(document.getElementById("map"), defaultLocation);

    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();

    searchClimbingGyms(defaultLocation.center, 5000); // 기본 위치와 반경 5km
}

function searchClimbingGyms(location, radius) {
    const request = {
        location: location,
        radius: radius,
        query: 'climbing gym',
        locationBias: { // 검색을 한정하는 지역 설정
            north: 45.551483,
            south: 24.396308,
            east: 153.986672,
            west: 122.93457
        }
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
        const placeUrl = `https://www.google.com/maps/search/?api=1&query=${place.name}}`;
        console.log("check place => " + JSON.stringify(place));
        const content = `<div　style="{width:5vw;}">
<div class="status-box">
<img onclick="wishClick()" src="/resources/icon/wish_gray.png">
<img onclick="checkClick()" src="/resources/icon/check_gray.png">
</div>
<p onclick="handlePlaceClick('${place.name}')">${place.name}</p>
<p onclick="handlePlaceClick('${place.name}')">${place.formatted_address}</p>
           <a href="${placeUrl}" target="_blank">View on Google Maps</a>
</div>`;
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });

    markers.push(marker); // 마커 배열에 추가
}

function handlePlaceClick(placeName) {
    //마커 클릭시
    $("#homeground").val(placeName);
    $("#map-box").css("display","none");
    $("#map-box").css("transform", "translateY(0)");
    $("#map-box").css("top", "0");
    $("body").css("overflow","scroll");
}

function searchLocation() {
    const mapInput = document.getElementById("map-input").value;

    // 클라이밍장 이름으로 검색하기
    const request = {
        query: mapInput,
        fields: ["name", "geometry"],
        locationBias: { // 검색을 한정하는 지역 설정
            north: 45.551483,
            south: 24.396308,
            east: 153.986672,
            west: 122.93457
        }
    };

    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
            const location = results[0].geometry.location;

            map.setCenter(location);

            // 검색된 장소가 클라이밍장인 경우
            if (isClimbingGym(results[0])) {
                clearMarkers();
                createMarker(results[0]); // 검색된 클라이밍장만 표시
            } else {
                // 일반 장소인 경우 해당 장소 주변의 클라이밍장 검색
                searchClimbingGyms(location, 5000); // 검색한 장소와 반경 5km
            }
        } else {
            // 장소 이름으로 검색이 실패한 경우 지오코딩으로 주소 검색
            geocodeAddress(mapInput);
        }
    });
}

function isClimbingGym(place) {
    // 클라이밍장인지 판단하는 로직 (예: 클라이밍장 이름이 포함된 경우)
    return place.name.toLowerCase().includes("climbing");
}

function geocodeAddress(address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;

            map.setCenter(location);

            // 검색된 위치 주변의 클라이밍장 검색
            searchClimbingGyms(location, 5000); // 검색한 장소와 반경 5km
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

function goMap() {
    const place_name = $("#place_name").text();
    const placeUrl = `https://www.google.com/maps/search/?api=1&query=${place_name}}`;

    window.open(placeUrl, '_blank');
}

function wishClick() {
    console.log("wish");
    const userId = $("#session-value").val();
    $.ajax({
        url: "/WishC",
        data: userId,
        type: "post",
        success: function () {
            
        },
        error: function () {

        }
    })
}

function checkClick() {
    console.log("check");
}