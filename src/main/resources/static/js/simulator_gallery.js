$(document).ready(function () {
    const post = $('.project-post');
    let dataPk;
    let userId = $('#userId').text();
    let category;


    $(".s-menu-gallery").css({
        "background-color": "#79976a",
        "color": "#ffffff"
    });

    $(".search-all").click(function (){
        location.href="/simulator/gallery";
    });

    $(".search-setter").click(function (){
        category = "setter";
        location.href="/simulator/selectSetter?category="+category;
    });

    $(".search-normal").click(function () {
        category = "normal";
        location.href="";
    });

    post.on('click', function () {
        dataPk = $(this).data('pk');
        loginCheck(userId, dataPk);
    });

    function loginCheck(userId, dataPk) {
        console.log(userId);
        if (userId != null && userId !== '') {
            alert(dataPk);
            location.href = '/simulator/gallery_detail?pk=' + dataPk;
        } else {
            alert('Available after login');
        }
    }


})
