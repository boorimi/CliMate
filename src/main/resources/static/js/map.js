let map;
let markers = [];
let service;
let infowindow;
let scrollList = 0;
let totalItems = 0;
let page = 0;  // 페이지 번호를 초기화합니다.
const size = 5;  // 한 번에 가져올 데이터 수
let timeoutId = null;  // 타이머 ID
let checkType = "all"; //스크롤 횟수
let cnt = 0;
let isLoading = false;


const userId = $("#userId").text();
const myplaceList = [];
const obj = {
    place_name: null,
    wish      : null,
    check     : null
}
$(function () {
    const searchParams = new URLSearchParams(location.search);

    for (const param of searchParams) {
        if (param[1] === "mypage") {
            initMap();
            getWishCnt();
            getCheckCnt();
            $(".search-overlay").css("display", "block");
            $(".search-popup-box").css("display", "block");
            getAllByIdCnt(page);
        } else {
            location.href = "/";
        }
    }

    initMap();
    //유저가 목록 버튼 클릭시
    $("#category-box").click(function () {
        getWishCnt(page);
        getCheckCnt(page);
        $(".search-overlay").css("display", "block");
        $(".search-popup-box").css("display", "block");
        getAllByIdCnt(page);
    })
    //유저가 목록에서 x 버튼 클릭시
    $(".popup-cancel").click(function () {
        $(".search-overlay").css("display", "none");
        $(".search-popup-box").css("display", "none");
        $(".search-result-box").remove();
        $("#type-box-all").addClass("active-btn");
        $("#type-box-wish").removeClass("active-btn");
        $("#type-box-visited").removeClass("active-btn");
        $("#search-input").val("");
        page = 0;
        scrollList = 0;
        totalItems = 0;
    })
    let lastScrollTop = 0; // 이전 스크롤 위치를 저장하는 변수
    let isFetching = false; // 타이머 상태 관리 플래그
    let hasFetchedData = false;
    //내 목록에서 스크롤 함수
    $("#search-popup-box").scroll(function () {
        let currentScrollTop = $(this).scrollTop(); // 현재 스크롤 위치
        let scrollHeight = $(this).scrollHeight;
        let clientHeight = $(this).clientHeight;

        // 스크롤이 내려가는 경우 (현재 위치가 이전 위치보다 큰 경우)
        if (currentScrollTop > lastScrollTop) {
            if (isFetching) return; // 타이머가 동작 중이면 새로운 요청 방지
            let cnt = 0;
            cnt++;

            var button = document.getElementById('move-btn'); // 버튼 요소 선택
            var rect = button.getBoundingClientRect(); // 버튼의 위치 정보 가져오기
            if (rect.top < 820) {
                if (scrollList === totalItems) return
                isFetching = true; // 타이머 시작 시 플래그 설정
                setTimeout(() => {
                    if (checkType === "Wish") {
                        getWishCnt(page);
                    } else if (checkType === "Check") {
                        getCheckCnt(page);
                    } else if (checkType === "Search") {
                        getSearchCntById(page);
                    } else {
                        getAllByIdCnt(page);
                    }
                    isFetching = false; // 작업 완료 후 플래그 해제
                    hasFetchedData = true;
                }, 2000)
            }
        } else {
            if (currentScrollTop < scrollHeight - clientHeight) {
                // 데이터 요청이 완료되었고, 스크롤이 위로 올려지는 경우
                hasFetchedData = false; // 데이터 요청 플래그를 리셋
            }
        }
        lastScrollTop = currentScrollTop;
    })

    //내 목록에서 검색 함수
    $("#search-input").keydown(function (e) {
        if (e.keyCode === 13) {
            if ($("#search-input").val().length === 0) {
                page = 0;
                scrollList = 0;
                totalItems = 0;
                $(".search-result-box").remove();
                $("#type-box-all").removeClass("active-btn");
                $("#type-box-wish").removeClass("active-btn");
                $("#type-box-visited").removeClass("active-btn");
                getAllByIdCnt(page);
            } else {
                page = 0;
                scrollList = 0;
                totalItems = 0;
                $(".search-result-box").remove();
                $("#type-box-all").removeClass("active-btn");
                $("#type-box-wish").removeClass("active-btn");
                $("#type-box-visited").removeClass("active-btn");
                getSearchCntById(page);
            }
        }
    })
    $(".search-img").click(function () {
        if ($("#search-input").val().length === 0) {
            checkType = "all";
            page = 0;
            scrollList = 0;
            totalItems = 0;
            $(".search-result-box").remove();
            $("#type-box-all").addClass("active-btn");
            $("#type-box-wish").removeClass("active-btn");
            $("#type-box-visited").removeClass("active-btn");
            getAllByIdCnt(page);
        } else {
            checkType = "Search";
            page = 0;
            scrollList = 0;
            totalItems = 0;
            $(".search-result-box").remove();
            $("#type-box-all").removeClass("active-btn");
            $("#type-box-wish").removeClass("active-btn");
            $("#type-box-visited").removeClass("active-btn");
            getSearchCntById(page);
        }
    });

    //all 버튼 클릭 함수
    $("#type-box-all").click(function () {
        checkType = "all";
        page = 0;
        scrollList = 0;
        totalItems = 0;
        $(".search-result-box").remove();
        $("#type-box-all").addClass("active-btn");
        $("#type-box-wish").removeClass("active-btn");
        $("#type-box-visited").removeClass("active-btn");
        getAllByIdCnt(page);
    })
    //위시 버튼 클릭 함수
    $("#type-box-wish").click(function () {
        checkType = "Wish";
        page = 0;
        scrollList = 0;
        totalItems = 0;
        $(".search-result-box").remove();
        $("#type-box-all").removeClass("active-btn");
        $("#type-box-wish").addClass("active-btn");
        $("#type-box-visited").removeClass("active-btn");
        getWishCnt(page);
    })
    //visited 버튼 클릭 함수
    $("#type-box-visited").click(function () {
        checkType = "Check";
        page = 0;
        scrollList = 0;
        totalItems = 0;
        $(".search-result-box").remove();
        $("#type-box-all").removeClass("active-btn");
        $("#type-box-wish").removeClass("active-btn");
        $("#type-box-visited").addClass("active-btn");
        getCheckCnt(page);
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

        const content = `<div　style="{width:8vw;}">` +
            `<div class="status-box">` +
            `<div class="wish-icon-box"><img id="wish-img" onclick="wishClick('${place.name}', '${place.formatted_address}', '${place.place_id}', this)" src="${iconUrl}"><p>Wish</p></div>` +
            `<div class="check-icon-box"><img id="check-img" onclick="checkClick('${place.name}', '${place.formatted_address}', '${place.place_id}', this)" src="${iconUrl2}"><p>Check</p></div>` +
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
        // alert("do login");
        // location.href = "/";
        document.getElementById('s-menu-modal-background').style.display = 'block';

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
        // alert("do login");
        // location.href = "/";
        document.getElementById('s-menu-modal-background').style.display = 'block';
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

async function getAll() {
    await $.ajax({
        url       : "/getAll",
        data      : {
            mp_u_id: userId
        },
        success   : function (resData) {
            myplaceList.length = 0; // 배열 초기화
            $("#type-box-all").addClass("active-btn");
            $("#type-box-wish").removeClass("active-btn");
            $("#type-box-visited").removeClass("active-btn");

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
    if (isLoading) return; // 로딩 중이면 리턴
    isLoading = true;
    checkType = "all";
    $.ajax({
        url       : "/getAllById",
        data      : {
            mp_u_id: userId,
            page   : pageNo,
            size   : size
        },
        success   : function (resData) {
            if (resData.length > 0) {
                resData.forEach(function (item, index) {
                    const imgSrc = item.mp_type === "Wish" ? "/resources/icon/wish_red.png" : "/resources/icon/check_red.png";
                    const content = `
                        <div class="search-result-box">
                            <div class="search-icon">
                                <img class="icon" id="icon" src="${imgSrc}">
                            </div>
                            <div class="search-text">
                                <p id="place_name">${item.mp_name}</p>
                                <p id="place_addr">${item.mp_addr}</p>
                            </div>
                            <div class="search-map">
                                <img onclick="goMap('${item.mp_name}')" src="/resources/icon/right.png">
                            </div>
                        </div>`;
                    $(".search-result").append(content);
                })
                scrollList += resData.length;
                page++;
            } else {
                $(window).off("scroll");
            }
        },
        beforeSend: function () {
            $(".s-create-modal-background").css("display", "block");
            $(".s-loading-modal").css("display", "block");
        },
        complete  : function () {
            $(".s-create-modal-background").css("display", "none");
            $(".s-loading-modal").css("display", "none");
            isLoading = false;
        },
        error     : function (error) {
            console.error(error);
            isLoading = false;
        }
    })
}

function getAllByIdCnt(pageNo) {
    checkType = "all";
    $.ajax({
        url    : "/getAllByIdCnt",
        data   : {
            mp_u_id: userId
        },
        success: function (resData) {
            totalItems = resData;
            $("#all-cnt").text('(' + resData + ')');
            getAllById(pageNo);
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getSearchById(pageNum) {
    $.ajax({
        url    : "/searchMyplace",
        data   : {
            mp_u_id: userId,
            mp_name: $("#search-input").val(),
            page   : pageNum,
            size   : size
        },
        success: function (resData) {
            resData.forEach(function (item, i) {
                const search_icon = item.mp_type === "Check" ? "/resources/icon/check_red.png" : "/resources/icon/wish_red.png"
                const content = `
                        <div class="search-result-box">
                            <div class="search-icon">
                                <img class="icon" id="icon" src="${search_icon}">
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
            })
            scrollList += resData.length;
            if (page !== 0) {
                for (let i = scrollList; i < totalItems; i++) {
                    $(".search-icon").eq(i).append(`<img class="icon" id="icon" src="${search_icon}">`)
                }
            }
            page++;
        },
        error  : function (error) {
            console.error(error);
        }
    });
}

function getSearchCntById(pageNum) {
    checkType = "Search";
    $.ajax({
        url       : "/searchMyPlaceCnt",
        data      : {
            mp_u_id: userId,
            mp_name: $("#search-input").val(),
            page   : pageNum,
            size   : size
        },
        success   : function (resData) {
            totalItems = resData;
            if (checkType === "Search") getSearchById(pageNum);
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
            console.error(error);
        }
    });
}

function getWishCnt(pageNum) {
    $.ajax({
        url       : "/getWishCnt",
        data      : {
            mp_u_id: userId
        },
        success   : function (resData) {
            totalItems = resData;
            $("#wish-cnt").text('(' + resData + ')');
            if (checkType === "Wish") getWishData(pageNum);
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
            console.error(error);
        }
    })
}

function getCheckCnt(pageNum) {
    $.ajax({
        url       : "/getCheckCnt",
        data      : {
            mp_u_id: userId
        },
        success   : function (resData) {
            totalItems = resData;
            $("#check-cnt").text('(' + resData + ')');
            if (checkType === "Check") getCheckData(pageNum);
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
            console.error(error);
        }
    })
}

function getWishData(pageNum) {
    $.ajax({
        url    : "/getWishData",
        data   : {
            mp_u_id: userId,
            page   : pageNum,
            size   : size
        },
        success: function (resData) {
            resData.forEach(function (item, i) {
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
            })

            scrollList += resData.length;
            for (let i = scrollList; i < totalItems; i++) {
                $(".search-icon").eq(i).append(`<img class="icon" id="icon" src="/resources/icon/wish_red.png">`);
            }
            page++;
        },
        error  : function (error) {
            console.error(error);
        }
    })
}

function getCheckData(pageNum) {
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
            })

            scrollList += resData.length;
            for (let i = scrollList; i < totalItems; i++) {
                $(".search-icon").eq(i).append(`<img class="icon" id="icon" src="/resources/icon/check_red.png">`);
            }
            page++;
        },
        error  : function (error) {
            console.error(error);
        }
    })
}