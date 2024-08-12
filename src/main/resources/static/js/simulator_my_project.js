$(document).ready(function () {
    $(".project-post").click(function () {
        const pk = $(this).data('pk');
        console.log(pk);
        location.href = '/simulator/gallery_detail?pk=' + pk;
    })
})
