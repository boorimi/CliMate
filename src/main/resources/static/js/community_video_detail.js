$(document).ready(function () {

    $(".community-showoff-video").slick({
        prevArrow: $(".slick-prev"),
        nextArrow: $(".slick-next"),
    });

    $('.video').on('click', function () {
        // $('.community-showoff-video').on('click','video', function() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    });

    $(document).on('click', '.community-video-detail-like-icon', function () {
        let b_pk = $(this).data('b_pk');

        $.ajax({
            url: '/clickLike', // 요청을 보낼 서버 URL
            type: 'POST', // HTTP 요청 방법 (GET, POST 등)
            contentType: 'application/json', // 요청 본문 타입
            data: JSON.stringify({u_id: 'ds6951', b_pk: b_pk}), // 서버에 보낼 데이터
            success: function (response) {
                // 요청이 성공했을 때 호출되는 함수
                let html;
                console.log(b_pk);
                if (response.userLikes >= 1) {
                    html = `<div class="community-video-detail-like-icon" data-b_pk="${b_pk}"><img src="/resources/icon/love_blank.png"></div>`
                } else if (response.userLikes == 0) {
                    html = `<div class="community-video-detail-like-icon" data-b_pk="${b_pk}"><img src="/resources/icon/love.png"></div>`
                }
                let html2 = `<div class="community-video-detail-like-count">${response.totalLikes}</div>`

                $('.community-video-detail-like').empty().append(html);
                $('.community-video-detail-like').append(html2);

                console.log('Total Likes:', response.totalLikes);
                console.log('User Likes:', response.userLikes);
            },
            error: function (xhr, status, error) {
                // 요청이 실패했을 때 호출되는 함수
                console.log('Error:', error);
            }
        });
    });
});