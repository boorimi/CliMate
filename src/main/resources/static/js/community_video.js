$(document).ready(function () {

    updateText();
    changeColor();

    function changeColor(){
        $('#category-video').css({
            "background-color": "#79976a",
            "color": "#ffffff"
        });
    }

    function updateText() {

        $('.community-climbing-name').each(function () {
            let text = $(this).text();
            let english = /[qwertyuiopasdfghjklzxcvbnm]/.test(text);

            if ($(window).width() <= 768) {
                if (english) {
                    if (text.length > 15) {
                        let moreText = text.substring(0, 15) + '..';
                        $(this).text(moreText);
                    }
                } else {
                    if (text.length > 7) {
                        let moreText = text.substring(0, 7) + '..';
                        $(this).text(moreText);
                    }
                }
            } else {
                if (english) {
                    if (text.length > 30) {
                        let moreText = text.substring(0, 30) + '..';
                        $(this).text(moreText);
                    }
                } else {
                    if (text.length > 11) {
                        let moreText = text.substring(0, 11) + '..';
                        $(this).text(moreText);
                    }
                }
            }
        });
    }

// 창 크기 변경 시마다 실행
    $(window).resize(function () {
        updateText();
    });

});