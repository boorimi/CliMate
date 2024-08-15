$(document).ready(function () {
    let userId = $('#userId').text();
    const post = $('.project-post');
    let dataPk;

    $(".s-menu-create").click(function (){
        if (userId != null && userId != ""){
            location.href="/simulator/create";
        } else {
            showConfirm();
        }
    })

    $(".s-menu-my-project").click(function (){
        if (userId != null && userId != ""){
            location.href="/simulator/my_project";
        } else {
            showConfirm();
        }
    })

    $(".s-menu-gallery").click(function (){
        location.href="/simulator/gallery?category=All";
    })


    post.on('click', function () {
        dataPk = $(this).data('pk');
        loginCheck(userId, dataPk);
    });


    function loginCheck(userId, dataPk) {
        if (userId != null && userId !== '') {
            location.href = '/simulator/gallery_detail?pk=' + dataPk;
        } else {
            showConfirm();
        }
    }

    // 모달
    function showConfirm(){
        $('#confirm-background').css("display", "block");
    }

    // 로그인 버튼 클릭
    $('#confirm-yes').on('click', function() {
        $('#confirm-background').css("display", "none");
        location.href ='/loginC';
    });

    // 취소 버튼 클릭
    $('#confirm-no').on('click', function() {
        $('#confirm-background').css("display", "none");
    });

    // 배경을 클릭했을 때 모달 닫기
    $('#confirm-background').on('click', function(event) {
        if (event.target === this) {
            $(this).css("display", "none");
        }
    });


})