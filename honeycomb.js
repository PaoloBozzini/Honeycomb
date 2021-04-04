import * as THREE from './node_modules/three/build/three.module.js';
import * as TWEEN from './node_modules/@tweenjs/tween.js/dist/tween.esm.js'



let scene, camera, renderer;


let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let honeyComb = new THREE.Group()





init();
animate();

function init() {

      
      //camera and scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.set( 0, 100, 0 );
      camera.lookAt( scene.position );


      //Geometry and material
      const RADIUS = 5;
      const APOTHEM = (RADIUS * (3 ** (1 / 2))) / 2;
      const INITIALPOSITION = 30;
      const GUTTER = 1;
      const XDISTANCE = GUTTER + (APOTHEM * 2);
      const ZDISTANCE = RADIUS + (RADIUS / 2) + (GUTTER * (3 ** (1 / 2)) / 2);


      const geometry1 = new THREE.CircleGeometry(RADIUS, 6);;
      const material1 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
    
      const geometry2 = new THREE.CircleGeometry(RADIUS, 6);;
      const material2 = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
      geometry2.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI ) );
      
      
      geometry1.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI * (3 / 2) ) );
      geometry2.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI * (3 / 2) ) );
      
      geometry1.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI / 2) );
      geometry2.applyMatrix4( new THREE.Matrix4().makeRotationY(( 3 * Math.PI) / 2) );
  
      //Create Hexagons grid 
      const numOfCols = 14;
      const numOfRows = 9;
      let meshFront, meshBack;

      for ( let i = 0; i < numOfCols; i ++ ) {
            for ( let j = 0; j < numOfRows; j ++ ) {

                  meshFront = new THREE.Mesh( geometry1, material1 );
                  meshBack = new THREE.Mesh( geometry2, material2 );
                  

                  if(j % 2 === 0) {
                        meshFront.position.x = INITIALPOSITION - ( XDISTANCE * i );
                        meshBack.position.x = INITIALPOSITION - ( XDISTANCE * i );
                  }

                  if( j % 2 !== 0){
                        meshFront.position.x = INITIALPOSITION - APOTHEM - (GUTTER / 2) - ( XDISTANCE * i );
                        meshBack.position.x = INITIALPOSITION - APOTHEM - (GUTTER / 2) - ( XDISTANCE * i );
                  }
               
                  
                  meshFront.position.y = 0;
                  meshFront.position.z = INITIALPOSITION - ( ZDISTANCE * j );

                  meshBack.position.y = 0;
                  meshBack.position.z = INITIALPOSITION - ( ZDISTANCE * j );


                 
                  let closest;

            /*
            
                
            ____________________________ X    i = column
            |
            |            2   ^   3
            |              /   \  
            |             |     |     
            |          1  |     |  4   
            |              \   /         
            |           6    v     5  
            | 
            | Z   j = row
            
            
            */
                  //Sibilings Objects, (no side number = no sibling)
                  switch(true){
                        case i === 0 && j === 0: 
                              closest = {1: '1-0', 2: '0-1'};
                              break;
                        case i === 0 &&  j !== 0 && j < numOfRows - 1: 
                              if(j % 2 === 0){closest = {1: `1-${j}`, 2: `1-${j + 1}`, 6: `0-${j - 1}`}}
                              if(j % 2 !== 0){closest = {1: `1-${j}`, 2: `1-${j + 1}`, 3 : `0-${j + 1}`, 5: `0-${j - 1}`, 6: `1-${j - 1}`}}
                              break;
                        case i === 0 && j === numOfRows - 1:
                              if(j % 2 === 0){closest = {1: `1-${j}`, 6: `0-${j - 1}`}}
                              if(j % 2 !== 0){closest = {1: `1-${j}`, 5: `0-${j - 1}`, 6: `1-${j - 1}`}}
                              break;
                        case i !== 0 && i < numOfCols - 1 && j === 0:
                              if(j % 2 === 0){closest = {1: `${i + 1}-0`, 2: `${i}-1`, 3: `${i - 1}-1`, 4: `${i - 1}-0`}}
                              if(j % 2 !== 0){closest = {1: `${i + 1}-0`, 2: `${i + 1}-1`, 3: `${i}-1`, 4: `${i - 1}-0`}}
                              break;
                        case i !== 0 && i < numOfCols - 1 && j !== 0 && j < numOfRows - 1:
                              if(j % 2 === 0){closest = {1: `${i + 1}-${j}`, 2: `${i}-${j + 1}`, 3: `${i - 1}-${j + 1}`, 4: `${i - 1}-${j}`, 5: `${i - 1}-${j - 1}`, 6: `${i}-${j - 1}` }}
                              if(j % 2 !== 0){closest = {1: `${i + 1}-${j}`, 2: `${i + 1}-${j + 1}`, 3: `${i}-${j + 1}`, 4: `${i - 1}-${j}`, 5: `${i}-${j - 1}`, 6: `${i + 1}-${j - 1}` }}
                              break;
                        case i !== 0 && i < numOfCols - 1 && j === numOfRows - 1:
                              if(j % 2 === 0){closest = {1: `${i + 1}-${j}`, 4: `${i - 1}-${j}`, 5: `${i - 1}-${j - 1}`, 6: `${i}-${j - 1}`}}
                              if(j % 2 !== 0){closest = {1: `${i + 1}-${j}`, 4: `${i - 1}-${j}`, 5: `${i}-${j - 1}`, 6: `${i + 1}-${j - 1}`}}
                              break;
                        case i === numOfCols - 1 && j === 0:
                              closest = {2: `${i}-${j + 1}`, 3: `${i - 1}-${j + 1}`, 4: `${i - 1}-${j}`};
                              break;
                        case i === numOfCols - 1 && j !== 0 && j < numOfRows - 1:
                              if(j % 2 === 0){closest = {3: `${i}-${j + 1}`, 4: `${i - 1}-${j}`, 5: `${i}-${j - 1}`}}
                              if(j % 2 !== 0){closest = {2: `${i}-${j + 1}`, 3: `${i - 1}-${j + 1}`, 4: `${i - 1}-${j}`, 5: `${i - 1}-${j - 1}`, 6: `${i}-${j - 1}`}}
                              break;
                        case i === numOfCols - 1 && j === numOfRows - 1:
                              if(j % 2 === 0){closest = {4: `${i - 1}-${j}`, 5: `${i - 1}-${j - 1}`, 6: `${i}-${j - 1}`}}
                              if(j % 2 !== 0){closest = {4: `${i - 1}-${j}`, 5: `${i}-${j - 1}`}}
                              break;
                        default: 
                              console.error('Something went wrong')

                  }

                  //Group together meshes
                  const group = new THREE.Group();
                  group.name = `${i}-${j}`
                  group.userData = closest
            
                  group.add( meshFront ); 
                  group.add( meshBack ); 
                  honeyComb.add( group );
            }

      }

      //HoneyComb   
      for(let i = 0; i < honeyComb.children.length; i++) {
            for(const [key, value] of Object.entries(honeyComb.children[i].userData)){
                  const { userData } = honeyComb.children[i];
                  honeyComb.children[i].userData = {...userData, [key]: honeyComb.getObjectByName(value, true )}
            }
      }

      honeyComb.name = 'honeyComb';
      scene.add( honeyComb );
      const box = new THREE.Box3().setFromObject( honeyComb );
      box.getCenter( honeyComb.position ); // this re-sets the honeyComb position
      honeyComb.position.multiplyScalar( - 1 );



      //Light
      // const sun = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
      // sun.position.set( 300, 400, 175 );
      // scene.add( sun );


      //Renderer
      const container = document.createElement( 'div' );
      document.body.appendChild( container );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );

      //Event Listeners
      container.addEventListener( 'click', onMouseClick);
      document.addEventListener( 'mousemove', onMouseMove );
      window.addEventListener( 'resize', onWindowResize );


      // const axesHelper = new THREE.AxesHelper( 100 );
      // scene.add( axesHelper );


}

