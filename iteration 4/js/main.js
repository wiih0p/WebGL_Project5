// Ideally, we like to avoid global vars, a GL context lives as long as the window does
// So this is a case where it is understandable to have it in global space.
var gl = null;
// The rest is here simply because it made debugging easier...
//var myShader = null;
//var myDrawable = null;
var myDrawableInitialized = null;
var modelViewMatrix = null;
var projectionMatrix = null;
var modelMatrix = null;
var globalTime = 0.0;
var parsedData = null;
var drawlist = [];

function main() {
  const canvas = document.getElementById('glCanvas');
  // Initialize the GL context
  gl = canvas.getContext('webgl2');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert('Unable to initialize WebGL2. Contact the TA.');
    return;
  }

  // Set clear color to whatever color this is and fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the depth buffer
  gl.clearDepth(1.0);
  // Enable the depth function to draw nearer things over farther things
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.DEPTH_TEST);

  // Draw the scene repeatedly
  let then = 0.0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // The Projection matrix rarely needs updated.
  // Uncommonly, it is only modified in wacky sequences ("drunk" camera effect in GTAV)
  // or an artificial "zoom" using FOV (ARMA3)
  // Typically it is only updated when the viewport changes aspect ratio.
  // So, set it up here once since we won't let the viewport/canvas resize.
  const FOV = degreesToRadians(60);
  const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar  = 100.0;
  projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projectionMatrix,
                   FOV,
                   aspectRatio,
                   zNear,
                   zFar);

  // Setup Controls
  setupUI();

  // Right now, in draw, the scene will not render until the drawable is prepared
  // this allows us to acynchronously load content. If you are not familiar with async
  // that is a-okay! This link below should explain more on that topic:
  // https://blog.bitsrc.io/understanding-asynchronous-javascript-the-event-loop-74cd408419ff
  setupScene(3);
}

function setupUI() {
  // in index.html we need to setup some callback functions for the sliders
  // right now just have them report the values beside the slider.
  let sliders = ['cam', 'look'];
  let dims = ['X', 'Y', 'Z'];
  // for cam and look UI..
  sliders.forEach(controlType => {
    // for x, y, z control slider...
    dims.forEach(dimension => {
      let slideID = `${controlType}${dimension}`;
      console.log(`Setting up control for ${slideID}`);
      let slider = document.getElementById(slideID);
      let sliderVal = document.getElementById(`${slideID}Val`);
      // These are called "callback functions", essentially when the input
      // value for the slider or the field beside the slider change,
      // run the code we supply here!
      slider.oninput = () => {
        let newVal = slider.value;
        sliderVal.value = newVal;
      };
      sliderVal.oninput = () => {
        let newVal = sliderVal.value;
        slider.value = newVal;
      };
    });
  });
}

// slightly modified from the wiki
function loadTexture(src) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  var image = new Image();
  image.src = src;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
}
//extra function for cubemap textures
function loadCubemap(src) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  //for all faces set the image then call teximage2d to assign posx + 1 = negx and so on
  for (var i = 1; i < 7; i++) {
    var image = new Image();
    image.src = src[i];
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + (i - 1), 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  return texture;
}

// Async as it loads resources over the network.
//updated for multiple objects and shaders
async function setupScene(frag) {

  var vertsource1 = ('resources/shaders/verts/tex_gouraudye.vert');
  var fragsource1 = ('resources/shaders/frags/tex_gouraudye.frag');
  var vertsource2 = ('resources/shaders/verts/texcheck.vert');
  var fragsource2 = ('resources/shaders/frags/texcheck.frag');
  var vertsource3 = ('resources/shaders/verts/tex_step3.vert');
  var fragsource3 = ('resources/shaders/frags/tex_step3.frag');
  var vertsource4 = ('resources/shaders/verts/tex_gouraud.vert');
  var fragsource4 = ('resources/shaders/frags/tex_gouraud.frag');
  var vertsource5 = ('resources/shaders/verts/rainbowshad.vert');
  var fragsource5 = ('resources/shaders/frags/rainbowshad.frag');

  let objData1 = await loadNetworkResourceAsText('resources/models/vtcube.obj');
  let objData2 = await loadNetworkResourceAsText('resources/models/vtsphere.obj');
  let objData3 = await loadNetworkResourceAsText('resources/models/bunny.obj');

  let vertSource1 = await loadNetworkResourceAsText(vertsource1);
  let fragSource1 = await loadNetworkResourceAsText(fragsource1);
  let vertSource2 = await loadNetworkResourceAsText(vertsource2);
  let fragSource2 = await loadNetworkResourceAsText(fragsource2);
  let vertSource3 = await loadNetworkResourceAsText(vertsource3);
  let fragSource3 = await loadNetworkResourceAsText(fragsource3);
  let vertSource4 = await loadNetworkResourceAsText(vertsource4);
  let fragSource4 = await loadNetworkResourceAsText(fragsource4);
  let vertSource5 = await loadNetworkResourceAsText(vertsource5);
  let fragSource5 = await loadNetworkResourceAsText(fragsource5);

  initializeMyObject(vertSource1, fragSource1, objData1);
  initializeMyObject(vertSource3, fragSource3, objData1);
  initializeMyObject(vertSource2, fragSource2, objData2);
  initializeMyObject(vertSource4, fragSource4, objData2);
  initializeMyObject(vertSource4, fragSource4, objData2);
  initializeMyObject(vertSource4, fragSource4, objData2);
  initializeMyObject(vertSource4, fragSource4, objData2);
  initializeMyObject(vertSource4, fragSource4, objData2);
  initializeMyObject(vertSource4, fragSource4, objData2);
  initializeMyObject(vertSource5, fragSource5, objData3);
}

