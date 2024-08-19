import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

$(document).ready(function () {

    // 좋아요 눌렀을때 토글되는 기능
    $(document).on('click', '.like-icon', function () {
        let b_pk = $(this).data('b_pk');
        let u_id = $(this).data('u_id');

        $.ajax({
            url: '/clickLike', // 요청을 보낼 서버 URL
            type: 'POST', // HTTP 요청 방법 (GET, POST 등)
            contentType: 'application/json', // 요청 본문 타입
            data: JSON.stringify({u_id: u_id, b_pk: b_pk}), // 서버에 보낼 데이터
            success: function (response) {
                console.log('Total Likes: ' + response.totalLikes);
                console.log('User Likes: ' + response.userLikes);
                // 요청이 성공했을 때 호출되는 함수
                let html;
                if (response.userLikes >= 1) {
                    html = `<img class="like-icon"
                     data-b_pk="${b_pk}"
                     data-u_id="${response.u_id}"
                     src="/resources/icon/love.png">`
                } else if (response.userLikes == 0) {
                    html = `<img class="like-icon"
                     data-b_pk="${b_pk}"
                     data-u_id="${response.u_id}"
                     src="/resources/icon/love_blank.png">`
                }
                let html2 = `<p class="like-count">${response.totalLikes}</p>`

                $('#toggle-like').empty().append(html);
                $('#toggle-like').append(html2);

            },
            error: function (xhr, status, error) {
                // 요청이 실패했을 때 호출되는 함수
                console.log('Error:', error);
            }
        });
    });

    $(".s-menu-gallery").css({
        "background-color": "#79976a",
        "color": "#ffffff"
    });

    // 딜리트 모달
    $(".delete").click(function () {
        const pk = $(this).data('pk');
        const gltf = $(this).data('gltf');
        const img = $(this).data('img');

        $('.post-delete-modal-background').css("display", "block");

        // 이전 페이지 url 전달
        let previousUrl = document.referrer;

        $('#post-delete-confirm-yes').on('click', function () {
            console.log("예스 클릭");
            location.href = '/simulator/deleteProject?pk='+pk+'&previousUrl=' + previousUrl;
        });

        $('#post-delete-confirm-no').click(function (){
            $('.post-delete-modal-background').css("display", "none");
        })

        // 배경을 클릭했을 때 모달 닫기
        $('#post-delete-modal-background').on('click', function (event) {
            if (event.target === this) {
                $(this).css("display", "none");
            }
        });
    })


    // 댓글 삭제
    $('.comments-delete').click(function (){
        let cmPk = $(this).data('cm_pk');
        let bPk = $(this).data('b_pk');

        console.log(cmPk+"////"+bPk);

        $('.comment-delete-modal-background').css("display", "flex");

        $('#comment-confirm-yes').click(function (){
            location.href = '/simulator/deleteComment?cm_pk=' + cmPk + '&b_pk=' + bPk;
        })

        $('#comment-confirm-no').click(function (){
            $('.comment-delete-modal-background').css("display", "none");

            // 클릭 이벤트를 제거하여 다음 클릭 시 초기화된 상태로 유지
            $('#comment-confirm-yes').off('click');
            $('#comment-confirm-no').off('click');
        })
    })

    $('.comment-delete-modal-background').click(function (){
        $('.comment-delete-modal-background').css("display", "none");
    })

    // 답글 버튼 토글
    const searchOpenIcon = $(".comment-toggle");

    // 대댓글 버튼 토글
    searchOpenIcon.click(function () {
        const searchMenu = $(this).next(".comment-bottom-box-wrapper");
        searchMenu.slideToggle();
        searchMenu.css("display", "block");
    });
})

function rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

class App {
    constructor() {
        this._divContainer = document.querySelector("#webgl-container");
        this._renderer = new THREE.WebGLRenderer({antialias: true});
        this._scene = new THREE.Scene();
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();
        this._camera = new THREE.PerspectiveCamera();
        this._controls = null;
    }

    initialize() {
        init(this);
    }

    resize() {
        resize(this);
    }

    render(time) {
        render(this, time);
    }

    update(time) {
        update(this, time);
    }


}

function init(app) {
    app._renderer.setPixelRatio(window.devicePixelRatio);
    app._divContainer.appendChild(app._renderer.domElement);

    const scene = app._scene;
    let rgbColor = rgbToHex(226, 240, 215);
    scene.background = new THREE.Color(rgbColor);

    setupCamera(app);
    setupLight(app);
    setupModel(app);
    setupControls(app);

    app.resize();

    window.onresize = () => app.resize();

    requestAnimationFrame((time) => app.render(time));

}

function resize(app) {
    const width = app._divContainer.clientWidth;
    const height = app._divContainer.clientHeight;
    app._camera.aspect = width / height;
    app._camera.updateProjectionMatrix();

    app._renderer.setSize(width, height);
}

function render(app, time) {
    requestAnimationFrame((time) => app.render(time));
    app._renderer.render(app._scene, app._camera);
    app.update(time);
}

function update(app, time) {
    time *= 0.001;
}

function setupCamera(app) {
    const width = app._divContainer.clientWidth;
    const height = app._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.z = 7;
    app._camera = camera;
}

function setupLight(app) {
    let rgbColor = rgbToHex(255, 255, 255);
    const intensity = 0;
    const directionalLight = new THREE.DirectionalLight(rgbColor, intensity);
    directionalLight.position.set(1, 1, 1);
    app._scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(rgbColor, 2);
    app._scene.add(ambientLight);

}

function setupModel(app) {
    const loader = new GLTFLoader();
    const fileName = $('.simulator-content').data('file');
    const filePath = `/climate_upload/${fileName}`;

    loader.load(
        filePath,
        function (gltf) {
            const model = gltf.scene;
            app._scene.add(model);

            // 모델 크기 조정 (옵션)
            model.scale.set(1, 1, 1);

            // 모델 위치 조정 (옵션)
            model.position.set(0, 0, 0);
        }
    );
}

// OrbitControls를 설정하여 카메라 조작
// 카메라의 팬(pan) 범위를 제한하는 로직 추가
function setupControls(app) {
    const controls = new OrbitControls(app._camera, app._divContainer);

    // 패닝 한계 설정
    controls.minPolarAngle = -Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.screenSpacePanning = true;
    const maxPan = 2;
    const minPan = -2;

    function constrainPan() {
        const offset = controls.target.clone();

        if (offset.x > maxPan) {
            offset.x = maxPan;
        } else if (offset.x < minPan) {
            offset.x = minPan;
        }

        if (offset.y > maxPan) {
            offset.y = maxPan;
        } else if (offset.y < minPan) {
            offset.y = minPan;
        }

        if (offset.z > maxPan) {
            offset.z = maxPan;
        } else if (offset.z < minPan) {
            offset.z = minPan;
        }

        controls.target.copy(offset);
    }

    controls.addEventListener("change", constrainPan);
    controls.maxDistance = 15;
    app._controls = controls;
}


let app;
window.onload = function () {
    app = new App();
    app.initialize();
};

function deleteReplyCheck(re_pk, b_pk) {
    let ok = confirm("정말 삭제하시겠습니까?");
    if (ok) {
        location.href = '/simulator/replyComments/delete?re_pk=' + re_pk + '&b_pk=' + b_pk ;
    }
}
