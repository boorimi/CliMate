$(function(){
    if(document.cookie.indexOf('jwt') !== -1) {
        $(".hamburger-menu").append("<li id='logout'><img src=\"/resources/icon/google.png\" /><p id=\"menu-login\">ログアウト</p></li>");
    } else {
        $(".hamburger-menu").append("<li onclick=\"location.href='/loginC'\"><img src=\"/resources/icon/google.png\" /><p id=\"menu-login\">ログイン</p></li>");
    }

    $("#logout").click(function() {
        window.open("https://accounts.google.com/logout");
        location.href = '/';
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:10 UTC; path=/;";
    })
});


function toggleMenu() {
    document.querySelector('.hamburger-menu').classList.toggle('active');
}