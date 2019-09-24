
// create the scene
var scene = new THREE.Scene();
// create the camera
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 1000);
camera.position.z = 100;
camera.position.y = 10;
// create the renderer

/*var container = document.getElementById( "container" );
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);*/

container = document.getElementById( 'overlay2' );
document.body.appendChild( container );

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement )

/*var renderer = new THREE.WebGLRenderer( { canvas: container, antialias: true }  );*/
/*renderer.setSize(container.style.width, container.style.height);*/
// add canvas to dom
/*container.appendChild(renderer.domElement);*/

// create eyeball textures
THREE.ImageUtils.crossOrigin = '*';
var wrapper = new THREE.Object3D;
var textureloader = new THREE.TextureLoader();
var normalEye = textureloader.load('https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/Eye_N.jpg');
var normal = textureloader.load('https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/Eye_D2.jpg');
// set size

// add lights
var light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(100, 100, 100);
scene.add(light);
var light2 = new THREE.DirectionalLight(0xffffff, 1.0);
light2.position.set(-100, 100, -100);
scene.add(light2);
// declare our eyes etc!
var right_eye;
var left_eye;
var skull;
var jaw;
var timer;
var loader = new THREE.BufferGeometryLoader();
loader.load('https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/head.json', function (geometry) {
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    skull = new THREE.Mesh(geometry, material);
    wrapper.add(skull);
});
loader.load('https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/jaw.json', function (geometry) {
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    /*Reposition axis for jaw*/
    geometry.computeBoundingBox();
    var geodepth = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
    jaw = new THREE.Mesh(geometry, material);
    jaw.geometry.translate(0, 0, geodepth / 2);
    jaw.position.z = -geodepth / 2;
    wrapper.add(jaw);
});
loader.load(
// resource URL
'https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/eyeball.json', 
// Function when resource is loaded
function (geometry) {
    geometry.center();
    var mat = new THREE.MeshPhongMaterial({
        map: normal,
        color: 0xf2f2f2,
        normalMap: normalEye,
        specular: 0xffffff,
        shininess: 100
    });
    left_eye = new THREE.Mesh(geometry, mat);
    left_eye.position.x = -5.2;
    left_eye.position.y = 3.4;
    left_eye.position.z = 1.65;
    wrapper.add(left_eye);
    right_eye = new THREE.Mesh(geometry, mat);
    right_eye.position.x = 5.2;
    right_eye.position.y = 3.4;
    right_eye.position.z = 1.65;
    wrapper.add(right_eye);
});
// Add wrapper object to stage
scene.add(wrapper);
// Add a hidden plane for Raycaster to register mouse cords
var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var material = new THREE.MeshBasicMaterial({ color: 0xFF0000, visible: false });
var hiddenPlane = new THREE.Mesh(planeGeometry, material);
//position beetween camera and eyes
hiddenPlane.position.set(0, 0, 50);
scene.add(hiddenPlane);
//Declare mouse 2d position
var mouse = new THREE.Vector2(0, 0);
//Declare 3d post to follow
var point = new THREE.Vector3(0, 0, 0);
var raycaster = new THREE.Raycaster();
camera.lookAt(scene.position);

window.addEventListener('resize', onWindowResize, false);



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    render();
}
function render() {
/*    if (right_eye && left_eye) {
        right_eye.lookAt(point);
        left_eye.lookAt(point);
        wrapper.lookAt(point);
    }*/
    renderer.render(scene, camera);
}
animate();
