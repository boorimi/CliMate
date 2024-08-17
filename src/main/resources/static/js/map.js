let map;
let markers = [];
let service;
let infowindow;
let scrollList = 0;
let totalItems = 0;
let page = 0;  // 페이지 번호를 초기화합니다.
const size = 5;  // 한 번에 가져올 데이터 수
let timeoutId = null;  // 타이머 ID
let checkType = null; //스크롤 횟수


const userId = $("#userId").text();
const myplaceList = [];
const obj = {
    place_name: null,
    wish      : null,
    check     : null
}
$(function () {
    initMap();
    //유저가 목록 버튼 클릭시
    $("#category-box").click(function () {
        getWishCnt();
        getCheckCnt();
        $(".search-overlay").css("display", "block");
        $(".search-popup-box").css("display", "block");
        getAllByIdCnt(page);
    })
    //유저가 목록에서 x 버튼 클릭시
    $(".popup-cancel").click(function () {
        $(".search-overlay").css("display", "none");
        $(".search-popup-box").css("display", "none");
        $(".search-result-box").remove();
        page = 0;
        scrollList = 0;
        totalItems = 0;
    })
    //내 목록에서 스크롤 함수
    $("#search-popup-box").scroll(function () {
        //스크롤 될때 한번씩 되게끔 실행해주는 함수
        if (timeoutId) {
            clearTimeout(timeoutId);  // 이전 타이머를 지웁니다.
        }
        if (scrollList > totalItems) {
            $(window).off("scroll");
        } else {
            timeoutId = setTimeout(function () {
                if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                    if (checkType === "Wish") {
                        getWishData(page);
                    } else if (checkType === "Check") {
                        getCheckData(page);
                    } else {
                        getAllByIdCnt(page);
                    }
                }
            }, 1000)
        }
    })

    //내 목록에서 검색 함수
    $("#search-input").keyup(function (e) {
        if (e.keyCode === 13) {
            if ($("#search-input").val().length === 0) {
                page = 0;
                scrollList = 0;
                totalItems = 0;
                $(".search-result-box").remove();
                getAllByIdCnt(page);
            } else {
                $(".search-result-box").remove();
                getSearchById();
            }
        }
    })
    $(".search-img").click(function () {
        if ($("#search-input").val().length === 0) {
            page = 0;
            scrollList = 0;
            totalItems = 0;
            $(".search-result-box").remove();
            getAllByIdCnt(page);
        } else {
            $(".search-result-box").remove();
            getSearchById();
        }
    });

    //위시 버튼 클릭 함수
    $("#type-box-wish").click(function () {
        page = 0;
        scrollList = 0;
        totalItems = 0;
        $(".search-result-box").remove();
        getWishData(page);
    })
    //visited 버튼 클릭 함수
    $("#type-box-visited").click(function () {
        page = 0;
        scrollList = 0;
        totalItems = 0;
        $(".search-result-box").remove();
        getCheckData(page);
    })
})

