$(function(){
    console.log("check cookie => "+document.cookie.indexOf('jwt'));
    if(document.cookie.indexOf('jwt') !== -1) {
        $(".hamburger-menu").append("<li onclick=\"location.href='/login'\"><img src=\"/resources/icon/google.png\" /><p id=\"menu-login\">ログアウト</p></li>");
    } else {
        $(".hamburger-menu").append("<li id='logout'><img src=\"/resources/icon/google.png\" /><p id=\"menu-login\">ログイン</p></li>");
    }
});

$("#logout").click(function() {
    window.open("https://accounts.google.com/logout");
    location.href = '/';
})

function toggleMenu() {
    document.querySelector('.hamburger-menu').classList.toggle('active');
}