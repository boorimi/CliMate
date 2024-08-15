$(document).ready(function () {

    let category;

    const urlParams = new URLSearchParams(window.location.search);
    const getCategory = urlParams.get('category');
    const getNickname = urlParams.get('nickname');

    if (getCategory === "All" || getNickname) {
        $(".search-all").css({
            "background-color": "#79976a",
            "color": "#ffffff"
        });
    } else if (getCategory === "Setter") {
        $(".search-setter").css({
            "background-color": "#79976a",
            "color": "#ffffff"
        });
    } else if (getCategory === "Normal") {
        $(".search-normal").css({
            "background-color": "#79976a",
            "color": "#ffffff"
        });
    }


    $(".s-menu-gallery").css({
        "background-color": "#79976a",
        "color": "#ffffff"
    });

    $(".search-all").click(function () {
        category = "All";
        location.href = "/simulator/gallery?category=" + category;
    });

    $(".search-setter").click(function () {
        category = "Setter";
        location.href = "/simulator/gallery?category=" + category;
    });

    $(".search-normal").click(function () {
        category = "Normal";
        location.href = "/simulator/gallery?category=" + category;
    });




})