$(document).ready(function () {

    loginCheck();
    loading();
    drag(); // 마이프로로젝트 좌우 드래그 스크롤

    function loginCheck() {
        let userId = $('#userId').text().trim();
        // console.log('로그인체크');
        // console.log(userId);
        if (userId) {
            $('.simulator-create-project').append(`<div class="create-project" onclick="location.href='/simulator/create_project'">+</div>`);
        } else {
            $('.simulator-create-project').append(`<div class="project-login">
                    <p>Available after login</p>
                    <a href="/loginC">Google Login</a>
                </div>`);
        }
    }

    function loading() {
        $(".simulator-loading").css("display", "none");

        // 페이지 이동 시 로딩 화면 표시
        $(".create-project").on("click", function (event) {
            $(".simulator-loading").show();
            $(".simulator-loading").css("display", "flex");
        });

    }

    function drag() {
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
    }


});
