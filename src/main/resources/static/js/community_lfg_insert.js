$(document).ready(function () {
    $('#summernote').summernote({
        height: 350,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['picture']],
            ['view', ['fullscreen', 'codeview']],
        ],
        // 리사이징바 제거 bm
        focus: true,
        disableResizeEditor: true,
        callbacks: {
            onImageUpload: function (files) {
                for (let i = 0; i < files.length; i++) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        $('#summernote').summernote('insertImage', e.target.result);
                    };
                    reader.readAsDataURL(files[i]);
                    uploadImage(files[i]);
                }
            }
        }
    });
    // 리사이징바 제거 bm
    $('.note-statusbar').hide();

    function uploadImage(file) {
        let data = new FormData();
        data.append('file', file);

        $.ajax({
            url: '/community/lfg/insert/uploadImg',
            method: 'POST',
            data: data,
            contentType: false,
            processData: false,
            success: function (response) {
                $('#summernote').summernote('insertImage', response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(textStatus + " " + errorThrown);
            }
        });
    }
});