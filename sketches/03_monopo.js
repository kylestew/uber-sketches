global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const glsl = require("glslify");

const settings = {
    animate: true,
    context: "webgl",
};

const vertShader = glsl(/* glsl */ `
uniform float time;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`);

const fragShader = glsl(/* glsl */ `
#pragma glslify: noise = require(glsl-noise/simplex/3d)

uniform float time;

varying vec2 vUv;
varying vec3 vPosition;

float lines(vec2 uv, float offset) {
    return smoothstep(
        0., 0.5 + offset * 0.5, 
        abs(0.5 * (sin(uv.x * 10.) + offset * 2.))
    );
}

mat2 rotate2D(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}

void main() {
    vec3 baseFirst = vec3(120./255., 158./255., 113./255.);
    vec3 accent = vec3(0., 0., 0.);
    vec3 baseSecond = vec3(224./255., 148./255., 66./255.);

    float n = noise(vPosition + time * 0.333);
    vec2 baseUV = rotate2D(n) * vPosition.xy * 0.333;

    float basePattern = lines(baseUV, 0.5);
    float secondPattern = lines(baseUV, 0.1);

    vec3 baseColor = mix(baseSecond, baseFirst, basePattern);
    vec3 secondBaseColor = mix(baseColor, accent, secondPattern);

    gl_FragColor = vec4(secondBaseColor, 1.0);
}
`);

const sketch = ({ context }) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });
    // renderer.outputEncoding

    renderer.setClearColor("#fff", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, 1.3);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // Setup a geometry
    const geometry = new THREE.SphereBufferGeometry(1.5, 32, 32);

    // Setup a material
    const material = new THREE.ShaderMaterial({
        extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable",
        },
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
        },
        // wireframe: true,
        vertexShader: vertShader,
        fragmentShader: fragShader,
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
            mesh.material.uniforms.time.value = time;

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
