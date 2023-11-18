global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
    animate: true,
    context: "webgl",
};

class Square {
    constructor() {
        this.width = 1;
        this.height = 1;
        this.w = 1;
        this.h = 1;
    }
}

const squares = [];

const centerTrans = new THREE.Matrix4().makeTranslation(0.5, 0.5, 0.1, 36, 1);
const boxGeo = new THREE.BoxGeometry(1, 1, 0.1);
boxGeo.applyMatrix4(centerTrans);

const sketch = ({ context }) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    // WebGL background color
    renderer.setClearColor("#fff", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, 3);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    const scene = new THREE.Scene();

    // // Setup a geometry
    // const geometry = new THREE.SphereGeometry(1, 32, 16);

    // // Setup a material
    // const material = new THREE.MeshBasicMaterial({
    //   color: "red",
    //   wireframe: true
    // });

    // Setup a mesh with geometry + material
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    return {
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        render({ time }) {
            controls.update();
            renderer.render(scene, camera);
        },
        unload() {
            controls.dispose();
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);