function onMouseMove( event ) {

      event.preventDefault();
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


function onMouseClick( event ) {

      event.preventDefault();
      raycaster.setFromCamera( mouse, camera );
      const intersects = raycaster.intersectObjects(honeyComb.children, true);

      if (intersects.length > 0) {
            
            const group = intersects[0].object.parent;
            console.log(group);
            dominoEffect(group)()
      }
      
}



function dominoEffect(group, time = 1000) {
      const addedClosests = [group.name];
      
      for (let i = 0; i < group.children.length; i++) {
                 new TWEEN.Tween( group.children[i].rotation ).to( {  x:  Math.PI}, time ).easing(TWEEN.Easing.Quadratic.Out).start()     
      }
      return function loopThroughGroup(siblings = Object.values(group.userData)) {
            
            const closest = [];
            time *= 1.12;
            
            siblings.forEach(meshGroup => {
                  
                  for(const value of Object.values(meshGroup.userData)) {
                      
                        if(addedClosests.includes(value.name)) continue;
            
                        for (let i = 0; i < value.children.length; i++) {
                              new TWEEN.Tween( value.children[i].rotation ).to( {  x:  Math.PI}, time ).easing(TWEEN.Easing.Quadratic.Out).start();
                        }

                        addedClosests.push(value.name);
                        closest.push(value);
                  }
            })
            
           
            if(closest.length > 0){
                  return loopThroughGroup(closest)
            }
            return; 

            }
      

}



function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

      requestAnimationFrame( animate );
     
      render();

}

function render() {


      TWEEN.update();
     
      renderer.render( scene, camera );

}
