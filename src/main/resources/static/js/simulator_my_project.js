$(document).ready(function () {

    $(".s-menu-my-project").css({
        "background-color": "#79976a",
        "color": "#ffffff"
    });

    $(".project-post").click(function () {
        const pk = $(this).data('pk');
        // console.log(pk);
        location.href = '/simulator/gallery_detail?pk=' + pk;
    })


})
