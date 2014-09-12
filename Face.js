function Face( geometry , ss , vs , fs , u ){

  this.ogGeometry = geometry;
 
  this.ss = ss; // simulation shader
  this.vs = vs; // vertex  shader
  this.fs = fs; // fragment shader
  this.u  = u;  // uniforms

  this.size = Math.ceil( Math.sqrt( geometry.vertices.length ) );
 
  this.vertexUVs = this.createVertexUVs();
  this.t_og = this.createOGTexture();

  this.physics = new PhysicsRenderer( this.size , this.ss , renderer );

  this.physics.setUniform( 'dT' , dT );
  this.physics.setUniform( 'timer' , timer );
  this.physics.setUniform( 't_og' , this.t_og );
  
  for( var propt in this.u.simulation ){

    this.physics.setUniform( propt , this.u.simulation[propt] );

  }

  this.uniforms = {

    t_pos:{ type:"t" , value:null },
    t_oPos:{ type:"t" , value:null },
    t_audio:t_audio,
   // t_normal:{type:"t" ,value: waterNormal },
    t_og:this.t_og

  }

  for( var propt in this.u.render ){

    this.uniforms[ propt ] = this.u.render[propt];

  }



  this.attributes = {

    tri1:        { type: 'v3', value: null },
    tri2:        { type: 'v3', value: null },

  };
  

  this.material = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    attributes: this.attributes,
    vertexShader: this.vs, 
    fragmentShader: this.fs,
    transparent: true,
   // blending: THREE.AdditiveBlending,
   // depthWrite: false,
    side: THREE.DoubleSide
  });
  
  this.geometry = this.createGeometry();

  this.three = new THREE.Mesh( this.geometry , this.material );

 // this.three = new THREE.Mesh( this.ogGeometry );
 // scene.add( this.three );

}

Face.prototype.addToScene = function(){

  scene.add( this.three );

}

Face.prototype.removeFromScene = function(){

  scene.remove( this.three );

}


Face.prototype.createVertexUVs = function(){

  var uvs = [];

  for( var i = 0; i < this.size; i++ ){
    for( var j = 0; j < this.size; j++ ){

      var index = i * this.size + j;
      if( this.ogGeometry.vertices[index] ){

        var x = 1 - (i / this.size) - (.5 / this.size)

        var y = (j / this.size) +(.5 / this.size)

       
        uvs[ index ] = [y,x];

      }else{

        console.log( 'too high' );

      }

    }
  }


  return uvs;


}
Face.prototype.createOGTexture = function(){

  console.log( this.size );
  console.log( this.size * this.size );
  console.log( this.ogGeometry.vertices.length );
 
  var data = new Float32Array( this.size * this.size * 4 );

  for( var i = 0; i < this.size; i++ ){
    for( var j = 0; j < this.size; j++ ){

      var index = i * this.size + j;
      
      if( this.ogGeometry.vertices[index] ){

        var v = this.ogGeometry.vertices[ index ];

        data[ index * 4 + 0 ] = v.x;
        data[ index * 4 + 1 ] = v.y;
        data[ index * 4 + 2 ] = v.z;
        data[ index * 4 + 3 ] = index;

      }else{

        console.log('too hi');

      }


    }
  }

  var positionsTexture = new THREE.DataTexture(
    data, 
    this.size, 
    this.size, 
    THREE.RGBAFormat, 
    THREE.FloatType 
  );

  positionsTexture.minFilter = THREE.NearestFilter;
  positionsTexture.magFilter = THREE.NearestFilter;
  positionsTexture.generateMipmaps = false;
  positionsTexture.needsUpdate = true;


  return { type:"t" , value:positionsTexture }

}

Face.prototype.createGeometry = function(){

  var g = this.ogGeometry;
  var f = g.faces;
  var v = g.vertices;

  var geo = new THREE.BufferGeometry();  
  
  var positions = new Float32Array( f.length * 3 * 3 );
  var tri1Array = new Float32Array( f.length * 3 * 3 );
  var tri2Array = new Float32Array( f.length * 3 * 3 );
  
  var pos  = new THREE.BufferAttribute( positions , 3 );
  var tri1 = new THREE.BufferAttribute( tri1Array , 3 );
  var tri2 = new THREE.BufferAttribute( tri2Array , 3 );

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'tri1' , tri1 );
  geo.addAttribute( 'tri2' , tri2 );

  var vertCount = 0;

  for( var i = 0; i < f.length; i++ ){

    var vertexNum = i * 3;
    var index     = vertexNum * 3;

  
    var v1 = f[i].a;
    var a1 = this.vertexUVs[ v1 ];

    var v2 = f[i].b;
    var a2 = this.vertexUVs[ v2 ]; 

    var v3 = f[i].c;
    var a3 = this.vertexUVs[ v3 ]; 

    positions[ index + 0 ] = a1[0]; 
    positions[ index + 1 ] = a1[1]; 
    positions[ index + 2 ] = v1; 

    positions[ index + 3 ] = a2[0]; 
    positions[ index + 4 ] = a2[1]; 
    positions[ index + 5 ] = v2; 

    positions[ index + 6 ] = a3[0]; 
    positions[ index + 7 ] = a3[1]; 
    positions[ index + 8 ] = v3;


    tri1Array[ index + 0 ] = a2[0]; 
    tri1Array[ index + 1 ] = a2[1]; 
    tri1Array[ index + 2 ] = v2; 

    tri1Array[ index + 3 ] = a3[0]; 
    tri1Array[ index + 4 ] = a3[1]; 
    tri1Array[ index + 5 ] = v3; 

    tri1Array[ index + 6 ] = a1[0]; 
    tri1Array[ index + 7 ] = a1[1]; 
    tri1Array[ index + 8 ] = v1;


    tri2Array[ index + 0 ] = a3[0]; 
    tri2Array[ index + 1 ] = a3[1]; 
    tri2Array[ index + 2 ] = v3; 

    tri2Array[ index + 3 ] = a1[0]; 
    tri2Array[ index + 4 ] = a1[1]; 
    tri2Array[ index + 5 ] = v1; 

    tri2Array[ index + 6 ] = a2[0]; 
    tri2Array[ index + 7 ] = a2[1]; 
    tri2Array[ index + 8 ] = v2; 


  }

  return geo;

}

Face.prototype.update = function(){

  this.physics.update();

}

Face.prototype.debug = function(scale , y){

  var scale = scale || .1;
  var y = y || 20;
  this.physics.createDebugScene();
  this.physics.addDebugScene( scene );
  this.physics.debugScene.scale.multiplyScalar( scale );
  this.physics.debugScene.position.y = y;


}
