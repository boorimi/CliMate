$(document).ready(function () {
  // 프로필 메뉴 열기 및 닫기 토글
  function profileToggleMenu($pTag) {
    let $profileMenu = $(".profile-menu");
    let offset = $pTag.offset();

    // 메뉴가 이미 열려 있고 같은 p 태그를 다시 클릭한 경우, 메뉴를 닫음
    if (
      $profileMenu.hasClass("active") &&
      $profileMenu.data("activeElement") === $pTag[0]
    ) {
      closeMenu();
    } else {
      // 클릭된 p 태그 위치를 기준으로 메뉴 위치 설정
      $profileMenu.css({
        top: offset.top + $pTag.outerHeight(),
        left: offset.left,
      });

      // 메뉴 활성화
      $profileMenu.addClass("active");
      $profileMenu.data("activeElement", $pTag[0]); // 현재 활성화된 p 태그를 저장
    }
  }

  // 메뉴 닫기
  function closeMenu() {
    let $profileMenu = $(".profile-menu");
    $profileMenu.removeClass("active");
    $profileMenu.removeData("activeElement"); // 활성화된 p 태그 데이터 제거
  }

  // p 태그 클릭 이벤트 연결
  let currentNickname;
  let currentId;
  let privacy;
  let userId = $("#userId").text();
  $(".nickname").on("click", function (event) {
    event.stopPropagation(); // 메뉴 외부 감지를 위해 클릭 전파 중지

    currentNickname = $(this).data("nickname");
    currentId = $(this).data("id");
    privacy = $(this).data("privacy");

    // console.log('프로필 공개여부:', privacy);
    // console.log('클릭한 사람의 닉네임:', currentNickname);
    // console.log('클릭한 아이디 :'+currentId);
    // console.log('내 아이디 :'+userId);

    profileToggleMenu($(this));
  });

  // 프로필 메뉴 외부 클릭 감지
  $(document).on("click", function (event) {
    let $profileMenu = $(".profile-menu");
    if (
      !$profileMenu.is(event.target) &&
      $profileMenu.has(event.target).length === 0
    ) {
      closeMenu();
    }
  });

  // 메뉴 클릭 시 전파 중지
  $(".profile-menu").on("click", function (event) {
    event.stopPropagation();
  });

  // 프로필 메뉴 클릭 시 href
  const linkProfile = $("#link-profile");
  const linkVideo = $("#link-video");
  const linklfg = $("#link-lfg");
  const linkGallery = $("#link-gallery");
  linkProfile.click(function (event) {

    // console.log('공개여부: '+privacy);
    // console.log('내 아이디: '+userId);
    // console.log('클릭한 아이디: '+currentId);

    if (privacy === "yes" || userId === currentId) {
      location.href = "/mypage/userProfile?u_id=" + currentId;
    } else {
      $(".privacy-modal-background").css("display", "block");
      $(".privacy-modal-background").click(function () {
        $(".privacy-modal-background").css("display", "none");
      });
      $("#private-modal-close").click(function (){
        $(".privacy-modal-background").css("display", "none");
      });
      $(".private-modal").click(function (event){
        event.stopPropagation();
      })
    }
  });

  linkVideo.click(function () {
    location.href =
      "/community/search?columnName=u_nickname&searchWord=" + currentNickname;
  });

  linklfg.click(function () {
    location.href =
      "/community/searchLfg?columnName=u_nickname&searchWord=" +
      currentNickname;
  });

  linkGallery.click(function (){
    location.href="/simulator/searchNickname?nickname="+currentNickname;
  })


  // 로그인 필요 모달
  $(".s-menu-create").click(function (){
    if (userId != null && userId != ""){
      location.href="/simulator/create";
    } else {
      showConfirm();
    }
  })

  $(".s-menu-my-project").click(function (){
    if (userId != null && userId != ""){
      location.href="/simulator/my_project";
    } else {
      showConfirm();
    }
  })

  let b_pk;
  $(".community-content").click(function (){
    b_pk = $(this).data('b_pk');

    if (userId != null && userId != ""){
      location.href='/community/video/detail?b_pk=' + b_pk;
    } else {
      showConfirm();
    }
  })

  $(".community-lfg-wrapper").click(function (){
    b_pk = $(this).data('b_pk');

    if (userId != null && userId != ""){
      location.href='/community/lfg/detail?b_pk=' + b_pk;
    } else {
      showConfirm();
    }
  })

  $(".community-video-insert").click(function (){
    if (userId != null && userId != ""){
      location.href="/community/video/insert";
    } else {
      showConfirm();
    }
  })

  $(".community-lfg-insert").click(function (){
    if (userId != null && userId != ""){
      location.href="/community/lfg/insert?b_pk=0";
    } else {
      showConfirm();
    }
  })

  function loginCheck(userId, dataPk) {
    if (userId != null && userId !== '') {
      location.href = '/simulator/gallery_detail?b_pk=' + dataPk;
    } else {
      showConfirm();
    }
  }

  $(".s-menu-gallery").click(function (){
    location.href="/simulator/gallery?category=All";
  })

});

// 로그인 필요 모달
function showConfirm() {
  document.getElementById('s-menu-modal-background').style.display = 'block';
}

// 로그인 버튼 클릭
document.getElementById('s-menu-confirm-yes').addEventListener('click', function() {
  document.getElementById('s-menu-modal-background').style.display = 'none';
  location.href = '/loginC';
});

// 취소 버튼 클릭
document.getElementById('s-menu-confirm-no').addEventListener('click', function() {
  document.getElementById('s-menu-modal-background').style.display = 'none';
});

// 배경을 클릭했을 때 모달 닫기
document.getElementById('s-menu-modal-background').addEventListener('click', function(event) {
  if (event.target === this) {
    this.style.display = 'none';
  }
});


function toggleMenu() {
  document.querySelector(".hamburger-menu").classList.toggle("active");
}

document.addEventListener("click", function (event) {
  const menu = document.querySelector(".hamburger-menu");
  const icon = document.querySelector(".hamburger");

  // 클릭한 요소가 메뉴나 아이콘이 아닌 경우
  if (!menu.contains(event.target) && !icon.contains(event.target)) {
    menu.classList.remove("active");
  }
});
