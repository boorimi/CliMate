$(document).ready(function () {

// 프로필 메뉴 열기 및 닫기 토글
    function profileToggleMenu($pTag) {
        let $profileMenu = $('.profile-menu');
        let offset = $pTag.offset();

        // 메뉴가 이미 열려 있고 같은 p 태그를 다시 클릭한 경우, 메뉴를 닫음
        if ($profileMenu.hasClass('active') && $profileMenu.data('activeElement') === $pTag[0]) {
            closeMenu();
        } else {
            // 클릭된 p 태그 위치를 기준으로 메뉴 위치 설정
            $profileMenu.css({
                top: offset.top + $pTag.outerHeight(),
                left: offset.left
            });

            // 메뉴 활성화
            $profileMenu.addClass('active');
            $profileMenu.data('activeElement', $pTag[0]); // 현재 활성화된 p 태그를 저장
        }
    }

// 메뉴 닫기
    function closeMenu() {
        let $profileMenu = $('.profile-menu');
        $profileMenu.removeClass('active');
        $profileMenu.removeData('activeElement'); // 활성화된 p 태그 데이터 제거
    }

// p 태그 클릭 이벤트 연결
    let currentNickname;
    let currentId;
    $('.nickname').on('click', function (event) {
        event.stopPropagation(); // 메뉴 외부 감지를 위해 클릭 전파 중지

        currentNickname = $(this).data('nickname');
        currentId = $(this).data('id');
        console.log('클릭한 사람의 닉네임:', currentNickname);
        console.log('아이디 :'+currentId);

        profileToggleMenu($(this));
    });

// 프로필 메뉴 외부 클릭 감지
    $(document).on('click', function (event) {
        let $profileMenu = $('.profile-menu');
        if (!$profileMenu.is(event.target) && $profileMenu.has(event.target).length === 0) {
            closeMenu();
        }
    });

// 메뉴 클릭 시 전파 중지
    $('.profile-menu').on('click', function (event) {
        event.stopPropagation();
    });

// 프로필 메뉴 클릭 시 href
    const linkProfile = $("#link-profile");
    const linkVideo = $("#link-video");
    const linklfg = $("#link-lfg");
    linkProfile.click(function () {

        // console.log('닉네임: '+currentNickname);
        // console.log('아이디: '+currentId);
        location.href = '/mypage/userProfile?u_id=' + currentId;
    });

    linkVideo.click(function () {
        location.href = '/community/search?columnName=u_nickname&searchWord=' + currentNickname;
    });

    linklfg.click(function () {
        location.href = '/community/searchLfg?columnName=u_nickname&searchWord=' + currentNickname;
    });


})



function toggleMenu() {
    document.querySelector('.hamburger-menu').classList.toggle('active');
}

document.addEventListener('click', function(event) {
    const menu = document.querySelector('.hamburger-menu');
    const icon = document.querySelector('.hamburger');

    // 클릭한 요소가 메뉴나 아이콘이 아닌 경우
    if (!menu.contains(event.target) && !icon.contains(event.target)) {
        menu.classList.remove('active');
    }
});
