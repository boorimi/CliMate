function validateForm(event) {
    let fileInput = document.getElementById('uploadFile');
    let files = fileInput.files;
    if (fileInput.files.length === 0) {
        alert('ファイルを選んでください。');
        event.preventDefault(); // 폼 제출 방지
        return false;
    } else if (fileInput.files.length > 4) {
        alert('最大4個までアップロードできます。');
        event.preventDefault(); // 폼 제출 방지
        return false;
    }
    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        if (!file.name.endsWith('.mp4')) {
            alert('.MP4ファイルのみアップロードできます。');
            event.preventDefault(); // 폼 제출 방지
            return false;
        }
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
}