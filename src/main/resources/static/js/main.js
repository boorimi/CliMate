$(document).ready(function() {
    const images = $(".main-background-img > img");
    let current = 0;

    function slideImage() {
        images.eq(current).removeClass("active");
        current = (current + 1) % images.length;
        images.eq(current).addClass("active");
    }

    // 첫 번째 이미지 표시
    images.eq(current).addClass("active");

    // 2초마다 slideImage 함수 호출
    setInterval(slideImage, 3000);
});