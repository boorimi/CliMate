$(document).ready(function () {

    // 현재 머무른 페이지 div색상 변경
    changeColor();
    function changeColor(){
        $('#category-together').css({
            "background-color": "#79976a",
            "color": "#ffffff"
        });
    }
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
    let htmlContent = $('.community-lfg-detail-text').find('p').html();
    let htmlContent2 = $('.community-lfg-detail-title1st').html();
    function convertHashtagsToLinks(text) {
        return text.replace(/(#[^\s#]+)/g, function(match) {
            const encodedHashtag = encodeURIComponent(match);
            return `<a href="/community/hashtagLfg?searchWord=${encodedHashtag}" class="hashtag">${match}</a>`;
        });
    }
    htmlContent = convertHashtagsToLinks(htmlContent);
    htmlContent2 = convertHashtagsToLinks(htmlContent2);
    $('.community-lfg-detail-text').find('p').html(htmlContent);
    $('.community-lfg-detail-title1st').html(htmlContent2);

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

function redirectToProfile(element) {
    const userId = element.getAttribute('data-u_id');
    location.href = '/mypage/userProfile?u_id=' + userId;
}

function redirectToVideoPost(element) {
    const userNickname = element.getAttribute('data-u_nickname');
    location.href = '/community/search?columnName=u_nickname&searchWord=' + userNickname;
}

function redirectToLfgPost(element) {
    const userNickname = element.getAttribute('data-u_nickname');
    location.href = '/community/searchLfg?columnName=u_nickname&searchWord=' + userNickname;
}