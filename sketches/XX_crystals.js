global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

https://github.com/spite/codevember-2021/tree/main/7

const settings = {
    animate: true,
    context: "webgl",
};

class Stone extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial();

        super(geometry, material);

        this.material = material;
    }
}

const stone = new Stone();
// scene.add(stone);
// stone.rotation.set(-Math.PI / 6, 0, 0);

/*
const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(1, 1, 1).multiplyScalar(4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: true
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

  //       const t = performance.now();
  // if (spin && t - lastGenTime > 5000) {
  //   randomize();
  //   lastGenTime = t;
  // }
  // const dt = t - prevTime;
  // prevTime = t;
  // if (spin) {
  //   stone.rotation.y += dt / 1000;
  // }
  // post.render(stone, scene, camera);
  // renderer.setAnimationLoop(render);

    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
*/
