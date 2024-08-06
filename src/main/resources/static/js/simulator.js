import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {DragControls} from "three/addons/controls/DragControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

$(document).ready(function () {
    const holdBtn = $('.hold-list-open-btn');
    const webglContainer = $('#webgl-container');
    let holdListMenuPC = $('#hold-list-container-pc');
    let holdListMenuMobile = $('#hold-list-container-mobile');

    holdListMenuPC.hide();
    holdListMenuMobile.hide();

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
        const methodName = `loadTestModel${hPk}`;
        if (typeof app[methodName] === 'function') {
            console.log(methodName);
            app[methodName]();
        } else {
            console.error(`Method ${methodName} 존재하지 않는 메서드.`);
        }
    });
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
        this._positionData = null;
        this._rotationData = null;
        this._positionDataJSON = null;
        this._cube1 = null;
        this._cube2 = null;
        this._cube3 = null;
        this._draggableObjects = [];
        this._dragControls = null;
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

    loadTestModel1() {
        // loadTestModel(this, '/resources/holds/volume/volume01.glb', 'modelGroup3', { x: 0, y: 1.5, z: 0.05 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: Math.PI });
        // loadTestModel(this, '/resources/holds/volume/volume01.glb', 'modelGroup3', { x: 0, y: 1, z: 0.05 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: Math.PI });
        loadTestModel(this, '/resources/holds/hold01.glb', 'modelGroup3', {x: 0, y: 1, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
    }

    loadTestModel2() {
        loadTestModel(this, '/resources/holds/hold02.glb', 'modelGroup4', {x: 0, y: 1.5, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
    }

    loadTestModel3() {
        // loadTestModel(this, '/resources/holds/volume/volume03.glb', 'modelGroup5', { x: 0, y: 1.2, z: 0.05 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: Math.PI });
        loadTestModel(this, '/resources/holds/hold03.glb', 'modelGroup5', {x: 0, y: 1.2, z: 0.07}, {
            x: 0.001,
            y: 0.001,
            z: 0.001
        }, {x: 0, y: 0, z: 0});
        // loadTestModel(this, '/resources/holds/volume/volume03.glb', 'modelGroup5', { x: 2, y: 1, z: 0 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: 0 });
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
function loadTestModel(app, modelPath, groupName, position, scale, rotation) {
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

        // 드래그 시작 시 객체를 투명하게 설정
        const object = event.object;
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
    });

    app._dragControls.addEventListener('drag', function (event) {
        handleDrag(event.object);
    });

    app._dragControls.addEventListener('dragend', function (event) {
        app._controls.enabled = true;

        // 드래그 종료 시 객체를 불투명하게 설정
        const object = event.object;
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.opacity = child.userData.originalOpacity;
                child.material.transparent = child.userData.originalTransparent;
            }
        });

        // 새로운 위치로 positionData를 업데이트
        app._positionData = {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z
        };

        app._rotationData = {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z
        }

        // 업데이트된 위치 데이터를 로그로 출력
        logModelInfo(object.name, app._positionData, app._rotationData, object);

    });
}

// 모델 정보
function logModelInfo(name, positionData, rotationData, object) {
    // console.log(`Model Name: ${name}`);
    console.log(`Position - X: ${positionData.x}, Y: ${positionData.y}, Z: ${positionData.z}`);
    console.log(`로테이션 - Z: ${rotationData.z}`);
}

function handleDrag(object) {
    // 객체의 위치 제한 (지정된 범위 내에서만 이동 가능)
    const minX = -1700;
    const maxX = 2000;
    const minZ = -1600;
    const maxZ = 2400;
    const minY = -3500;
    const maxY = -200;

    // object.rotation.z 값에 따라 다른 이동 제한 조건 적용
    if (object.rotation.z === 0) {
        // x, z 축 범위 내에서만 이동 가능하도록 설정
        object.position.x = Math.max(minX, Math.min(maxX, object.position.x));
        object.position.z = Math.max(minZ, Math.min(maxZ, object.position.z));

        // y 축 이동 제한 (사실 z축인 셈)
        object.position.y = 0; // y 축 위치를 0으로 고정

        if (object.position.x >= maxX) {
            console.log("닿았다");
            object.rotation.z = -1.6;
        }

    } else if (object.rotation.z === -1.6) {
        // y 축 범위 내에서만 이동 가능하도록 설정
        object.position.y = Math.max(minY, Math.min(maxY, object.position.y));
        object.position.z = Math.max(minZ, Math.min(maxZ, object.position.z));

        // x 축 고정값 설정
        object.position.x = 2000;

        // cube2 왼쪽 끝에 닿으면 다시 회전
        if (object.position.y >= -200){
            console.log("다시 닿았다")
            object.rotation.z = 0;
        }
    }
}

// handleDrag 함수에서 모델의 위치가 maxX 범위에 도달했을 때 rotateObject 함수를 호출하여 회전시키도록

let app;
window.onload = function () {
    app = new App();
    app.initialize();
};
