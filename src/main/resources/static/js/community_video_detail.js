$(document).ready(function () {

    $(".community-showoff-video").slick({
        prevArrow: $(".slick-prev"),
        nextArrow: $(".slick-next"),
        centerMode: true, // 가운데 정렬 모드 활성화
        centerPadding: '0', // 중앙 정렬 시 좌우 패딩 제거
        variableWidth: true, // 슬라이드 너비 조절 가능
        infinite: false
    });

    // $('.video').on('click', function () {
    //     // $('.community-showoff-video').on('click','video', function() {
    //     if (this.paused) {
    //         this.play();
    //     } else {
    //         this.pause();
    //     }
    // });

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

    $(document).on('click', '.community-showoff-detail-comments-nickname', function (event) {
        $('.community-showoff-detail-comments-nicknameMenu').removeClass('activeNickname');
        $(this).siblings('.community-showoff-detail-comments-nicknameMenu').toggleClass('activeNickname');
        event.stopPropagation();
    });

    $(document).on('click', function () {
        $('.community-showoff-detail-comments-nicknameMenu').removeClass('activeNickname');
    });

    $(document).on('click','.community-video-detail-more-wrapper', function () {
        $('.community-video-detail-updelMenu').toggleClass('active');
    });

    $(document).on('click', '.community-showoff-detail-comments-nicknameMenu', function (event) {
        event.stopPropagation();
    });

    // 해쉬태그 만들기 코드 (제목과 본문)
    let htmlContent = $('.community-video-detail-text').html();
    let htmlContent2 = $('.community-video-detail-title').html();
    function convertHashtagsToLinks(text) {
        return text.replace(/(#[^\s#]+)/g, function(match) {
            const encodedHashtag = encodeURIComponent(match);
            return `<a href="/community/hashtag?searchWord=${encodedHashtag}" class="hashtag">${match}</a>`;
        });
    }
    htmlContent = convertHashtagsToLinks(htmlContent);
    htmlContent2 = convertHashtagsToLinks(htmlContent2);
    $('.community-video-detail-text').html(htmlContent);
    $('.community-video-detail-title').html(htmlContent2);

});


function deleteCheck(pk) {
    if (confirm('정말 삭제하시겠습니까?')) {
        location.href = '/community/video/delete?b_pk=' + pk;
    }
}

function deleteCommentsCheck(cm_pk, b_pk) {
    if (confirm('정말 삭제하시겠습니까?')) {
        location.href = '/community/video/deleteComments?cm_pk=' + cm_pk + '&b_pk=' + b_pk;
    }
}

