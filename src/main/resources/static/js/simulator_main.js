$(document).ready(function () {

    let projectList = $("#myProjectList");
    let userId = $('#userId').text();
    // console.log(userId);

    loading();
    drag(); // 마이프로로젝트 좌우 드래그 스크롤
    loginCheck();

    function loginCheck() {
        let empty = `<p>Empty</p>`;

        if (userId != null && userId != "") {
            let myProjectSize = $('.my-project').data('size');
            let moreText = myProjectSize - 3 + " +";
            console.log("myProject Size: ", myProjectSize);

            if (myProjectSize == 0) {
                // 없으면 empty p태그 어펜드
                projectList.append(empty);
            } else if (myProjectSize > 3) {
                // 나의 프로젝트 3개 넘으면 더보기 디브 어펜드
                let more = `<div class="my-project more" 
                                onclick="location.href='/simulator/my_project'">
                                <p>` + moreText + `</p></div>`;
                projectList.append(more);
            }
        }
    }

    $('.my-project').click(function (){
        const pk = $(this).data('pk');
        // console.log(pk);
        location.href = '/simulator/gallery_detail?pk=' + pk;
    })


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
