$(document).ready(function () {
    let userId = $('#userId').text();


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

    function loginCheck(userId, dataPk) {
        if (userId != null && userId !== '') {
            location.href = '/simulator/gallery_detail?b_pk=' + dataPk;
        } else {
            showConfirm();
        }
    }
})

// 모달
function showConfirm() {
    document.getElementById('s-confirm-background').style.display = 'block';
}

// 로그인 버튼 클릭
document.getElementById('s-confirm-yes').addEventListener('click', function() {
    document.getElementById('s-confirm-background').style.display = 'none';
    location.href = '/loginC';
});

// 취소 버튼 클릭
document.getElementById('s-confirm-no').addEventListener('click', function() {
    document.getElementById('s-confirm-background').style.display = 'none';
});

// 배경을 클릭했을 때 모달 닫기
document.getElementById('s-confirm-background').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

