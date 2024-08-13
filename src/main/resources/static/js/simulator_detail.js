import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

$(document).ready(function () {
    $(".delete").click(function () {
        const pk = $(this).data('pk');
        const gltf = $(this).data('gltf');
        const img = $(this).data('img');
        if (confirm("진짜 삭제?" + pk + "파일: " + gltf + "이미지: " + img)) {
            $.ajax({
                url: '/simulator/deleteProject',  // 서버에서 요청을 처리할 URL
                type: 'POST',
                data: {pk: pk},
                success: function (response) {
                    alert('삭제되었습니다.');
                    location.href = '/simulator/gallery';
                },
                error: function (error) {
                    alert('삭제 중 오류가 발생했습니다.');
                }
            });
        }
    })


    // 메뉴 열기 및 닫기 토글
    function toggleMenu($pTag) {
        var $profileMenu = $('.profile-menu');
        var offset = $pTag.offset();

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
        var $profileMenu = $('.profile-menu');
        $profileMenu.removeClass('active');
        $profileMenu.removeData('activeElement'); // 활성화된 p 태그 데이터 제거
    }

    // p 태그 클릭 이벤트 연결
    $('.title-nickname, .comment-nickname').on('click', function(event) {
        event.stopPropagation(); // 메뉴 외부 감지를 위해 클릭 전파 중지
        toggleMenu($(this));
    });

    // 프로필 메뉴 외부 클릭 감지
    $(document).on('click', function(event) {
        var $profileMenu = $('.profile-menu');
        if (!$profileMenu.is(event.target) && $profileMenu.has(event.target).length === 0) {
            closeMenu();
        }
    });

    // 메뉴 클릭 시 전파 중지
    $('.profile-menu').on('click', function(event) {
        event.stopPropagation();
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
