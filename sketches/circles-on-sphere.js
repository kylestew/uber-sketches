// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require("glslify");

const settings = {
    // Make the loop animated
    animate: true,
    // Get a WebGL canvas rather than 2D
    context: "webgl",
};

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    // WebGL background color
    renderer.setClearColor("#fff", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(2, 2, -3);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // Setup a geometry
    const geometry = new THREE.SphereGeometry(1, 32, 16);

    // sample icosohedron positions to place disks
    const icoGeom = new THREE.IcosahedronGeometry(1, 1);
    const positions = icoGeom.attributes.position;
    const verts = Array.from({ length: positions.count }, (_, idx) =>
        new THREE.Vector3().fromBufferAttribute(positions, idx)
    );

    const circleGeom = new THREE.CircleGeometry(1, 32);
    verts.forEach((pt) => {
        const mesh = new THREE.Mesh(
            circleGeom,
            new THREE.MeshBasicMaterial({
                color: "black",
                // wireframe: true,
                side: THREE.DoubleSide,
            })
        );
        mesh.position.copy(pt);
        mesh.scale.setScalar(0.25 * Math.random());
        mesh.lookAt(new THREE.Vector3());
        scene.add(mesh);
    });

    const vertShader = /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `;

    const fragShader = glsl(/* glsl */ `
    #pragma glslify: noise = require('glsl-noise/simplex/3d');

    varying vec2 vUv;
    uniform vec3 color;
    uniform float time;

    void main() {
        gl_FragColor = vec4(color, 1.);
    }
    `);

    // Setup a material
    const material = new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        uniforms: {
            time: { value: 0 },
            color: {
                value: new THREE.Color("tomato"),
            },
        },
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
            material.uniforms.time.value = time;

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
