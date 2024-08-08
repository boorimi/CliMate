$(document).ready(function () {
    $('.community-climbing-name').each(function () {
        let text = $(this).text();
        let english = /[qwertyuiopasdfghjklzxcvbnm]/.test(text);

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
    });
});