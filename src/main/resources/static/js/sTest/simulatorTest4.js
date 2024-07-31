import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

$(document).ready(function (){
    const holdBtn = $('.hold-list-open-btn');
    const webglContainer = $('#webgl-container');
    let holdListMenuPC = $('#hold-list-container-pc');
    let holdListMenuMobile = $('#hold-list-container-mobile');

    function checkWidth() {
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

function rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
}
let rgbColor = rgbToHex();

const textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load();

document.addEventListener('DOMContentLoaded', function () {
    const holdImgs = document.querySelectorAll('.hold-img');
    holdImgs.forEach(function (holdImg) {
        holdImg.addEventListener('click', function () {
            const hPk = this.getAttribute('data-hPk');
            const methodName = `_loadTestModel${hPk}`;
            if (typeof app[methodName] === 'function') {
                app[methodName]();
            } else {
                console.error(`Method ${methodName} does not exist on app`);
            }
        });
    });
});

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;
        rgbColor = rgbToHex(226, 240, 215);
        scene.background = new THREE.Color(rgbColor);

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        const controls = new OrbitControls(this._camera, this._divContainer);
        controls.minPolarAngle = -Math.PI / 2; // 위로 90도
        controls.maxPolarAngle = Math.PI / 2; // 밑으로 90도
        controls.minAzimuthAngle = -Math.PI / 2; // 왼쪽 -90도
        controls.maxAzimuthAngle = Math.PI / 4; // 오른쪽 45도
        controls.screenSpacePanning = false; // 팬닝 시 카메라가 위/아래로 이동하지 않도록 설정
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

        controls.maxDistance = 15; // 카메라가 이동할 수 있는 최대 거리
        this._controls = controls;
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight() {
        rgbColor = rgbToHex(255, 255, 255);
        const intensity = 1;
        const directionalLight = new THREE.DirectionalLight(rgbColor, intensity);
        directionalLight.position.set(-3, 4.7, 4);
        this._scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(rgbColor, 1.5);
        this._scene.add(ambientLight);

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
                this._scene.add(model);
                console.log("부르기 성공");
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
                this._scene.add(model);
                console.log("부르기 성공");
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
    window.app = new App();
};