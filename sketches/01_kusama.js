global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const Random = require("canvas-sketch-util/random");
const packSpheres = require("pack-spheres");
const glslify = require("glslify");
const risoColors = require("riso-colors").map((h) => h.hex);
const paperColors = require("paper-colors").map((h) => h.hex);

const settings = {
    animate: true,
    dimensions: [1080, 1920],
    scaleToView: true,
    duration: 12,
    context: "webgl",
};

// const vertShader = /* glsl */ `
// varying vec2 vUv;
// varying vec3 vPosition;

// void main() {
//   vUv = uv;
//   vPosition = position;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
// }
// `;

// const fragShader = glsl(/* glsl */ `
// #pragma glslify: noise = require('glsl-noise/simplex/3d');
// #pragma glslify: aastep = require('glsl-aastep');

// uniform vec3 primaryColor;
// uniform vec3 secondaryColor;
// uniform float time;
// uniform vec4 points[POINT_COUNT];

// varying vec2 vUv;
// varying vec3 vPosition;

// uniform mat4 modelMatrix;

// float sphereRim(vec3 spherePosition) {
//     vec3 normal = normalize(spherePosition.xyz);
//     vec3 worldNormal = normalize(mat3(modelMatrix) * normal.xyz);
//     vec3 worldPosition = (modelMatrix * vec4(spherePosition, 1.0)).xyz;
//     vec3 V = normalize(cameraPosition - worldPosition);
//     float rim = 1.0 - max(dot(V, worldNormal), 0.0);
//     return pow(smoothstep(0.0, 1.0, rim), 0.5);
// }

// void main() {
//     float dist = 10000.0;
//     float rad = 0.0;

//     // find our closest point
//     for (int i = 0; i < POINT_COUNT; i++) {
//         vec4 p = points[i];
//         float d = distance(vPosition, p.xyz);
//         if (d < dist) {
//             // new closest pt
//             rad = p.w; // packed in point data
//         }
//         dist = min(d, dist);
//     }

//     float mask = aastep(rad, dist);
//     mask = 1.0 - mask;

//     vec3 color = mix(primaryColor, secondaryColor, mask);
//     float rim = sphereRim(vPosition);
//     color += 0.5 * rim;

//     gl_FragColor = vec4(color, 1.0);
// }
// `);

// const staticSphereGeom = new THREE.SphereGeometry(1, 64, 64);

// function createDottedSphere(primaryColor, secondaryColor) {
//     if (random.range(0, 1) < 0.2) {
//         let swap = primaryColor;
//         primaryColor = secondaryColor;
//         secondaryColor = swap;
//     }

//     // sample icosohedron positions to place disks
//     const icoGeom = new THREE.IcosahedronGeometry(1, 1);
//     const positions = icoGeom.attributes.position;
//     let points = Array.from({ length: positions.count }, (_, idx) =>
//         new THREE.Vector3().fromBufferAttribute(positions, idx)
//     );

//     // add a random radius to each point for use in the shader
//     points = points.map((pt) => new THREE.Vector4(pt.x, pt.y, pt.z, random.range(0.05, 0.25)));

//     // sphere with special material
//     const material = new THREE.ShaderMaterial({
//         defines: {
//             POINT_COUNT: points.length,
//         },
//         extensions: {
//             derivatives: true,
//         },
//         uniforms: {
//             time: { value: 0 },
//             primaryColor: {
//                 value: new THREE.Color(primaryColor.hex),
//             },
//             secondaryColor: {
//                 value: new THREE.Color(secondaryColor.hex),
//             },
//             points: { value: points },
//         },
//         vertexShader: vertShader,
//         fragmentShader: fragShader,
//     });
//     return new THREE.Mesh(staticSphereGeom, material);
// }

const sketch = ({ context }) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    camera.position.set(2, 2, -4);
    camera.lookAt(new THREE.Vector3());
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // setup colors - palette of 2 random colors + 1 paper background
    const palette = Random.shuffle(risoColors).slice(0, 2);
    const backgroundHex = Random.pick(paperColors);
    renderer.setClearColor(backgroundHex, 1);

    // pack spheres
    const bounds = 1.5;
    const spheres = packSpheres({
        sample: () => Random.insideSphere(),
        outside: (position, radius) => {
            return new THREE.Vector3().fromArray(position).length() + radius >= bounds;
        },
        minRadius: () => Math.max(0.05, 0.05 + Math.min(1.0, Math.abs(Random.gaussian(0, 0.1)))),
        maxCount: 20,
        packAttempts: 4000,
        bounds,
        maxRadius: 1.5,
    });
    console.log(spheres.length);
    console.log(spheres[0]);

    // setup the scene
    const scene = new THREE.Scene();

    const geometry = new THREE.IcosahedronBufferGeometry(1, 3);

    const meshes = spheres.map((sphere) => {
        const color0 = Random.pick(palette);

        // TODO: pick the largest and make it a wireframe mat instead of our special shader
        const material = new THREE.MeshBasicMaterial({
            color: color0,
            wireframe: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.fromArray(sphere.position);
        mesh.scale.setScalar(sphere.radius);

        // mesh.quaternion.fromArray(Random.quaternion());
        // mesh.rotationSpeed = Random.gaussian() * 0.1;

        scene.add(mesh);
        return mesh;
    });
    //     const sphereCount = random.rangeFloor(3, 12);
    //     for (let i = 0; i < sphereCount; i++) {
    //         const sphereMesh = createDottedSphere(primaryColor, secondaryColor);

    //         // Randomly scale the sphere. Assuming you want to scale it uniformly,
    //         // you can use the same scale factor for x, y, and z.
    //         const scaleFactor = random.range(0.1, 1); // Adjust the range as needed
    //         sphereMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

    //         // Randomly position the sphere
    //         sphereMesh.position.set(
    //             random.range(-1, 1), // x position
    //             random.range(-1, 1), // y position
    //             random.range(-1, 1) // z position
    //         );

    //         scene.add(sphereMesh);
    //     }

    return {
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        render({ time, playhead }) {
            // scene.rotation.y = playhead * 2.0 * Math.PI;

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
