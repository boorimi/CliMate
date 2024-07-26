$(document).ready(function () {
    const images = $(".main-background-img > img");
    let current = 0;

    function slideImage() {
        images.eq(current).removeClass("active");
        current = (current + 1) % images.length;
        images.eq(current).addClass("active");
    }

    // 첫 번째 이미지 표시
    images.eq(current).addClass("active");

    // 2초마다 slideImage 함수 호출
    setInterval(slideImage, 3000);

    if (document.cookie.indexOf('jwt') !== -1) {
        $(".main-login").remove();
        $(".main-menu-container").append("<div class=\"main-logout\"\n" +
            ">\n" +
            "           <img class=\"main-login-img\" src=\"/resources/icon/google.png\"/>\n" +
            "        ログアウト</div>");
    }
    $(".main-logout").click(function() {
        window.open("https://accounts.google.com/logout");
        location.href = '/';
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:10 UTC; path=/;";
    });
});