function initMap() {
    getAll().then(() => {
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
    const searchParams = new URLSearchParams(location.search);

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearMarkers();
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
        for (const param of searchParams) {
            if (param[1] === "mypage") {
                getWishCnt();
                getCheckCnt();
                $(".search-overlay").css("display", "block");
                $(".search-popup-box").css("display", "block");
                getAllByIdCnt(page);
            }
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
        map     : map,
        position: place.geometry.location,
        title   : place.name,
        address : place.formatted_address
    });

    google.maps.event.addListener(marker, "click", () => {
        const isLiked = myplaceList.some(p => p.place_name === place.name && p.wish);
        const iconUrl = isLiked ? "/resources/icon/wish_red.png" : "/resources/icon/wish_gray.png";
        const isChecked = myplaceList.some(p => p.place_name === place.name && p.check);
        const iconUrl2 = isChecked ? "/resources/icon/check_red.png" : "/resources/icon/check_gray.png";

        const placeUrl = `https://www.google.com/maps/search/?api=1&query=${place.name}}`;

        const content = `<div　style="{width:5vw;}">` +
            `<div class="status-box">` +
            `<img id="wish-img" onclick="wishClick('${place.name}', '${place.formatted_address}', '${place.place_id}', this)" src="${iconUrl}">` +
            `<img id="check-img" onclick="checkClick('${place.name}', '${place.formatted_address}', '${place.place_id}', this)" src="${iconUrl2}">` +
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

function goMap(name) {
    const placeUrl = "https://www.google.com/maps/search/?api=1&query=" + name;

    window.open(placeUrl, '_blank');
}

function wishClick(placeName, placeAddr, placeId, imgElement) {
    const placeType = "Wish";
    const isCurrentlyLiked = imgElement.src.includes('wish_red.png');
    const newIconUrl = isCurrentlyLiked ? '/resources/icon/wish_gray.png' : '/resources/icon/wish_red.png';

    if (userId == "") {
        alert("do login");
        location.href = "/";
    }

    if (!isCurrentlyLiked) {
        $.ajax({
            url    : "/insertWish",
            data   : {
                mp_u_id: userId,
                mp_name: placeName,
                mp_addr: placeAddr,
                mp_type: placeType
            },
            type   : "post",
            success: function () {
                // 상태 업데이트 후 myplaceList 배열 갱신
                const index = myplaceList.findIndex(p => p.place_name === placeName);
                if (index !== -1) {
                    myplaceList[index].wish = !myplaceList[index].wish;
                } else {
                    obj.place_name = placeName;
                    obj.wish = true;
                    myplaceList.push(obj);
                }

                // infoWindow 내 이미지 업데이트
                imgElement.src = newIconUrl;
            },
            error  : function (error) {
                console.error(error);
            }
        })
    } else {
        //제거하는 ajax
        $.ajax({
            url    : "/deleteWish",
            data   : {
                mp_u_id: userId,
                mp_name: placeName,
                mp_type: placeType
            },
            type   : "post",
            success: function () {
                // 상태 업데이트 후 myplaceList 배열 갱신
                const index = myplaceList.filter(p => p.place_name === placeName);
                index.forEach(item => {
                    item.wish = false;
                })

                // infoWindow 내 이미지 업데이트
                imgElement.src = newIconUrl;
            },
            error  : function (error) {
                console.error(error);
            }
        })
    }

}

function checkClick(placeName, placeAddr, placeId, imgElement) {
    const placeType = "Check";
    const isCurrentlyCheck = imgElement.src.includes('check_red.png');
    const newIconUrl = isCurrentlyCheck ? '/resources/icon/check_gray.png' : '/resources/icon/check_red.png';

    if (userId == "") {
        alert("do login");
        location.href = "/";
    }

    if (!isCurrentlyCheck) {
        $.ajax({
            url    : "/insertCheck",
            data   : {
                mp_u_id: userId,
                mp_name: placeName,
                mp_addr: placeAddr,
                mp_type: placeType
            },
            type   : "post",
            success: function () {
                // 상태 업데이트 후 myplaceList 배열 갱신
                const index = myplaceList.findIndex(p => p.place_name === placeName);
                if (index !== -1) {
                    myplaceList[index].check = !myplaceList[index].check;
                } else {
                    obj.place_name = placeName;
                    obj.check = true
                    myplaceList.push(obj);
                }

                // infoWindow 내 이미지 업데이트
                imgElement.src = newIconUrl;
            },
            error  : function (error) {
                console.error(error);
            }
        })
    } else {
        //제거하는 ajax
        $.ajax({
            url    : "/deleteCheck",
            data   : {
                mp_u_id: userId,
                mp_name: placeName,
                mp_type: placeType
            },
            type   : "post",
            success: function () {
                // 상태 업데이트 후 myplaceList 배열 갱신
                const index = myplaceList.filter(p => p.place_name === placeName);
                index.forEach(item => {
                    item.check = false;
                })

                // infoWindow 내 이미지 업데이트
                imgElement.src = newIconUrl;
            },
            error  : function (error) {
                console.error(error);
            }
        })
    }
}

function getOneWish(place_name) {
    $("#wish-img").attr("src", "/resources/icon/wish_red.png");
    $.ajax({
        url    : "/getOneWish",
        data   : {
            mp_u_id: userId,
            mp_wish: place_name
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

async function getAll() {
    await $.ajax({
        url       : "/getAll",
        data      : {
            mp_u_id: userId
        },
        success   : function (resData) {
            myplaceList.length = 0; // 배열 초기화

            resData.forEach(item => {
                const obj = { //객체 초기화
                    place_name: null,
                    wish      : null,
                    check     : null
                }
                obj.place_name = item.mp_name;
                item.mp_type === "Check" ? obj.check = true : obj.check = false;
                item.mp_type === "Wish" ? obj.wish = true : obj.wish = false;
                myplaceList.push(obj);
            });
        },
        beforeSend: function () {
            $(".s-create-modal-background").css("display", "block");
            $(".s-loading-modal").css("display", "block");
        },
        complete  : function () {
            $(".s-create-modal-background").css("display", "none");
            $(".s-loading-modal").css("display", "none");
        },
        error     : function (error) {
            console.error(error)
        }
    })
}

function getAllById(pageNo) {
    $.ajax({
        url    : "/getAllById",
        data   : {
            mp_u_id: userId,
            page   : pageNo,
            size   : size
        },
        success: function (resData) {
            if (resData.length > 0) {
                resData.forEach(function (item, index) {
                    if (item.mp_type === "Wish") {
                        const content = `
                        <div class="search-result-box">
                            <div class="search-icon">
                                <img class="icon" id="icon" src="/resources/icon/wish_red.png">
                            </div>
                            <div class="search-text">
                                <p id="place_name">${item.mp_name}</p>
                                <p id="place_addr">${item.mp_addr}</p>
                            </div>
                            <div class="search-map">
                                <img onclick="goMap('${item.mp_name}')" src="/resources/icon/map.png">
                            </div>
                        </div>`;
                        $(".search-result").append(content);
                    } else if (item.mp_type === "Check") {
                        const content = `
                        <div class="search-result-box">
                            <div class="search-icon">
                                <img class="icon" id="icon" src="/resources/icon/check_red.png">
                            </div>
                            <div class="search-text">
                                <p id="place_name">${item.mp_name}</p>
                                <p id="place_addr">${item.mp_addr}</p>
                            </div>
                            <div class="search-map">
                                <img onclick="goMap('${item.mp_name}')" src="/resources/icon/map.png">
                            </div>
                        </div>`;
                        $(".search-result").append(content);
                    }
                })
                scrollList += resData.length;
                page++;
            } else {
                $(window).off("scroll");
            }
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getAllByIdCnt(pageNo) {
    $.ajax({
        url    : "/getAllByIdCnt",
        data   : {
            mp_u_id: userId
        },
        success: function (resData) {
            totalItems = resData;
            getAllById(pageNo);
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getSearchById() {
    $.ajax({
        url    : "/searchMyplace",
        data   : {
            mp_u_id: userId,
            mp_name: $("#search-input").val()
        },
        success: function (resData) {
            $(".search-result-box").remove();
            resData.forEach(function (item) {
                const content = `
                        <div class="search-result-box">
                            <div class="search-icon"></div>
                            <div class="search-text">
                                <p id="place_name">${item.mp_name}</p>
                                <p id="place_addr">${item.mp_addr}</p>
                            </div>
                            <div class="search-map">
                                <img onclick="goMap('${item.mp_name}')" src="/resources/icon/map.png">
                            </div>
                        </div>`;
                $(".search-result").append(content);
                if (item.mp_type === "Check") {
                    $(".search-icon").append('<img class="icon" id="icon" src="/resources/icon/check_red.png">');
                } else if (item.mp_type === "Wish") {
                    $(".search-icon").append('<img class="icon" id="icon" src="/resources/icon/wish_red.png">');
                }
            })

        },
        error  : function (error) {
            console.error(error);
        }
    });
}

function getWishCnt() {
    $.ajax({
        url    : "/getWishCnt",
        data   : {
            mp_u_id: userId
        },
        success: function (resData) {
            $("#wish-cnt").text('(' + resData + ')');
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getCheckCnt() {
    $.ajax({
        url    : "/getCheckCnt",
        data   : {
            mp_u_id: userId
        },
        success: function (resData) {
            $("#check-cnt").text('(' + resData + ')');
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getWishData(pageNum) {
    checkType = "Wish";
    $.ajax({
        url    : "/getWishData",
        data   : {
            mp_u_id: userId,
            page   : pageNum,
            size   : size
        },
        success: function (resData) {
            checkType = "Wish";
            resData.forEach(function (item, i) {
                const content = `
                        <div class="search-result-box">
                            <div class="search-icon"></div>
                            <div class="search-text">
                                <p id="place_name">${item.mp_name}</p>
                                <p id="place_addr">${item.mp_addr}</p>
                            </div>
                            <div class="search-map">
                                <img onclick="goMap('${item.mp_name}')" src="/resources/icon/map.png">
                            </div>
                        </div>`;
                $(".search-result").append(content);
            })


            $(".icon").remove();
            for (let i = 0; i <= $(".search-result-box").length; i++) {
                $(".search-icon").eq(i).append('<img class="icon" id="icon" src="/resources/icon/wish_red.png">');
            }
            totalItems = resData.length;
            scrollList += resData.length;
            page++;
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getCheckData(pageNum) {
    checkType = "Check";
    $.ajax({
        url    : "/getCheckData",
        data   : {
            mp_u_id: userId,
            page   : pageNum,
            size   : size
        },
        success: function (resData) {
            resData.forEach(function (item, i) {
                const content = `
                        <div class="search-result-box">
                            <div class="search-icon"></div>
                            <div class="search-text">
                                <p id="place_name">${item.mp_name}</p>
                                <p id="place_addr">${item.mp_addr}</p>
                            </div>
                            <div class="search-map">
                                <img onclick="goMap('${item.mp_name}')" src="/resources/icon/map.png">
                            </div>
                        </div>`;
                $(".search-result").append(content);
            })

            $(".icon").remove();
            if (page <= 1) {
                for (let i = 0; i <= $(".search-result-box").length; i++) {
                    $(".search-icon").eq(i).append('<img class="icon" id="icon" src="/resources/icon/check_red.png">');
                }
            } else {
                for (let i = 0; i <= $(".search-result-box").length; i++) {
                    $(".search-icon").eq(i).append('<img class="icon" id="icon" src="/resources/icon/check_red.png">');
                }
            }

            totalItems = resData.length;
            scrollList += resData.length;
            page++;
        },
        error  : function (error) {
            console.error(error);
        }
    })
}