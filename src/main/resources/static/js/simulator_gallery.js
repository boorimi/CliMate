$(document).ready(function () {
    const post = $('.project-post');
    let dataPk;
    let userId = $('#userId').text();

    $(".s-menu-gallery").css({
        "background-color": "#79976a",
        "color": "#ffffff"
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
