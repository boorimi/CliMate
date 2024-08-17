$(document).ready(function(){
    // 슬릭 슬라이더 초기화

});

function validateForm(event) {
    let fileInput = document.getElementById('uploadFile');
    let files = fileInput.files;
    if (fileInput.files.length === 0) {
        alert('파일을 선택해 주세요');
        event.preventDefault(); // 폼 제출 방지
        return false;
    } else if (fileInput.files.length > 4) {
        alert('최대 4개의 파일까지 선택 가능합니다');
        event.preventDefault(); // 폼 제출 방지
        return false;
    }

    let titleInput = document.querySelector('input[name="b_title"]');
    let title = titleInput.value.trim();
    if (!title.startsWith('#')) {
        alert('제목은 #으로 시작해야 합니다.');
        event.preventDefault(); // 폼 제출 방지
        return false;
    }
    if (title.length < 2 || title.length > 40) {
        alert('제목은 2글자 이상, 40글자 이하로 입력해야 합니다.');
        event.preventDefault(); // 폼 제출 방지
        return false;
    }

    // 본문 검사
    let textInput = document.querySelector('input[name="b_text"]');
    let text = textInput.value.trim();
    if (text.length < 2 || text.length > 200) {
        alert('본문은 2글자 이상, 200글자 이하로 입력해야 합니다.');
        event.preventDefault(); // 폼 제출 방지
        return false;
    }
    return true;

    // 파일 올리면 미리보기 생성하기

}

function setThumbnail(event) {
    let files = event.target.files;
    let imageContainer = document.querySelector(".community-showoff-video");
    let customArrows = document.querySelector(".custom-arrows");
    imageContainer.innerHTML = ""; // 기존 동영상 제거


    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        if (!file.name.endsWith('.mp4')) {
            alert('MP4파일만 업로드 가능합니다.');
            event.target.value = "";
            return;
        }
    }

    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let reader = new FileReader();
            reader.onload = function (event) {
                let video = document.createElement("video");
                video.setAttribute("src", event.target.result);
                video.setAttribute("controls", "controls"); // controls 속성 추가

                // 비디오를 감싸는 <div> 생성
                let slideDiv = document.createElement('div');
                // slideDiv.className = 'slick-slide'; // 이 클래스는 실제로 필요 없지만 확인용으로 추가

                slideDiv.appendChild(video);
                imageContainer.appendChild(slideDiv);

                // 슬릭 슬라이더가 비디오를 포함한 새로운 슬라이드 항목을 업데이트
                if ($('.community-showoff-video').hasClass('slick-initialized')) {
                    $('.community-showoff-video').slick('slickAdd', slideDiv);
                }
            };
        reader.readAsDataURL(file);
    }

    $('.community-showoff-video').slick({
        prevArrow: $('.slick-prev'),
        nextArrow: $('.slick-next'),
        centerMode: true, // 가운데 정렬 모드 활성화
        centerPadding: '0', // 중앙 정렬 시 좌우 패딩 제거
        variableWidth: true, // 슬라이드 너비 조절 가능
        infinite: false
    });
    customArrows.style.display = 'flex';

}

// bm
// 슬릭슬라이더 파일 업로드 버튼 연결 js
document.getElementById('uploadFile').addEventListener('change', function() {
    const fileInput = this;
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    // 선택된 파일명을 표시
    if (fileInput.files.length > 0) {
        const fileNames = Array.from(fileInput.files).map(file => file.name).join(', ');
        fileNameDisplay.textContent = fileNames;
    }
});

document.getElementById('uploadThumbnail').addEventListener('change', function() {
    const fileInput = this;
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    // 선택된 파일명을 표시
    if (fileInput.files.length > 0) {
        const fileNames = Array.from(fileInput.files).map(file => file.name).join(', ');
        fileNameDisplay.textContent = fileNames;
    }
});

// 인풋 포커스 div background-color 변경
document.addEventListener('DOMContentLoaded', function() {
    var inputElement = document.querySelector('input[name="b_title"]');
    var titleBox = document.querySelector('.title-box');

    inputElement.addEventListener('focus', function() {
        titleBox.style.backgroundColor = '#f3f6ee';
    });

    inputElement.addEventListener('blur', function() {
        titleBox.style.backgroundColor = '';
    });
});