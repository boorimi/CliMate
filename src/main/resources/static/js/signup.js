$(function() {
    //프로필 이미지 업로드 및 미리보기
    $("#file-input").on("change",function(event) {
            const file = event.target.files;
        if(file && file[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile').src = e.target.result;
            };
            reader.readAsDataURL(file[0]);
        } else {
            document.getElementById('profile').src = "";
        }

        $("#profile").attr("src", "");
    })

    //등급 설정


    $("#grade-select").on("change", function(event) {
        console.log("check color value => "+event.target.value);
        const color = event.target.value;
        console.log("check color value => "+color);
        if(color === "red") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_red.png");
        } else if(color === "orange") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_orange.png");
        }else if(color === "yellow") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_yellow.png");
        }else if(color === "green") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_green.png");
        }else if(color === "blue") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_blue.png");
        }else if(color === "deepBlue") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_deepBlue.png");
        }else if(color === "purple") {
            $("#grade-img").attr("src", "");
            $("#grade-img").attr("src", "/resources/grade_icon/hold_purple.png");
        }
    })
})

