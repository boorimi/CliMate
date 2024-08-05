$(document).ready(function () {

    // 댓글 닉네임 눌렀을때 정보보기 메뉴 나오게 하기
    $(document).on('click', '.community-showoff-detail-comments-nickname', function (event) {
        $('.community-showoff-detail-comments-nicknameMenu').removeClass('activeNickname');
        $(this).siblings('.community-showoff-detail-comments-nicknameMenu').toggleClass('activeNickname');
        event.stopPropagation();
    });

    $(document).on('click', function () {
        $('.community-showoff-detail-comments-nicknameMenu, .community-lfg-detail-board-nicknameMenu').removeClass('activeNickname');
    });

    $(document).on('click', '.community-showoff-detail-comments-nicknameMenu, .community-lfg-detail-board-nicknameMenu', function (event) {
        event.stopPropagation();
    });

    // 게시글 닉네임 눌렀을때 정보 나오게 하기
    $(document).on('click', '.community-lfg-detail-title-nickname', function (event) {
        $('.community-lfg-detail-board-nicknameMenu').removeClass('activeNickname');
        $(this).siblings('.community-lfg-detail-board-nicknameMenu').toggleClass('activeNickname');
        event.stopPropagation();
    });



    // 수정,삭제 메뉴 나오게하기
    $(document).on('click','.community-lfg-detail-more-wrapper', function () {
        $('.community-lfg-detail-updelMenu').toggleClass('active');
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
        location.href = '/community/lfg/delete?b_pk=' + pk;
    }
}

function deleteCommentsCheck(cm_pk, b_pk) {
    if (confirm('정말 삭제하시겠습니까?')) {
        location.href = '/community/lfg/deleteComments?cm_pk=' + cm_pk + '&b_pk=' + b_pk;
    }
}