import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


$(document).ready(function (){
    const holdBtn = $('.hold-list-open-btn');
    const webglContainer = $('#webgl-container');
    let holdListMenuPC = $('#hold-list-container-pc');
    let holdListMenuMobile = $('#hold-list-container-mobile');

    holdListMenuPC.hide();
    holdListMenuMobile.hide();

    function checkWidth() {
/*        holdListMenuPC.css('display', 'none');
        holdListMenuMobile.css('display', 'none');*/

        // 모바일
        if ($(window).width() <= 768) {

            holdBtn.click(function (){
                if (holdListMenuMobile.hasClass('list-hidden-mobile')) {
                    holdListMenuMobile.css('display', 'flex'); // 애니메이션 시작 전에 표시
                    holdListMenuMobile.removeClass('list-hidden-mobile').addClass('list-visible-mobile').animate({ bottom: '0' }, 500, function() {
                        webglContainer.animate({height: '65%'}, 500);
                    });
                } else {
                    holdListMenuMobile.animate({ bottom: '-100%' }, 500, function() {
                        holdListMenuMobile.removeClass('list-visible-mobile').addClass('list-hidden-mobile').css('display', 'none'); // 애니메이션 완료 후 숨기기
                        webglContainer.animate({height: '100%'}, 500);
                    });
                }
            });
        }
        // PC
        else {
            holdBtn.click(function (){
                if (holdListMenuPC.hasClass('list-hidden-pc')) {
                    holdListMenuPC.css('display', 'flex'); // 애니메이션 시작 전에 표시
                    holdListMenuPC.removeClass('list-hidden-pc').addClass('list-visible-pc').animate({ left: '0' }, 500, function() {
                        webglContainer.animate({width: '75%'}, 500);
                    });
                } else {
                    webglContainer.animate({width: '100%'}, 500);
                    holdListMenuPC.animate({ left: '-100%' }, 500, function() {
                        holdListMenuPC.removeClass('list-visible-pc').addClass('list-hidden-pc').css('display', 'none'); // 애니메이션 완료 후 숨기기
                    });
                }
            });
        }
    }

    // 페이지 로드 시 처음 확인
    checkWidth();

    // 창 크기 변경 시마다 확인
    $(window).resize(checkWidth);


    $('.hold-img').on('click', function () {
        const hPk = $(this).data('hpk');
        const methodName = `loadTestModel${hPk}`;
        if (typeof app[methodName] === 'function') {
            app[methodName]();
        } else {
            console.error(`Method ${methodName} 이런 메서드는 존재하지 않습니다.`);
        }
    });
});


function rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
}
let rgbColor = rgbToHex();

// 텍스쳐 사용
const textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load();
let positionData;
let positionDataJSON;
let app;

class App {
    constructor() {
        this._selectedObject = null;
        this._isMoving = false;
        this._divContainer = document.querySelector("#webgl-container");
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._scene = new THREE.Scene();
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();
        this._camera = new THREE.PerspectiveCamera();
        this._controls = null;
        this._positionData = null;
        this._cube1 = null;
        this._cube2 = null;
        this._cube3 = null;

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
        loadTestModel(this, '/resources/holds/pinch/pinch01.glb', 'modelGroup1', { x: 1, y: 1, z: 2 }, { x: 1, y: 1, z: 1 }, { x: Math.PI, y: 0, z: 0 });
    }

    loadTestModel2() {
        loadTestModel(this, '/resources/holds/jug/jug01.glb', 'modelGroup2', { x: 0, y: 1, z: 2 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: Math.PI / 2, y: 0, z: 0 });
    }

    loadTestModel3() {
        loadTestModel(this, '/resources/holds/volume/volume01.glb', 'modelGroup3', { x: 1, y: 2, z: 2 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: Math.PI });
    }

    loadTestModel4() {
        loadTestModel(this, '/resources/holds/volume/volume02.glb', 'modelGroup4', { x: 1, y: 1, z: 2 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: 0 });
    }

    loadTestModel5() {
        loadTestModel(this, '/resources/holds/volume/volume03.glb', 'modelGroup5', { x: 1, y: 1, z: 2 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: Math.PI });
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

    window.onresize = () => app.resize();
    app.resize();

    window.addEventListener('click', (event) => onMouseClick(app, event), false);

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
    const fillMaterial3 = new THREE.MeshPhongMaterial({ color: rgbColor });
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

function setupControls(app) {
    const controls = new OrbitControls(app._camera, app._divContainer);
    controls.minPolarAngle = -Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.screenSpacePanning = false;
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

// hold
function loadTestModel(app, modelPath, groupName, position = { x: 1, y: 1, z: 2 }, scale = { x: 0.001, y: 0.001, z: 0.001 }, rotation = { x: 0, y: 0, z: 0 }) {
    const loader = new GLTFLoader();

    loader.load(
        modelPath, // 3D 모델 파일의 경로
        (glb) => {
            const model = glb.scene;
            app._glbModel = model; // 로드된 GLTF 모델을 변수에 저장
            model.position.set(position.x, position.y, position.z); // 모델의 위치 조정
            model.scale.set(scale.x, scale.y, scale.z); // 모델의 스케일 조정
            model.rotation.set(rotation.x, rotation.y, rotation.z); // 모델의 회전 조정

            // 모델 그룹핑
            const modelGroup = new THREE.Group();
            modelGroup.name = groupName; // 그룹 이름 지정
            modelGroup.add(model);

            console.log(modelGroup.name);
            app._scene.add(modelGroup);

            // 포지션 정보를 JSON으로 저장
            app._positionData = {
                x: model.position.x,
                y: model.position.y,
                z: model.position.z
            };
            // JSON 문자열로 변환
            const positionDataJSON = JSON.stringify(app._positionData);
            console.log(positionDataJSON);
        },

        undefined,
        (error) => {
            console.error(error);
        }
    );
}

function onMouseClick(app, event) {
    event.preventDefault();

    app._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    app._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    app._raycaster.setFromCamera(app._mouse, app._camera);
    const intersects = app._raycaster.intersectObjects(app._scene.children, true);

    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;

        while (clickedObject.parent && clickedObject.parent.type !== 'Scene') {
            clickedObject = clickedObject.parent;
        }

        const parentGroupName = clickedObject.name;
        const groupPosition = app._positionData;

        if (parentGroupName.includes('modelGroup')) {
            console.log('모델이름:', parentGroupName);
            console.log('Model position:', groupPosition);
            console.log(clickedObject);

            clickedObject.traverse((child) => {
                if (child.isMesh) {
                    if (child.userData.isTransparent) {
                        child.material.opacity = child.userData.originalOpacity;
                        child.material.transparent = child.userData.originalTransparent;
                        child.userData.isTransparent = false;
                    } else {
                        if (!child.userData.hasOwnProperty('originalOpacity')) {
                            child.userData.originalOpacity = child.material.opacity;
                            child.userData.originalTransparent = child.material.transparent;
                        }
                        child.material.opacity = 0.5;
                        child.material.transparent = true;
                        child.userData.isTransparent = true;
                    }
                }
            });
        }
    }
}

window.onload = function () {
    app = new App();
    app.initialize();
};



