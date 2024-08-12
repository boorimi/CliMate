$(document).ready(function () {

    const projectList = $("#myProjectList");
    const myProject = $(".my-project");

    loading();
    drag(); // 마이프로로젝트 좌우 드래그 스크롤
    sizeCheck();

    let sPk = myProject.data('pk');
    console.log(sPk);

    // 나의 프로젝트가 4개 이상인 경우 3개까지만 표시 후 더보기 디브 어펜드
    function sizeCheck() {
        let myProjectSize = projectList.data('myproject-size');
        let moreText = myProjectSize - 3 +" +";

        console.log("myProject Size: ", myProjectSize);

        if (myProjectSize >= 3) {
            let more = ` <div class="my-project more" 
                                onclick="location.href='/simulator/my_project'">
                                <p>`+moreText+`</p></div>`;
            projectList.append(more);
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

        projectList.mousedown(function (e) {
            isDown = true;
            $(this).addClass("dragging");
            startX = e.pageX - $(this).offset().left;
            scrollLeft = $(this).scrollLeft();
        });

        projectList.mouseleave(function () {
            isDown = false;
            $(this).removeClass("dragging");
        });

        projectList.mouseup(function () {
            isDown = false;
            $(this).removeClass("dragging");
        });

        projectList.mousemove(function (e) {
            if (!isDown) return;
            e.preventDefault();
            let x = e.pageX - $(this).offset().left;
            let walk = (x - startX) * 2; // 스크롤 속도 조절
            $(this).scrollLeft(scrollLeft - walk);
        });
    }


});
