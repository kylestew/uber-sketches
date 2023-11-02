const canvasSketch = require("canvas-sketch");
const glsl = require("glslify");

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const settings = {
    animate: true,
    context: "webgl",
};

const sketch = ({ context }) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });
    // renderer.outputEncoding

    // WebGL background color
    renderer.setClearColor("#000", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, 1.3);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // Setup a geometry
    const geometry = new THREE.SphereBufferGeometry(5, 32, 32);

    // Setup a material
    const material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // draw each frame
    return {
        // Handle resize events here
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render({ time }) {
            controls.update();
            renderer.render(scene, camera);
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            controls.dispose();
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);
