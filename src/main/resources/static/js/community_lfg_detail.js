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
    $(document).on('click', '.showoff-detail-comments-nickname', function (event) {
        $('.showoff-detail-comments-nicknameMenu').removeClass('activeNickname');
        $(this).siblings('.showoff-detail-comments-nicknameMenu').toggleClass('activeNickname');
        event.stopPropagation();
    });

    $(document).on('click', function () {
        $('.showoff-detail-comments-nicknameMenu, .lfg-detail-board-nicknameMenu').removeClass('activeNickname');
    });

    $(document).on('click', '.showoff-detail-comments-nicknameMenu, .lfg-detail-board-nicknameMenu', function (event) {
        event.stopPropagation();
    });

    // 해쉬태그 만들기 코드 (제목과 본문)
    let htmlContent = $('.lfg-detail-text').find('p').html();
    let htmlContent2 = $('#lfg-title-category').html();
    function convertHashtagsToLinks(text) {
        return text.replace(/(#[^\s#]+)/g, function(match) {
            const encodedHashtag = encodeURIComponent(match);
            return `<a href="/community/hashtagLfg?searchWord=${encodedHashtag}" class="hashtag">${match}</a>`;
        });
    }
    htmlContent = convertHashtagsToLinks(htmlContent);
    htmlContent2 = convertHashtagsToLinks(htmlContent2);
    $('.lfg-detail-text').find('p').html(htmlContent);
    $('#lfg-title-category').html(htmlContent2);


    // 수정,삭제 메뉴 더보기
    $('#lfg-detail-more-btn').click(function (event) {
        event.stopPropagation(); // 이벤트 버블링 방지
        if ($('.lfg-detail-updelMenu').hasClass('active')) {
            $('.lfg-detail-updelMenu').removeClass('active');
        } else {
            $('.lfg-detail-updelMenu').addClass('active');
        }
    });

    // 다른 영역 클릭 시 메뉴 닫기
    $(document).click(function (event) {
        if (!$(event.target).closest('.lfg-detail-updelMenu, #lfg-detail-more-btn').length) {
            $('.lfg-detail-updelMenu').removeClass('active');
        }
    });



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
