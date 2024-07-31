import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// Renderer : 출력장치에 출력할 수 있는 장치
// Camera : 시점 정의
// Scene : Light와 3차원 모델인 Mexh로 구성됨
// Light : 3차원 형상이 화면 상에 표시되기 위해서는 광원이 필요함. 그래서 light가 필요
// Mesh : Object3D의 패성 클래스. 형상 등을 정의하는 Geometry 와
// 색상 및 투명도 등을 정의하는 Mererial로 정의됨.

// three js 예제에서 사용하던 0xff0000 형식은 16진수 형식의 색상코드.
// rgb 컬러 세팅을 위한 function
// 예제: RGB(0, 255, 0)을 16진수로 변환하여 색상 설정

$(document).ready(function (){
    const holdBtn = $('.hold-list-open-btn');
    const webglContainer = $('#webgl-container');
    let holdListMenuPC = $('#hold-list-container-pc');
    let holdListMenuMobile = $('#hold-list-container-mobile');

    function checkWidth() {
        // 모바일
        if ($(window).width() <= 768) {
            holdBtn.click(function (){
                if (holdListMenuMobile.hasClass('list-hidden-mobile')) {
                    holdListMenuMobile.removeClass('list-hidden-mobile').addClass('list-visible-mobile').animate({ bottom: '0' }, 500);
                    webglContainer.animate({height: '65%'}, 500);
                } else {
                    holdListMenuMobile.animate({ bottom: '-100%' }, 500, function() {
                        holdListMenuMobile.removeClass('list-visible-mobile').addClass('list-hidden-mobile');
                        webglContainer.animate({height: '100%'}, 500);
                    });
                }
            });
        }
        // PC
        else {
            holdBtn.click(function (){
                if (holdListMenuPC.hasClass('list-hidden-pc')) {
                    holdListMenuPC.removeClass('list-hidden-pc').addClass('list-visible-pc').animate({ left: '0' }, 500);
                    webglContainer.animate({width: '75%'}, 500);
                } else {
                    holdListMenuPC.animate({ left: '-100%' }, 500, function() {
                        holdListMenuPC.removeClass('list-visible-pc').addClass('list-hidden-pc');
                        webglContainer.animate({width: '100%'}, 500);
                    });
                }
            });
        }
    }

    // 페이지 로드 시 처음 확인
    checkWidth();

    // 창 크기 변경 시마다 확인
    $(window).resize(checkWidth);

});


// Three.js

// Three.js를 사용하여 기존에 만든 방 모양 3D 씬에 새로운 3D 모델링 파일을 추가하려면,
// Three.js의 GLTFLoader 또는 OBJLoader 등을 사용하여 3D 모델을 로드할 수 있습니다.

function rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
}
let rgbColor = rgbToHex();

// 텍스쳐 사용
const textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load();

class App {
    constructor() {
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

        // 창 크기 변경 시 발생되는 이벤트. renderer나 camera는 창 크기가 변경될 때 속성을 재 정의 해줘야 함
        // bind를 사용하는 이유는 this가 가르키는 객체가 이벤트 객체가 아닌 App 클래스 객체가 되기 위함
        window.onresize = this.resize.bind(this);
        this.resize();
        // render method는 실제로 3차원 그래픽 장면을 만들어주는 method.
        // bind를 통해 넘겨주는 이유는, 이 안의 this가 이 App 클래스 객체를 가르키게 하기 위함
        requestAnimationFrame(this.render.bind(this));
    }

    // 마우스로 카메라 조정
    _setupControls() {
        const controls = new OrbitControls(this._camera, this._divContainer);
        // 수직 회전 각도 범위 설정 (폴라 앵글)
        controls.minPolarAngle = -Math.PI / 2; // 위로 90도
        controls.maxPolarAngle = Math.PI / 2; // 밑으로 90도

        // 수평 회전 각도 범위 설정 (방위 앵글)
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
        // 3차원 그래픽을 출력 할 영역에 대한 가로, 세로 크기를 얻어옴
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        // 얻어온 크기로 카메라 생성
        //(시야각(일반적으로 50~75가 사람 시야각과 비슷함), width
        // / height, 0.1, 100)
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        // 카메라 거리
        // 디바이스 width 1000보다 작으면 10으로, 크면 7로
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight() {
        rgbColor = rgbToHex(255, 255, 255);
        const intensity = 1;
        // 빛 생성
        // const light = new THREE.DirectionalLight(rgbColor, intensity);
        // // 기본(예제) (-1, 2, 4)// (-좌 +우, +위 -하, +앞 -뒤)
        // light.position.set(-3, 5, 4);
        // // scene 객체의 구성 요소로 추가
        // this._scene.add(light);

        const directionalLight = new THREE.DirectionalLight(rgbColor, intensity);
        directionalLight.position.set(-3, 5, 4);
        this._scene.add(directionalLight);

        // Ambient Light 추가
        const ambientLight = new THREE.AmbientLight(rgbColor, 1.5);
        this._scene.add(ambientLight);

        // 추가 조명 설정 (형광등같은 역할)
        // rgbColor = rgbToHex(0, 255, 0);
        const pointLight = new THREE.PointLight(rgbColor, 50);
        pointLight.position.set(0, 5, 5);
        this._scene.add(pointLight);
    }

    _setupModel() {
        rgbColor = rgbToHex(240, 240, 240);
        texture = textureLoader.load('/resources/img/texture01.png');
        // 첫 번째 큐브
        // 가로, 높이, 세로
        const geometry = new THREE.BoxGeometry(4, 3.3, 0.1);
        // MeshStandardMaterial을 사용하여 재질 생성, 텍스처 적용
        const fillMaterial = new THREE.MeshPhongMaterial({
            color: rgbColor,
            map: texture,
        });
        const cube = new THREE.Mesh(geometry, fillMaterial);
        const group = new THREE.Group();
        group.add(cube);
        // group.add(line);

        // 두 번째 큐브
        const geometry2 = new THREE.BoxGeometry(4, 3.3, 0.1);
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
        group.position.set(0, 0.4, 0); // 기본자리
        group2.position.set(2.05, 0.4, 1.95);
        group3.position.set(0, -1.1, 2);

        // 큐브 회전 설정
        //		group.rotation.x = Math.PI / 4; // 첫 번째 큐브를 x축 기준으로 45도 회전
        //		group.rotation.y = Math.PI / 4; // 첫 번째 큐브를 y축 기준으로 45도 회전

        //		group2.rotation.x = Math.PI / 6; // 두 번째 큐브를 x축 기준으로 30도 회전
        group2.rotation.y = Math.PI / 2; // 두 번째 큐브를 y축 기준으로 90도 회전
        group3.rotation.x = Math.PI / 2;

        // scene에 세팅
        this._scene.add(group);
        this._scene.add(group2);
        this._scene.add(group3);

        // 필요에 따라 첫 번째 큐브를 참조할 수 있도록 설정
        this._cube1 = group;
        this._cube2 = group2;
        this._cube3 = group3;

        // 모델 로드
        this._loadTestModel();
    }


    _loadTestModel() {
        const loader = new GLTFLoader();
        loader.load(
            '/resources/holds/scene.gltf', // 여기에 3D 모델 파일의 경로를 지정
            (gltf) => {
                const model = gltf.scene;
                this._gltfModel = model; // 로드된 GLTF 모델을 변수에 저장
                model.position.set(1, 2, 2); // 모델의 위치 조정
                this._scene.add(model);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001;
    }
}

window.onload = function () {
    new App();
};