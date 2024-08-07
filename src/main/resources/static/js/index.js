$(function(){
    //브라우저 쿠키 확인
    if(document.cookie.indexOf('jwt') !== -1) {
        $(".hamburger-menu").append("<li id='mypage'><img src=\"/resources/icon/mypage.png\" /><p id=\"menu-login\">My Page</p></li>");
        $(".hamburger-menu").append("<li id='logout'><img src=\"/resources/icon/logout.png\" /><p id=\"menu-login\">Logout</p></li>");
    } else {
        $(".hamburger-menu").append("<li onclick=\"location.href='/loginC'\"><img src=\"/resources/icon/google.png\" /><p id=\"menu-login\">Login</p></li>");
    }

    //로그아웃 함수
    $("#logout").click(function() {
        window.open("https://accounts.google.com/logout");
        location.href = '/';
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:10 UTC; path=/;"; //쿠키 초기화
    })
});


function toggleMenu() {
    document.querySelector('.hamburger-menu').classList.toggle('active');
}