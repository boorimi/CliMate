$(document).ready(function () {

    loading();
    drag(); // 마이프로로젝트 좌우 드래그 스크롤





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
