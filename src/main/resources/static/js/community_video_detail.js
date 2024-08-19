$(document).ready(function () {

    $(".showoff-video").slick({
        prevArrow: $(".slick-prev"),
        nextArrow: $(".slick-next"),
        centerMode: true, // 가운데 정렬 모드 활성화
        centerPadding: '0', // 중앙 정렬 시 좌우 패딩 제거
        variableWidth: true, // 슬라이드 너비 조절 가능
        infinite: false
    });

    $(document).on('click', '.video-detail-like-icon', function () {
        let b_pk = $(this).data('b_pk');
        let u_id = $(this).data('u_id');

        $.ajax({
            url: '/clickLike', // 요청을 보낼 서버 URL
            type: 'POST', // HTTP 요청 방법 (GET, POST 등)
            contentType: 'application/json', // 요청 본문 타입
            data: JSON.stringify({u_id: u_id, b_pk: b_pk}), // 서버에 보낼 데이터
            success: function (response) {
                console.log('Total Likes: ' + response.totalLikes);
                console.log('User Likes: ' + response.userLikes);
                // 요청이 성공했을 때 호출되는 함수
                let html;
                if (response.userLikes >= 1) {
                    html = `<div class="video-detail-like-icon" data-b_pk="${b_pk}" data-u_id="${response.u_id}"><img src="/resources/icon/love.png"></div>`
                } else if (response.userLikes == 0) {
                    html = `<div class="video-detail-like-icon" data-b_pk="${b_pk}" data-u_id="${response.u_id}"><img src="/resources/icon/love_blank.png"></div>`
                }
                let html2 = `<div class="video-detail-like-count">${response.totalLikes}</div>`

                $('.video-detail-like-box').empty().append(html);
                $('.video-detail-like-box').append(html2);

            },
            error: function (xhr, status, error) {
                // 요청이 실패했을 때 호출되는 함수
                console.log('Error:', error);
            }
        });
    });

    // 해쉬태그 만들기 코드 (제목과 본문)
    let htmlContent = $('.video-detail-text').html();
    let htmlContent2 = $('.video-detail-title').html();

    function convertHashtagsToLinks(text) {
        return text.replace(/(#[^\s#]+)/g, function (match) {
            const encodedHashtag = encodeURIComponent(match);
            return `<a href="/community/hashtag?searchWord=${encodedHashtag}" class="hashtag">${match}</a>`;
        });
    }

    htmlContent = convertHashtagsToLinks(htmlContent);
    htmlContent2 = convertHashtagsToLinks(htmlContent2);
    $('.video-detail-text').html(htmlContent);
    $('.video-detail-title').html(htmlContent2);

    // 답글 버튼 토글
    const searchOpenIcon = $(".comment-toggle");

    // 검색 인풋 오픈
    searchOpenIcon.click(function () {
        const searchMenu = $(this).next(".comment-bottom-box-wrapper");
        searchMenu.slideToggle();
        searchMenu.css("display", "block");
    });
});


function deleteCheck(pk) {
    document.getElementById('post-delete-modal-background').style.display = "block";

    document.getElementById('post-delete-confirm-yes').addEventListener('click', function () {
        location.href = '/community/video/delete?b_pk=' + pk;
    });

    document.getElementById('post-delete-confirm-no').addEventListener('click', function () {
        document.getElementById('post-delete-modal-background').style.display = "none";
    });
    document.getElementById('post-delete-modal-background').addEventListener('click', function () {
        document.getElementById('post-delete-modal-background').style.display = "none";
    });
}

// 게시물, 댓글 삭제
function deleteCommentsCheck(cm_pk, b_pk) {
    document.getElementById('comment-delete-confirm-background').style.display = "block";

    document.getElementById('comment-confirm-yes').addEventListener('click', function () {
        location.href = '/community/video/deleteComments?cm_pk=' + cm_pk + '&b_pk=' + b_pk;
    });

    document.getElementById('comment-confirm-no').addEventListener('click', function () {
        document.getElementById('comment-delete-confirm-background').style.display = "none";
    });

    document.getElementById('comment-delete-confirm-background').addEventListener('click', function () {
        document.getElementById('comment-delete-confirm-background').style.display = "none";
    });

}


