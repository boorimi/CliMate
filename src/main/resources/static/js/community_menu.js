$(document).ready(function () {

    const searchOpenIcon = $(".community-search-icon");
    const searchMenu = $(".community-search-wrapper");

    searchOpenIcon.append('<img src="/resources/icon/search_green.png">');

    // 검색 인풋 오픈
    searchOpenIcon.click(function () {
        searchMenu.slideToggle();
        searchMenu.css("display", "flex");

        const iconImg = searchOpenIcon.find("img");
        // 아이콘 토글
        if (iconImg.attr("src") === "/resources/icon/search_green.png") {
            iconImg.attr("src", "/resources/icon/close.png");
            iconImg.css("height", "60%");
        } else {
            iconImg.attr("src", "/resources/icon/search_green.png");
            iconImg.css("height", "100%");
        }
    });

});

