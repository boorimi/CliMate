import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {DragControls} from "three/addons/controls/DragControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {GLTFExporter} from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/exporters/GLTFExporter.js";


$(document).ready(function () {
    const holdBtn = $('.hold-list-open-btn');
    const webglContainer = $('#webgl-container');
    let holdListMenuPC = $('#hold-list-container-pc');
    let holdListMenuMobile = $('#hold-list-container-mobile');

    holdListMenuPC.hide();
    holdListMenuMobile.hide();

    $(".s-menu-create").css({
        "background-color": "#79976a",
        "color": "#ffffff"
    });

    function checkWidth() {
        holdBtn.off('click');

        if ($(window).width() <= 768) {
            holdBtn.on('click', function () {
                if (holdListMenuMobile.hasClass('list-hidden-mobile')) {
                    holdListMenuMobile.css('display', 'flex');
                    holdListMenuMobile.removeClass('list-hidden-mobile').addClass('list-visible-mobile').animate({bottom: '0'}, 500, function () {
                    });
                } else {
                    holdListMenuMobile.animate({bottom: '-100%'}, 500, function () {
                        holdListMenuMobile.removeClass('list-visible-mobile').addClass('list-hidden-mobile').css('display', 'none');
                    });
                }
            });
        } else {
            holdBtn.on('click', function () {
                if (holdListMenuPC.hasClass('list-hidden-pc')) {
                    holdListMenuPC.css('display', 'flex');
                    holdListMenuPC.removeClass('list-hidden-pc').addClass('list-visible-pc').animate({left: '0'}, 500, function () {
                    });
                } else {
                    holdListMenuPC.animate({left: '-100%'}, 500, function () {
                        holdListMenuPC.removeClass('list-visible-pc').addClass('list-hidden-pc').css('display', 'none');
                    });
                }
            });
        }
    }

    checkWidth();
    $(window).resize(checkWidth);

    $('.hold-img').on('click', function () {
        const hPk = $(this).data('hpk');
        const methodName = `loadModel${hPk}`;
        if (typeof app[methodName] === 'function') {
            console.log(methodName);
            app[methodName]();
        } else {
            console.error(`Method ${methodName} 존재하지 않는 메서드.`);
        }
    });
});

// 저장버튼 클릭 모달
function showSaveConfirm() {
    const modalBackground = document.getElementById('s-create-modal-background');
    const confirmSave = document.getElementById('s-confirm-save');
    const confirmCancel = document.getElementById('s-confirm-cancel');

    modalBackground.style.display = 'block';

    // 기존 이벤트 리스너 제거
    confirmSave.removeEventListener('click', saveHandler);
    confirmCancel.removeEventListener('click', cancelHandler);

    // 새로운 이벤트 리스너 등록
    confirmSave.addEventListener('click', saveHandler);
    confirmCancel.addEventListener('click', cancelHandler);
}

// 저장 버튼 클릭 시 함수
function saveHandler() {
    console.log("세이브 클릭");

    document.getElementById('s-create-modal').style.display = "none";
    app.exportScene();
    document.getElementById('s-loading-modal').style.display = "block";
}

// 취소 버튼 클릭 시 함수
function cancelHandler() {
    console.log('취소 클릭');
    document.getElementById('s-create-modal-background').style.display = 'none';
}

// 저장 완료 모달
function saveComplete() {
    document.getElementById('s-loading-modal').style.display = 'none';
    document.getElementById('s-save-complete-modal').style.display = 'block';
    document.getElementById('s-confirm-close').addEventListener('click', function () {
        location.href = "/simulator/main";
    })
}