function drawScene(deltaTime) {
  globalTime += deltaTime;

  //load the textures
  //load the wood texture in 0 to act like a normal texture and the normal texture in 1 to act as normal map
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, loadTexture("resources/textures/cage.png"));
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, loadTexture("resources/textures/yeet.png"));
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, loadTexture("resources/textures/toyboxass/normo.png"));

  let cubemap = [];
  cubemap[1] = "resources/textures/finalcubemap/right.png";
  cubemap[2] = "resources/textures/finalcubemap/left.png";
  cubemap[3] = "resources/textures/finalcubemap/top.png";
  cubemap[4] = "resources/textures/finalcubemap/bot.png";
  cubemap[5] = "resources/textures/finalcubemap/front.png";
  cubemap[6] = "resources/textures/finalcubemap/back.png";

  let cubemap1 = [];
  cubemap1[1] = "resources/textures/finalcubemap/right.png";
  cubemap1[2] = "resources/textures/finalcubemap/left.png";
  cubemap1[3] = "resources/textures/finalcubemap/top.png";
  cubemap1[4] = "resources/textures/finalcubemap/bot.png";
  cubemap1[5] = "resources/textures/finalcubemap/front.png";
  cubemap1[6] = "resources/textures/finalcubemap/back.png";

  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, loadCubemap(cubemap));
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, loadCubemap(cubemap1));

  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //these consts make it easier to change number of planets and the spacing between them
  const numObjects = 10;
  const spacing = 2;

  //loop for the number of planets
  //create a planet
  //set the planets position so that they are spaced apart by the spacer const
  //save the original planet position aka the sun position aka objectWorldPos1
  // if its not the sun rotate around the sun and your own axis
  //otherwise you are the sun so just rotate on your own axis

      //normal camera creation
    let viewMatrix = glMatrix.mat4.create();
    let cameraPos = [lookXVal.value, lookYVal.value, lookZVal.value];
    let cameraFocus = [camXVal.value, camYVal.value, camZVal.value];
    glMatrix.mat4.lookAt(viewMatrix,
                          cameraPos,
                          cameraFocus,
                          [0.0, 1.0, 0.0]
                        );
    modelViewMatrix = glMatrix.mat4.create();
  for (let i = 0; i < numObjects; i++) {
    modelMatrix = glMatrix.mat4.create();
    let objectWorldPos = [0.0, 0.0, 0.0];
    //let objectWorldPos1 = [0.0, 0.0, -6.0];
    //let rotationAxis = [1.0, 1.0, 1.0];
    //if(i > 0){

    /*
    glMatrix.mat4.rotate(modelMatrix,
                         modelMatrix,
                         globalTime,
                         rotationAxis
                        );
    
    glMatrix.mat4.translate(modelMatrix, modelMatrix, objectWorldPos);
    glMatrix.mat4.rotate(modelMatrix,
      modelMatrix,
      globalTime,
      rotationAxis
     );

    }else{
      */

      //section for changing each object as nessecary
    if(i == 0){

      objectWorldPos = [-0.4, -0.4, -0.4];
      glMatrix.mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0]);
    }
    if(i == 2){

      objectWorldPos = [-0.5, -0.5, -0.5];
      glMatrix.mat4.fromScaling(modelMatrix, [100.0, 100.0, 100.0]);
    }
    if(i == 1){

      //objectWorldPos = [-0.5, -0.5, -0.5];
      //glMatrix.mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0]);
    }
    if(i == 3){

      //console.log("that thing");
      objectWorldPos = [0, 6, 0];
      //glMatrix.mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0]);
    }
    if(i == 4){
      objectWorldPos = [0, -6, 0];
    }
    if(i == 5){
      objectWorldPos = [6, 0, 0];
    }
    if(i == 6){
      objectWorldPos = [-6, 0, 0];
    }
    if(i == 7){
      objectWorldPos = [0, 0, 6];
    }
    if(i == 8){
      objectWorldPos = [0, 0, -6];
    }
    if(i == 9){

      objectWorldPos = [-0.4, 1.5, -0.4];
      glMatrix.mat4.scale(modelMatrix, modelMatrix, [5.0, 5.0, 5.0]);
    }

    if(i > 2 && i < 9){
      glMatrix.mat4.rotate(modelMatrix,
        modelMatrix,
        globalTime,
        [-1.0, -1.0, -1.0]
       );
    }

    glMatrix.mat4.translate(modelMatrix, modelMatrix, objectWorldPos);
    if(i == 2){
    }else if(i == 1){
      glMatrix.mat4.rotate(modelMatrix,
        modelMatrix,
        globalTime,
        [-1.0, -1.0, -1.0]
       );
    }else{
    glMatrix.mat4.rotate(modelMatrix,
                          modelMatrix,
                          globalTime,
                          [1.0, 1.0, 1.0]
                         );

    }
    //}



    
    glMatrix.mat4.mul(modelViewMatrix, viewMatrix, modelMatrix);

    //now draw from a list of objects
    if (myDrawableInitialized){
      drawlist[i].draw();
    }
  }
}

