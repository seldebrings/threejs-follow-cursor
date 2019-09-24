// add styles
// three.js
import * as THREE from 'three';
import { TweenMax } from 'gsap';




// create the scene
let scene = new THREE.Scene()

// create the camera
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 1000);

camera.position.z = 100;
camera.position.y = 10;

// create the renderer
let renderer = new THREE.WebGLRenderer()

// create eyeball textures
THREE.ImageUtils.crossOrigin = '*';


let wrapper: THREE.Object3D = new THREE.Object3D;

let textureloader = new THREE.TextureLoader();




const normalEye = textureloader.load( 'https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/Eye_N.jpg' );
const normal = textureloader.load( 'https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/Eye_D2.jpg' );

// set size
renderer.setSize(window.innerWidth, window.innerHeight)

// add canvas to dom
document.body.appendChild(renderer.domElement)


// add lights
let light = new THREE.DirectionalLight(0xffffff, 1.0)

light.position.set(100, 100, 100)

scene.add(light)

let light2 = new THREE.DirectionalLight(0xffffff, 1.0)

light2.position.set(-100, 100, -100)

scene.add(light2)


// declare our eyes etc!
let right_eye: THREE.Mesh;
let left_eye: THREE.Mesh;
let skull: THREE.Mesh;
let jaw: THREE.Mesh

let timer;

const loader: THREE.BufferGeometryLoader = new THREE.BufferGeometryLoader();

loader.load(
    'https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/head.json',
    function ( geometry ) {

        var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
        skull = new THREE.Mesh( geometry, material );
        wrapper.add( skull );
    }
)
loader.load(
    'https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/jaw.json',
    function ( geometry ) {

        var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );

        /*Reposition axis for jaw*/
        geometry.computeBoundingBox();
        const geodepth =  geometry.boundingBox.max.z -geometry.boundingBox.min.z;

        jaw = new THREE.Mesh( geometry, material );
        jaw.geometry.translate( 0, 0, geodepth/2 );
        jaw.position.z = -geodepth/2;

        wrapper.add( jaw );
    }
);

loader.load(
    // resource URL
    'https://s3-us-west-2.amazonaws.com/interaktiv-codepen-assets/eyeball.json',
    // Function when resource is loaded
    function ( geometry ) {

        geometry.center();

        const mat = new THREE.MeshPhongMaterial({
            map: normal,
            color: 0xf2f2f2,
            normalMap: normalEye,
            specular: 0xffffff,
            shininess: 100
        })
        left_eye = new THREE.Mesh( geometry, mat );


        left_eye.position.x = -5.2;
        left_eye.position.y =  3.4;
        left_eye.position.z =  1.65;

        wrapper.add( left_eye );

        right_eye = new THREE.Mesh( geometry, mat );
        right_eye.position.x =  5.2;
        right_eye.position.y = 3.4;
        right_eye.position.z =  1.65;
        wrapper.add( right_eye );
    }
);

// Add wrapper object to stage
scene.add(wrapper);

// Add a hidden plane for Raycaster to register mouse cords
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
const  material = new THREE.MeshBasicMaterial({color: 0xFF0000, visible: false });
const hiddenPlane = new THREE.Mesh(planeGeometry, material);

//position beetween camera and eyes
hiddenPlane.position.set(0,0,50);

scene.add(hiddenPlane);

//Declare mouse 2d position
let mouse = new THREE.Vector2(0,0);

//Declare 3d post to follow
let point = new THREE.Vector3(0,0,0);

const raycaster = new THREE.Raycaster();

camera.lookAt(scene.position)

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener( 'resize', onWindowResize, false )


this.timer = setTimeout(() => skullBite(), 5000);


function skullBite(){

    // get snapshot of current mouse postion
    let target = new THREE.Vector3();
    target.copy(point);

    TweenMax.to( jaw.rotation , .2, {x: 0.5});
    TweenMax.to( jaw.rotation , .1, {x: 0, delay: .2});
    TweenMax.to( wrapper.position , .2, {x: target.x, y:target.y, z:target.z,repeat: 1, yoyo:true});

    let randomDelay = 2000 + Math.ceil( Math.random() * 10000 );
    timer = setTimeout(() => skullBite(), randomDelay);
}

function onMouseMove(event) {


    // Update the mouse variable
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(hiddenPlane);

    if ( intersects.length > 0 )
    {
        point = intersects[0].point;

    }
};

function onWindowResize() {


    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}




function animate(): void {
	requestAnimationFrame(animate)
	render()
}

function render(): void {


    if(right_eye && left_eye){

        right_eye.lookAt( point );
        left_eye.lookAt( point);
        wrapper.lookAt( point);

    }


	renderer.render(scene, camera)
}


animate();
