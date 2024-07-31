import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


$(document).ready(function (){
    const holdBtn = $('.hold-list-open-btn');
    const webglContainer = $('#webgl-container');
    let holdListMenuPC = $('#hold-list-container-pc');
    let holdListMenuMobile = $('#hold-list-container-mobile');

    function checkWidth() {
        holdListMenuPC.css('display', 'none');

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
        const methodName = `_loadTestModel${hPk}`;
        if (typeof app[methodName] === 'function') {
            app[methodName]();
        } else {
            console.error(`Method ${methodName} does not exist on app`);
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

class App {
    constructor() {
        this._selectedObject = null;
        this._isMoving = false;
        this.init();
    }

    init(){

        // _은 private와 같다고 보면 됨. 외부호출 X (개발자들간의 약속)
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        // antialias를 활성화 시켜주면 렌더링 시 오브젝트들의 경계선이 계단현상 없이 부드럽게 표현됨
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        // Scene 객체 생성
        const scene = new THREE.Scene();
        this._scene = scene;
        // scece 배경색 설정
        rgbColor = rgbToHex(226, 240, 215);
        scene.background = new THREE.Color(rgbColor);

        // Camera, Light, Module 설정
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        // 카메라 마우스 조정
        this._setupControls();

        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();

        window.onresize = this.resize.bind(this);
        this.resize();

        window.addEventListener('click', this._onMouseClick.bind(this), false);

        requestAnimationFrame(this.render.bind(this));

    }

    // 마우스로 카메라 조정
    _setupControls() {
        const controls = new OrbitControls(this._camera, this._divContainer);
        controls.minPolarAngle = -Math.PI / 2; // 위로 90도
        controls.maxPolarAngle = Math.PI / 2; // 밑으로 90도
        controls.minAzimuthAngle = -Math.PI / 2; // 왼쪽 -90도
        controls.maxAzimuthAngle = Math.PI / 4; // 오른쪽 45도

        // 팬 이동 범위 설정
        controls.screenSpacePanning = false; // 팬닝 시 카메라가 위/아래로 이동하지 않도록 설정
        // 이동할 수 있는 거리 제한
        const maxPan = 2; // 원하는 최대 이동 거리
        const minPan = -2; // 원하는 최소 이동 거리

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

        // 최대 줌 거리 제한
        // controls.minDistance = 2; // 카메라가 이동할 수 있는 최소 거리
        controls.maxDistance = 15; // 카메라가 이동할 수 있는 최대 거리
        this._controls = controls;
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        //(시야각(일반적으로 50~75가 사람 시야각과 비슷함), width
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        // 카메라 거리
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight() {
        rgbColor = rgbToHex(255, 255, 255);
        const intensity = 1;
        const directionalLight = new THREE.DirectionalLight(rgbColor, intensity);
        directionalLight.position.set(-3, 4.7, 4);
        this._scene.add(directionalLight);

        // Ambient Light 추가
        const ambientLight = new THREE.AmbientLight(rgbColor, 1.5);
        this._scene.add(ambientLight);

        // 추가 조명 설정 (형광등같은 역할)
        const pointLight = new THREE.PointLight(rgbColor, 50);
        pointLight.position.set(0, 5, 5);
        this._scene.add(pointLight);
    }

    _setupModel() {
        rgbColor = rgbToHex(240, 240, 240);
        texture = textureLoader.load('/resources/img/texture01.png');
        // 첫 번째 큐브
        const geometry = new THREE.BoxGeometry(4, 4.7, 0.1);
        const fillMaterial = new THREE.MeshPhongMaterial({
            color: rgbColor,
            map: texture,
        });
        const cube = new THREE.Mesh(geometry, fillMaterial);
        const group = new THREE.Group();
        group.add(cube);

        // 두 번째 큐브
        const geometry2 = new THREE.BoxGeometry(4, 4.7, 0.1);
        const fillMaterial2 = new THREE.MeshPhongMaterial({
            color: rgbColor,
            map: texture,
        });
        const cube2 = new THREE.Mesh(geometry2, fillMaterial2);
        const group2 = new THREE.Group();
        group2.add(cube2);

        // 세 번째 큐브
        rgbColor = rgbToHex(170, 170, 170); // gray
        const geometry3 = new THREE.BoxGeometry(4, 3.9, 0.3);
        const fillMaterial3 = new THREE.MeshPhongMaterial({ color: rgbColor });
        const cube3 = new THREE.Mesh(geometry3, fillMaterial3);
        const group3 = new THREE.Group();
        group3.add(cube3);

        // 큐브 위치 조정
        // (+좌 -우, +위 -하, +앞 -뒤)
        group.position.set(0, 1.1, 0); // 기본자리
        group2.position.set(2.05, 1.1, 1.95);
        group3.position.set(0, -1.1, 2);

        // 큐브 회전 설정
        group2.rotation.y = Math.PI / 2; // 두 번째 큐브를 y축 기준으로 90도 회전
        group3.rotation.x = Math.PI / 2;

        // scene에 세팅
        this._scene.add(group);
        this._scene.add(group2);
        this._scene.add(group3);

        group.name = 'cube1';
        group2.name = 'cube2';
        group3.name = 'cube3';

        // 필요에 따라 첫 번째 큐브를 참조할 수 있도록 설정
        this._cube1 = group;
        this._cube2 = group2;
        this._cube3 = group3;

    }

    // pinch01
    _loadTestModel1() {
        const loader = new GLTFLoader();

        loader.load(
            '/resources/holds/pinch/pinch01.glb', // 여기에 3D 모델 파일의 경로를 지정
            (gltf) => {
                const model = gltf.scene;
                this._gltfModel = model; // 로드된 GLTF 모델을 변수에 저장
                model.position.set(1, 1, 2); // 모델의 위치 조정
                model.rotation.x = Math.PI; // 180도 회전

                // 모델 그룹핑
                const modelGroup1 = new THREE.Group();
                modelGroup1.name = 'modelGroup1'; // 그룹 이름 지정
                modelGroup1.add(model);

                console.log(modelGroup1.name);
                this._scene.add(modelGroup1);

                // 포지션 정보를 JSON으로 저장
                this._positionData = {
                    x: model.position.x,
                    y: model.position.y,
                    z: model.position.z
                };
                // JSON 문자열로 변환
                positionDataJSON = JSON.stringify(this._positionData);
                console.log(positionDataJSON);
            },

            undefined,
            (error) => {
                console.error(error);
            }
        );
    }

    // jug01
    _loadTestModel2() {
        const loader = new GLTFLoader();
        rgbColor = rgbToHex(0, 158, 255);
        loader.load(
            '/resources/holds/jug/jug01.glb', // 여기에 3D 모델 파일의 경로를 지정
            (gltf) => {
                const model = gltf.scene;
                this._gltfModel = model; // 로드된 GLTF 모델을 변수에 저장
                model.position.set(0, 1, 2); // 모델의 위치 조정
                model.scale.set(0.001, 0.001, 0.001); // 크기 줄이기
                model.rotation.x = Math.PI / 2; // 회전

                // 모델 그룹핑
                const modelGroup2 = new THREE.Group();
                modelGroup2.name = 'modelGroup2'; // 그룹 이름 지정
                modelGroup2.add(model);

                console.log(modelGroup2.name);
                this._scene.add(modelGroup2);

                // 포지션 정보를 JSON으로 저장
                this._positionData = {
                    x: model.position.x,
                    y: model.position.y,
                    z: model.position.z
                };
                // JSON 문자열로 변환
                positionDataJSON = JSON.stringify(this._positionData);
                console.log(positionDataJSON);

            },

            undefined,
            (error) => {
                console.error(error);
            }
        );
    }
    // volume01
    _loadTestModel3() {
        const loader = new GLTFLoader();

        loader.load(
            '/resources/holds/volume/volume01.glb', // 여기에 3D 모델 파일의 경로를 지정
            (gltf) => {
                const model = gltf.scene;
                this._gltfModel = model; // 로드된 GLTF 모델을 변수에 저장
                model.position.set(1, 2, 2); // 모델의 위치 조정
                model.scale.set(0.001, 0.001, 0.001);
                model.rotation.z = Math.PI;
                // 모델 그룹핑
                const modelGroup3 = new THREE.Group();
                modelGroup3.name = 'modelGroup3'; // 그룹 이름 지정
                modelGroup3.add(model);

                console.log(modelGroup3.name);
                this._scene.add(modelGroup3);

                // 포지션 정보를 JSON으로 저장
                this._positionData = {
                    x: model.position.x,
                    y: model.position.y,
                    z: model.position.z
                };
                // JSON 문자열로 변환
                positionDataJSON = JSON.stringify(this._positionData);
                console.log(positionDataJSON);
            },

            undefined,
            (error) => {
                console.error(error);
            }
        );
    }

    _loadTestModel4() {
        const loader = new GLTFLoader();

        loader.load(
            '/resources/holds/volume/volume02.glb', // 여기에 3D 모델 파일의 경로를 지정
            (gltf) => {
                const model = gltf.scene;
                this._gltfModel = model; // 로드된 GLTF 모델을 변수에 저장
                model.position.set(1, 1, 2); // 모델의 위치 조정
                model.scale.set(0.001, 0.001, 0.001);
                // 모델 그룹핑
                const modelGroup4 = new THREE.Group();
                modelGroup4.name = 'modelGroup4'; // 그룹 이름 지정
                modelGroup4.add(model);

                console.log(modelGroup4.name);
                this._scene.add(modelGroup4);

                // 포지션 정보를 JSON으로 저장
                this._positionData = {
                    x: model.position.x,
                    y: model.position.y,
                    z: model.position.z
                };
                // JSON 문자열로 변환
                positionDataJSON = JSON.stringify(this._positionData);
                console.log(positionDataJSON);
            },

            undefined,
            (error) => {
                console.error(error);
            }
        );
    }

    _loadTestModel5() {
        const loader = new GLTFLoader();

        loader.load(
            '/resources/holds/volume/volume03.glb', // 여기에 3D 모델 파일의 경로를 지정
            (gltf) => {
                const model = gltf.scene;
                this._gltfModel = model; // 로드된 GLTF 모델을 변수에 저장
                model.position.set(1, 1, 2); // 모델의 위치 조정
                model.scale.set(0.001, 0.001, 0.001);
                model.rotation.z = Math.PI;
                // 모델 그룹핑
                const modelGroup5 = new THREE.Group();
                modelGroup5.name = 'modelGroup5'; // 그룹 이름 지정
                modelGroup5.add(model);

                console.log(modelGroup5.name);

                this._scene.add(modelGroup5);

                // 포지션 정보를 JSON으로 저장
                this._positionData = {
                    x: model.position.x,
                    y: model.position.y,
                    z: model.position.z
                };
                // JSON 문자열로 변환
                positionDataJSON = JSON.stringify(this._positionData);
                console.log(positionDataJSON);
            },

            undefined,
            (error) => {
                console.error(error);
            }
        );
    }


    _onMouseClick(event) {
        event.preventDefault();

        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this._raycaster.setFromCamera(this._mouse, this._camera);
        const intersects = this._raycaster.intersectObjects(this._scene.children, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;

            // 최상위 부모를 찾기 위한 루프
            while (clickedObject.parent && clickedObject.parent.type !== 'Scene') {
                clickedObject = clickedObject.parent;
            }

            const parentGroupName = clickedObject.name;
            const groupPosition = this._positionData;

            // parentGroupName에 'modelGroup'이 포함되어 있는지 확인
            if (parentGroupName.includes('modelGroup')) {
                // 클릭한 모델 정보
                console.log('모델이름:', parentGroupName);
                console.log('Model position:', groupPosition);
                console.log(clickedObject);

                clickedObject.traverse((child) => {
                    if (child.isMesh) {
                        // 현재 투명도 상태를 확인
                        if (child.userData.isTransparent) {
                            // 원래 투명도 상태로 복원
                            child.material.opacity = child.userData.originalOpacity;
                            child.material.transparent = child.userData.originalTransparent;
                            child.userData.isTransparent = false;
                        } else {
                            // 투명도로 변경
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

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        requestAnimationFrame(this.render.bind(this));
        this._renderer.render(this._scene, this._camera);
        this.update(time);
    }

    update(time) {
        time *= 0.001;
    }

}

window.onload = function () {
    window.app = new App();
};



