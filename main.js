import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSG } from 'three-csg-ts';


// Setup scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xFFFFFF );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z=60;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Contorls
const controls = new OrbitControls(camera, renderer.domElement);

// Create cylinder mesh
const geometry = new THREE.CylinderGeometry( 2.5, 2.5, 20, 32 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(0,0,0);

// Create topEndMesh = topEndCylinder - topEndCube{rotated}
// Create topEndCylinder
const topEndCylinderGeometry= new THREE.CylinderGeometry( 2.5, 2.5, 5, 32 );
const topEndCylinderMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
const topEndCylinder = new THREE.Mesh( topEndCylinderGeometry, topEndCylinderMaterial );
topEndCylinder.position.set(0,12.5,0); //topendcylinder height is 5, so position must be half hight plus height of body
scene.add(topEndCylinder);

// Create topEndCube
const topEndCubeGeometry = new THREE.BoxGeometry(Math.sqrt(50), Math.sqrt(50), Math.sqrt(50));
const topEndCubeMaterial = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
const topEndCube = new THREE.Mesh( topEndCubeGeometry, topEndCubeMaterial);
topEndCube.position.set(2.5,15,0); //position on top right of cylinder
topEndCube.rotation.z = (2*Math.PI)-(Math.PI/4); //rotate cube -45 degrees. 
topEndCube.updateMatrix(); //store the rotation
scene.add(topEndCube);

// Perform subtraction
const topEndCylinderCSG = CSG.fromMesh(topEndCylinder, 0);
const topEndCubeCSG = CSG.fromMesh(topEndCube, 1);
const topEndMeshCSG = topEndCylinderCSG.subtract(topEndCubeCSG);
const topEndMesh = CSG.toMesh(topEndMeshCSG, new THREE.Matrix4(), topEndCylinderMaterial);
scene.add(topEndMesh);

topEndMesh.position.set(10,5,0);

const axesHelper = new THREE.AxesHelper( 50 ); 

scene.add(axesHelper, cylinder);


function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render( scene, camera );
}
animate();