function initializeMyObject(vertSource, fragSource, objData) {

  var myShader = new ShaderProgram(vertSource, fragSource); // this class is in shader.js
  parsedData = new OBJData(objData); // this class is in obj-loader.js
  let rawData = parsedData.getFlattenedDataFromModelAtIndex(0);

  // Generate Buffers on the GPU using the geometry data we pull from the obj
  let vertexPositionBuffer = new VertexArrayData( // this class is in vertex-data.js
    rawData.vertices, // What is the data?
    gl.FLOAT,         // What type should WebGL treat it as?
    3                 // How many per vertex?
  );
  
  let vertexNormalBuffer = new VertexArrayData(
    rawData.normals,
    gl.FLOAT,
    3
  );

  let vertexTexCoordBuffer = new VertexArrayData (
    rawData.uvs,
    gl.FLOAT,
    2
  );

  let vertexBarycentricBuffer = new VertexArrayData (
    rawData.barycentricCoords,
    gl.FLOAT,
    3
  );

  //new buffers for tangents and bitangents
  let vertexTangentsBuffer = new VertexArrayData (
    rawData.tangents,
    gl.FLOAT,
    3
  );

  let vertexBiTangentsBuffer = new VertexArrayData (
    rawData.biTangents,
    gl.FLOAT,
    3
  );

  /*
  For any model that is smooth (non discrete) indices should be used, but we are learning! Maybe you can get this working later?
  One indicator if a model is discrete: a vertex position has two normals.
  A cube is discrete if only 8 vertices are used, but each vertex has 3 normals (each vertex is on the corner of three faces!)
  The sphere and bunny obj models are smooth though */
  // getFlattenedDataFromModelAtIndex does not return indices, but getIndexableDataFromModelAtIndex would
  //let vertexIndexBuffer = new ElementArrayData(rawData.indices);

  // In order to let our shader be aware of the vertex data, we need to bind
  // these buffers to the attribute location inside of the vertex shader.
  // The attributes in the shader must have the name specified in the following object
  // or the draw call will fail, possibly silently!
  // Checkout the vertex shaders in resources/shaders/verts/* to see how the shader uses attributes.
  // Checkout the Drawable constructor and draw function to see how it tells the GPU to bind these buffers for drawing.
  let bufferMap = {
    'aVertexPosition': vertexPositionBuffer,
    'aBarycentricCoord': vertexBarycentricBuffer,
    'aVertexNormal': vertexNormalBuffer, //-> Not working with normals, yet! The sphere has norms included, the bunny needs norms generated.
    'aVertexTexCoord': vertexTexCoordBuffer, //-> Same, not working with texture coords yet.
    'aVertexTangent' : vertexTangentsBuffer, // add to buffer lib for more data
    'aVertexBiTangent' : vertexBiTangentsBuffer // same^
  };

  //make a list of drawables for multiple objs
  var myDrawable = new Drawable(myShader, bufferMap, null, rawData.vertices.length / 3);
  drawlist.push(myDrawable);

  // Checkout the drawable class' draw function. It calls a uniform setup function every time it is drawn. 
  // Put your uniforms that change per frame in this setup function.
  myDrawable.uniformLocations = myShader.getUniformLocations(['uModelViewMatrix', 'uProjectionMatrix', 'uModelMatrix']);
  myDrawable.uniformSetup = () => {

    //pass texture uniforms to overlay the normal map
    var normalMap = gl.getUniformLocation(myShader.program, "dingus");
    gl.uniform1i(normalMap, 1);
    var texture = gl.getUniformLocation(myShader.program, "dongus");
    gl.uniform1i(texture, 0);
    var texture1 = gl.getUniformLocation(myShader.program, "texo");
    gl.uniform1i(texture1, 2);
    var texturecube = gl.getUniformLocation(myShader.program, "cubo");
    gl.uniform1i(texturecube, 3);
    var texturecube1 = gl.getUniformLocation(myShader.program, "cubungus");
    gl.uniform1i(texturecube1, 4);

    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uModelViewMatrix,
      false,
      modelViewMatrix
    );
    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uModelMatrix,
      false,
      modelMatrix
    );
  };

  myDrawableInitialized = true;
}

// After all the DOM has loaded, we can run the main function.
window.onload = main;
