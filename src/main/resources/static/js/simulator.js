import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

$(document).ready(function (){
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
                    holdListMenuMobile.removeClass('list-hidden-mobile').addClass('list-visible-mobile').animate({ bottom: '0' }, 500, function() {
                    });
                } else {
                    holdListMenuMobile.animate({ bottom: '-100%' }, 500, function() {
                        holdListMenuMobile.removeClass('list-visible-mobile').addClass('list-hidden-mobile').css('display', 'none');
                    });
                }
            });
        } else {
            holdBtn.on('click', function () {
                if (holdListMenuPC.hasClass('list-hidden-pc')) {
                    holdListMenuPC.css('display', 'flex');
                    holdListMenuPC.removeClass('list-hidden-pc').addClass('list-visible-pc').animate({ left: '0' }, 500, function() {
                    });
                } else {
                    holdListMenuPC.animate({ left: '-100%' }, 500, function() {
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
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._scene = new THREE.Scene();
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2();
        this._camera = new THREE.PerspectiveCamera();
        this._controls = null;
        this._positionData = null;
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
        loadTestModel(this, '/resources/holds/pinch/pinch01.glb', 'modelGroup1', { x: 1, y: 1, z: 2 }, { x: 1, y: 1, z: 1 }, { x: Math.PI, y: 0, z: 0 });
    }

    loadTestModel2() {
        loadTestModel(this, '/resources/holds/jug/jug01.glb', 'modelGroup2', { x: 0, y: 1, z: 2 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: Math.PI / 2, y: 0, z: 0 });
    }

    loadTestModel3() {
        loadTestModel(this, '/resources/holds/volume/volume01.glb', 'modelGroup3', { x: 1, y: 2, z: 2 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: Math.PI });
    }

    loadTestModel4() {
        loadTestModel(this, '/resources/holds/volume/volume02.glb', 'modelGroup4', { x: 0, y: 2, z: 1 }, { x: 0.001, y: 0.001, z: 0.001 }, { x: 0, y: 0, z: 0 });
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

    app.resize();

    window.onresize = () => app.resize();
    window.addEventListener('click', (event) => onMouseClick(app, event), false);

    requestAnimationFrame((time) => app.render(time));

    console.log('width',window.innerWidth);
    console.log('height', window.innerHeight);

}

function resize(app) {
    const width = app._divContainer.clientWidth;
    const height = app._divContainer.clientHeight;
    console.log('자식 width',width);
    console.log('자식 height',height);
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

            setupDragControls(app);
        },

        undefined,
        (error) => {
            console.error(error);
        }
    );
}

function onMouseClick(app, event) {
    event.preventDefault();
    setMouseCoordinates(app, event);
    const intersects = getIntersects(app);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const parentGroupName = getClickedObject(clickedObject).name;

        if (isModelGroup(parentGroupName)) {
            console.log(app._positionData);
            logModelInfo(parentGroupName, app._positionData, clickedObject);
            toggleTransparency(clickedObject);
        }
    }
}

function setMouseCoordinates(app, event) {
    const rect = app._divContainer.getBoundingClientRect();
    app._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    app._mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function getIntersects(app) {
    app._raycaster.setFromCamera(app._mouse, app._camera);
    return app._raycaster.intersectObjects(app._scene.children, true);
}

function getClickedObject(object) {
    while (object.parent && object.parent.type !== 'Scene') {
        object = object.parent;
    }
    return object;
}

function isModelGroup(name) {
    return name.includes('modelGroup');
}

function logModelInfo(name, positionData, object) {
}

function toggleTransparency(object) {
    const modelGroup = getClickedObject(object);

    modelGroup.traverse((child) => {
        if (child.isMesh) {
            if (child.userData.isTransparent) {
                setOpaque(child);
            } else {
                setTransparent(child);
            }
        }
    });
}

function setOpaque(mesh) {
    mesh.material.opacity = mesh.userData.originalOpacity;
    mesh.material.transparent = mesh.userData.originalTransparent;
    mesh.userData.isTransparent = false;
}

function setTransparent(mesh) {
    if (!mesh.userData.hasOwnProperty('originalOpacity')) {
        mesh.userData.originalOpacity = mesh.material.opacity;
        mesh.userData.originalTransparent = mesh.material.transparent;
    }
    mesh.material.opacity = 0.3;
    mesh.material.transparent = true;
    mesh.userData.isTransparent = true;
}

function setupDragControls(app) {
    if (app._dragControls) {
        app._dragControls.dispose();
    }

    app._dragControls = new DragControls(app._draggableObjects, app._camera, app._renderer.domElement);
    app._dragControls.addEventListener('dragstart', function (event) {
        app._controls.enabled = false;
    });

    app._dragControls.addEventListener('dragend', function (event) {
        app._controls.enabled = true;
    });
}

let app;
window.onload = function () {
    app = new App();
    app.initialize();
};
