let map;
let userMarker;
let markers = [];
let service;
let infowindow;
const userId = $("#userId").text();
const myplaceList = [];
$(function () {
    initMap();
    //유저가 목록 버튼 클릭시
    $("#category-box").click(function () {
        $(".search-overlay").css("display", "block");
        $(".search-popup-box").css("display", "block");
    })
    //유저가 목록에서 x 버튼 클릭시
    $(".popup-cancel").click(function () {
        $(".search-overlay").css("display", "none");
        $(".search-popup-box").css("display", "none");
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
    getAllWish().then(() => {
        let defaultLocation = {
            center           : {lat: 37.5665, lng: 126.9780}, // 서울
            zoom             : 15,
            mapTypeControl   : false,
            fullscreenControl: false,
            streetViewControl: false,
        };
        map = new google.maps.Map(document.getElementById("map"), defaultLocation);
        service = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow();
        searchClimbingGyms(defaultLocation.center, 5000);
    }).catch(error => {
        console.error("Error loading wishes:", error);
    });
}

function searchClimbingGyms(location, radius) {
    const request = {
        location: location, radius: radius, query: 'climbing gym', locationBias: { // 검색을 한정하는 지역 설정
            north: 45.551483, south: 24.396308, east: 153.986672, west: 122.93457
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
    console.log("check mylist => " + myplaceList);
    // 현재 장소의 좋아요 상태를 가져옴
    const isLiked = myplaceList.some(p => p.place_name === place.name && p.like);
    const iconUrl = isLiked ? "/resources/icon/wish_red.png" : "/resources/icon/wish_gray.png";

    const marker = new google.maps.Marker({
        map     : map,
        position: place.geometry.location,
        title   : place.name,
        address : place.formatted_address
    });

    google.maps.event.addListener(marker, "click", () => {
        const placeUrl = `https://www.google.com/maps/search/?api=1&query=${place.name}}`;
        console.log("check place => " + JSON.stringify(place));
        console.log("check user id => " + userId);
        const content = `<div　style="{width:5vw;}">` +
            `<div class="status-box">` +
            `<img id="wish-img" onclick="wishClick('${place.name}', '${place.formatted_address}', '${place.place_id}', this)" src="${iconUrl}">` +
            `<img id="check-img" onclick="checkClick()" src="/resources/icon/check_gray.png">` +
            `</div>` +
            `<p id="place-name" onclick="handlePlaceClick('${place.name}')">${place.name}</p>` +
            `<p id="place-addr" onclick="handlePlaceClick('${place.name}')">${place.formatted_address}</p>` +
            `<a href="${placeUrl}" target="_blank">View on Google Maps</a>` +
            `</div>`;
        infowindow.setContent(content);
        infowindow.open(map, marker);
        //getOneWish(`${place.name}`);
    });

    markers.push(marker); // 마커 배열에 추가
}

function handlePlaceClick(placeName) {
    //마커 클릭시
    $("#homeground").val(placeName);
    $("#map-box").css("display", "none");
    $("#map-box").css("transform", "translateY(0)");
    $("#map-box").css("top", "0");
    $("body").css("overflow", "scroll");
}

function searchLocation() {
    const mapInput = document.getElementById("map-input").value;

    // 클라이밍장 이름으로 검색하기
    const request = {
        query: mapInput, fields: ["name", "geometry"], locationBias: { // 검색을 한정하는 지역 설정
            north: 45.551483, south: 24.396308, east: 153.986672, west: 122.93457
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
    geocoder.geocode({address: address}, (results, status) => {
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
    if (e.keyCode == 13) {
        // enter key(13) 눌렀을 때 이벤트
        searchLocation();
    }
});

function goMap() {
    const place_name = $("#place_name").text();
    const placeUrl = `https://www.google.com/maps/search/?api=1&query=${place_name}}`;

    window.open(placeUrl, '_blank');
}

function wishClick(placeName, placeAddr, placeId, imgElement) {
    const isCurrentlyLiked = imgElement.src.includes('wish_red.png');
    const newIconUrl = isCurrentlyLiked ? '/resources/icon/wish_gray.png' : '/resources/icon/wish_red.png';

    console.log("check userId => " + userId);
    if (userId == "") {
        alert("do login");
        location.href = "/";
    }

    console.log("check userId => " + userId);
    console.log("check place name => " + placeName);
    console.log("check place addr => " + placeAddr);

    if (!isCurrentlyLiked) {
        $.ajax({
            url    : "/insertWish",
            data   : {
                mp_u_id    : userId,
                mp_like    : placeName,
                mp_likeaddr: placeAddr
            },
            type   : "post",
            success: function () {
                // 상태 업데이트 후 myplaceList 배열 갱신
                const index = myplaceList.findIndex(p => p.place_name === placeName);
                if (index !== -1) {
                    myplaceList[index].like = !myplaceList[index].like;
                } else {
                    myplaceList.push({place_name: placeName, like: true});
                }

                // infoWindow 내 이미지 업데이트
                imgElement.src = newIconUrl;
            },
            error  : function () {
                console.log("아 에러에유");
            }
        })
    } else {
        //제거하는 ajax
    }

}

function checkClick() {
    console.log("check userId => " + userId);
    if (userId == "") {
        alert("do login");
        location.href = "/";
    }
}

function getOneWish(place_name) {
    $("#wish-img").attr("src", "/resources/icon/wish_red.png");
    $.ajax({
        url    : "/getOneWish",
        data   : {
            mp_u_id: userId,
            mp_like: place_name
        },
        success: function () {
            console.log("아 성공이에유");
        },
        error  : function (err) {
            console.log("아 에러에유");
            console.error(err);
        }
    })
}

async function getAllWish() {
    await $.ajax({
        url    : "/getAllWish",
        data   : {
            mp_u_id: userId
        },
        success: function (resData) {
            myplaceList.length = 0; // 배열 초기화
            resData.forEach(item => {
                myplaceList.push({place_name: item.mp_like, like: true});
            });
        },
        error  : function (error) {
            console.error(error)
        }
    })
}