// 배경을 클릭했을 때 모달 닫기
document.getElementById('s-create-modal-background').addEventListener('click', function (event) {
    if (event.target === event.currentTarget) {
        this.style.display = 'none';

        if (document.getElementById('s-save-complete-modal').style.display === 'block') {
            location.href = "/simulator/main";
        }
    }
});

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
        this._currentGroupName = null;
        this._positionData = null;
        this._rotationData = null;
        this._positionDataJSON = null;
        this._cube1 = null;
        this._cube2 = null;
        this._cube3 = null;
        this._draggableObjects = [];
        this._dragControls = null;
        this._exportButton = document.querySelector("#save-btn");
        this._exportButton.addEventListener("click", () => {
            console.log('저장버튼 클릭');
            showSaveConfirm();
        });
        this.userData = null;
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

    // 3D 저장
    exportScene() {
        const exporter = new GLTFExporter();

        console.log("3D 저장 함수 실행");

        // 씬 > glb 변환
        exporter.parse(
            this._scene,
            (result) => {
                const output = JSON.stringify(result, null, 2);
                // 랜덤 문자열 생성
                const randomString = this.generateRandomString(6);
                // 파일 이름에 랜덤 문자열 추가
                const gltfFile = `${randomString}.gltf`;
                const imgFile = `${randomString}.png`;

                // 씬을 캡처하기 전에 렌더링
                this._renderer.render(this._scene, this._camera);

                // gltf와 img 업로드
                this.uploadGLTF(output, gltfFile, imgFile);
            },
            {binary: false}
        );
    }

    // 랜덤 문자열 생성
    generateRandomString(length) {
        console.log("랜덤문자 생성 함수 실행");
        const characters = '123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    uploadGLTF(data, gltfFile, imgFile) {
        const gltfBlob = new Blob([data], {type: 'application/json'});

        // 캔버스를 캡처하여 이미지 데이터 URL로 변환
        this._renderer.domElement.toBlob((imageBlob) => {
            console.log("이미지 생성 함수 실행");
            const formData = new FormData();
            formData.append('gltfFile', gltfBlob, gltfFile);
            formData.append('imgFile', imageBlob, imgFile);

            fetch('/simulator/upload', {
                headers: {Accept: "application/json"},
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:' + data.status);

                    // 저장 성공 후 모달펑션
                    saveComplete();
                })
                .catch((error) => {
                    alert('fail');
                    console.error('에러:' + error);
                });
        }, 'image/png');
    }


    loadModel1() {
        loadModel(this, '/resources/holds/hold01.glb', 'modelGroup1', {x: 0, y: 1, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
    }

    loadModel2() {
        loadModel(this, '/resources/holds/hold02.glb', 'modelGroup2', {x: 0, y: 1.5, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
    }

    loadModel3() {
        loadModel(this, '/resources/holds/hold03.glb', 'modelGroup3', {x: 0, y: 1.2, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
    }

    loadModel4() {
        loadModel(this, '/resources/holds/hold04.glb', 'modelGroup4', {x: 0, y: 1.2, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
    }

    loadModel5() {
        loadModel(this, '/resources/holds/hold05.glb', 'modelGroup5', {x: 0, y: 1.2, z: 0.1}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 1.6, y: 0, z: 0});
    }

    loadModel6() {
        loadModel(this, '/resources/holds/hold06.glb', 'modelGroup6', {x: 0, y: 1.2, z: 0}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 1.6, y: 0, z: 0});
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

    console.log('width', window.innerWidth);
    console.log('height', window.innerHeight);

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
    const intensity = 1;
    const directionalLight = new THREE.DirectionalLight(rgbColor, intensity);
    directionalLight.position.set(-3, 4.7, 4);
    app._scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(rgbColor, 1.5);
    app._scene.add(ambientLight);

    const pointLight = new THREE.PointLight(rgbColor, 50);
    pointLight.position.set(0, 5, 5);
    app._scene.add(pointLight);
}

function setupModel(app) {
    const textureLoader = new THREE.TextureLoader();
    let rgbColor = rgbToHex(240, 240, 240);
    const texture = textureLoader.load('/resources/img/texture01.png');

    const geometry = new THREE.BoxGeometry(4, 4.7, 0.1);
    const fillMaterial = new THREE.MeshPhongMaterial({
        color: rgbColor,
        map: texture,
    });
    const cube = new THREE.Mesh(geometry, fillMaterial);
    const group = new THREE.Group();
    group.add(cube);

    const geometry2 = new THREE.BoxGeometry(4, 4.7, 0.1);
    const fillMaterial2 = new THREE.MeshPhongMaterial({
        color: rgbColor,
        map: texture,
    });
    const cube2 = new THREE.Mesh(geometry2, fillMaterial2);
    const group2 = new THREE.Group();
    group2.add(cube2);

    rgbColor = rgbToHex(170, 170, 170);
    const geometry3 = new THREE.BoxGeometry(4, 3.9, 0.3);
    const fillMaterial3 = new THREE.MeshPhongMaterial({color: rgbColor});
    const cube3 = new THREE.Mesh(geometry3, fillMaterial3);
    const group3 = new THREE.Group();
    group3.add(cube3);

    group.position.set(0, 1.1, 0);
    group2.position.set(2.05, 1.1, 1.95);
    group3.position.set(0, -1.1, 2);

    group2.rotation.y = Math.PI / 2;
    group3.rotation.x = Math.PI / 2;

    app._scene.add(group);
    app._scene.add(group2);
    app._scene.add(group3);

    group.name = 'cube1';
    group2.name = 'cube2';
    group3.name = 'cube3';

    app._cube1 = group;
    app._cube2 = group2;
    app._cube3 = group3;
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

// 홀드 로드
function loadModel(app, modelPath, groupName, position, scale, rotation) {
    const loader = new GLTFLoader();

    loader.load(
        modelPath,
        (glb) => {
            const model = glb.scene;
            app._glbModel = model;
            model.position.set(position.x, position.y, position.z);
            model.scale.set(scale.x, scale.y, scale.z);
            model.rotation.set(rotation.x, rotation.y, rotation.z);

            const modelGroup = model;
            modelGroup.name = groupName;

            // console.log(groupName);

            app._currentGroupName = groupName;

            app._scene.add(modelGroup);
            app._draggableObjects.push(modelGroup);

            app._positionData = {
                x: model.position.x,
                y: model.position.y,
                z: model.position.z
            };

            app._rotationData = {
                x: model.rotation.x,
                y: model.rotation.y,
                z: model.rotation.z
            }

            setupDragControls(app);
        },

        undefined,
        (error) => {
            console.error(error);
        }
    );
}

// 드래그 이벤트
function setupDragControls(app) {
    if (app._dragControls) {
        app._dragControls.dispose();
    }

    app._dragControls = new DragControls(app._draggableObjects, app._camera, app._renderer.domElement);

    app._dragControls.addEventListener('dragstart', function (event) {
        app._controls.enabled = false;

        let originObject = event.object;
        let object = event.object.parent;

        // 드래그 시작 시 객체를 투명하게 설정
        object.traverse((child) => {
            if (child.isMesh) {
                if (!child.userData.hasOwnProperty('originalOpacity')) {
                    child.userData.originalOpacity = child.material.opacity;
                    child.userData.originalTransparent = child.material.transparent;
                }
                child.material.opacity = 0.3;
                child.material.transparent = true;
            }
        });
        handleDrag(originObject, object, object.name, event);
    });

    app._dragControls.addEventListener('drag', function (event) {
        let object = event.object.parent;
        let originObject = event.object;

        handleDrag(originObject, object, object.name, event);
    });

    app._dragControls.addEventListener('dragend', function (event) {
        app._controls.enabled = true;

        // 드래그 종료 시 객체를 불투명하게 설정
        let object = event.object.parent;
        let originObject = event.object;
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.opacity = child.userData.originalOpacity;
                child.material.transparent = child.userData.originalTransparent;
            }
        });

        // 새로운 위치로 positionData를 업데이트
        app._positionData = {
            x: originObject.position.x,
            y: originObject.position.y,
            z: originObject.position.z
        };

        app._rotationData = {
            x: originObject.rotation.x,
            y: originObject.rotation.y,
            z: originObject.rotation.z
        }
        let groupName = object.name;
        // 업데이트된 위치 데이터를 로그로 출력
        logModelInfo(groupName, app._positionData, app._rotationData, object, originObject);
        handleDrag(originObject, object, object.name, event);
    });
}

// 모델 정보
function logModelInfo(groupName, positionData, rotationData, object, originObject, event) {
    // console.log("모델인포펑션: " + object.name);
    console.log(`Position - X: ${positionData.x}, Y: ${positionData.y}, Z: ${positionData.z}`);
    console.log(`로테이션 - Z: ${rotationData.z}`);
    console.log(`로테이션 - X: ${rotationData.x}`);
    // console.log("로그 모델" + groupName);
    handleDrag(object, groupName);
}

function handleDrag(originObject, object, event) {
    // 객체의 위치 제한 (지정된 범위 내에서만 이동 가능)
    const minX = -1700;
    const maxX = 2000;
    const minZ = -1600;
    const maxZ = 2400;
    const minY = -3500;
    const maxY = -200;

    let modelName = String(object.name);

    if (modelName.includes('phone')) {
        if (originObject.rotation.x === 0) {
            originObject.position.x = Math.max(minX, Math.min(maxX, originObject.position.x));
            originObject.position.z = Math.max(minZ, Math.min(maxZ, originObject.position.z));
            // y 축 이동 제한 (사실 z축인 셈)
            originObject.position.y = 0;

            if (originObject.position.z <= minZ) {
                // console.log("닿았다");
                originObject.rotation.x = -1.6;
            }
            // x축을 y축으로 인식중.
            // y축이 x축.
        } else if (originObject.rotation.x === -1.6) {
            originObject.position.x = Math.max(-1900, Math.min(2200, originObject.position.x));
            originObject.position.y = Math.max(-3500, Math.min(100, originObject.position.y));
            originObject.position.z = -2000;

            if (originObject.position.y >= maxY) {
                // console.log("다시 닿았다")
                originObject.rotation.x = 0;
            }
        }
        // 모델 1,2,3,4
    } else {
        if (originObject.rotation.z === 0) {
            // x, z 축 범위 내에서만 이동 가능하도록 설정
            originObject.position.x = Math.max(minX, Math.min(maxX, originObject.position.x));
            originObject.position.z = Math.max(minZ, Math.min(maxZ, originObject.position.z));

            // y 축 이동 제한 (사실 z축인 셈)
            originObject.position.y = 0; // y 축 위치를 0으로 고정

            if (originObject.position.x >= maxX) {
                // console.log("닿았다");
                originObject.rotation.z = -1.6;
            }

        } else if (originObject.rotation.z === -1.6) {
            // y 축 범위 내에서만 이동 가능하도록 설정
            originObject.position.y = Math.max(minY, Math.min(maxY, originObject.position.y));
            originObject.position.z = Math.max(minZ, Math.min(maxZ, originObject.position.z));

            // x 축 고정값 설정
            originObject.position.x = 2000;

            // cube2 왼쪽 끝에 닿으면 다시 회전
            if (originObject.position.y >= -200) {
                // console.log("다시 닿았다")
                originObject.rotation.z = 0;
            }
        }
    }


}

let app;
window.onload = function () {
    app = new App();
    app.initialize();
};
