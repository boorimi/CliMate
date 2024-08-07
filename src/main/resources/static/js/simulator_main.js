$(document).ready(function () {

    checkJwtCookie();

    // 쿠키에서 특정 이름의 값을 가져오는 함수
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // 쿠키의 이름이 매칭되는지 확인
            if (cookie.indexOf(name + '=') === 0) {
                return cookie.substring((name + '=').length, cookie.length);
            }
        }
        return null;
    }

    // JWT 쿠키가 있는지 확인하는 함수
    function checkJwtCookie() {
        var jwt = getCookie('jwt'); // 쿠키 이름이 'jwt'라고 가정
        if (jwt) {
            console.log('JWT 쿠키가 존재합니다:', jwt);
            $('.simulator-create-project').append(`<div class="create-project" onclick="location.href='/simulator/create_project'">+</div>`);
        } else {
            console.log('JWT 쿠키가 존재하지 않습니다.');
            $('.simulator-create-project').append(`<div class="project-login">
            <p>Available after login</p>
            <a href="/loginC">Google Login</a>
        </div>`);
        }
    }

    $(".simulator-loading").css("display", "none");

    // 페이지 이동 시 로딩 화면 표시
    $(".create-project").on("click", function(event) {
        $(".simulator-loading").show();
        $(".simulator-loading").css("display", "flex");
    });



    // 좌우 드래그 스크롤
    let isDown = false;
    let startX;
    let scrollLeft;

    $("#myProjectList").mousedown(function (e) {
        isDown = true;
        $(this).addClass("dragging");
        startX = e.pageX - $(this).offset().left;
        scrollLeft = $(this).scrollLeft();
    });

    $("#myProjectList").mouseleave(function () {
        isDown = false;
        $(this).removeClass("dragging");
    });

    $("#myProjectList").mouseup(function () {
        isDown = false;
        $(this).removeClass("dragging");
    });

    $("#myProjectList").mousemove(function (e) {
        if (!isDown) return;
        e.preventDefault();
        let x = e.pageX - $(this).offset().left;
        let walk = (x - startX) * 2; // 스크롤 속도 조절
        $(this).scrollLeft(scrollLeft - walk);
    });






});
