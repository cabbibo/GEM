function Text( text , mat ){

  //var text = "#weirdkids",

    height = 1,
    size = 3,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,

    font ="helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
    weight = "bold", // normal bold
    style = "normal"; // normal italic


    var cubeG = new THREE.BoxGeometry( 1 ,1 ,1 )
    var geometry = new THREE.Geometry();
  
    
    var geo = new THREE.TextGeometry( text, {

        size: size,
        height: height,
        curveSegments: curveSegments,

        font: font,
        weight: weight,
        style: style,

        bevelThickness: bevelThickness,
        bevelSize:  bevelSize,
        bevelEnabled: bevelEnabled,

        material: 0,
        extrudeMaterial: 1

      });

    for( var i = 0; i < 10; i++ ){
      
       
      var m = new THREE.Mesh( cubeG );
      m.rotation.z = (i / 10 ) * 2 * Math.PI;
      var t = - m.rotation.z + Math.PI / 2
      m.position.x += 1 * Math.sin(t);
      m.position.y += 1 * Math.cos(t);

      m.updateMatrix();

      geometry.merge( geo , m.matrix );

    }

 // geo.computeVertexNormals();

  this.geo = geometry;
  this.mat = mat;

 /* var mesh = new THREE.Mesh( geo ,/* new THREE.MeshBasicMaterial({
  
    color:0xffffff,
    map: t_audio.value
   // wireframe:true
    
  })  mat);

  this.mesh = mesh;*/
  //scene.add( mesh );



}
