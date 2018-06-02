(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class WebGLScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });
    this.engine.enableOfflineSupport = false;
    this.assets = [];
    this.scene = null;
    this.sphere = null;
    this.camera = null;
    this.groundMaterial = null;
    this.terrain = null;
    this.run = this.run.bind(this);
    this.createScene = this.createScene.bind(this);
    window.addEventListener('resize', this.engine.resize());
    this.run();
  }

  createScene() {
    const scene = new BABYLON.Scene(this.engine);
    scene.enablePhysics();
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogDensity = .001;
    scene.fogColor = new BABYLON.Color3(0, 0, 0);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -30), scene);
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.attachControl(this.canvas, true);
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, -50), scene);
    light.intensity = 0.7;
    const groundMaterial = new BABYLON.GridMaterial('groundMat', scene);
    groundMaterial.majorUnitFrequency = 5;
    groundMaterial.minorUnitVisibility = 0.45;
    groundMaterial.gridRatio = 1;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.lineColor = new BABYLON.Color3(255, 0, 144);
    groundMaterial.opacity = .9; // callback function : terrain creation

    var mapSubX = 1000;
    var mapSubZ = 800;
    var terrain;

    var createTerrain = function (mapData, mapSubX, mapSubZ) {
      var params = {
        mapData: mapData,
        mapSubX: mapSubX,
        mapSubZ: mapSubZ,
        terrainSub: 120
      };
      terrain = new BABYLON.DynamicTerrain("terrain", params, scene);
      terrain.createUVMap();
      terrain.mesh.material = groundMaterial;
      terrain.mesh.checkCollisions = true;
      terrain.update(true);
    };

    var hmURL = "assets/textures/heightmap.jpg";
    var mapWidth = 1000;
    var mapHeight = 1000;
    var nbPoints = 500;
    var hmOptions = {
      width: mapWidth,
      height: mapHeight,
      subX: nbPoints,
      subZ: nbPoints,
      onReady: createTerrain
    };
    var mapData = new Float32Array(nbPoints * nbPoints * 3); // the array that will store the generated data

    BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(hmURL, hmOptions, mapData, scene);
    return scene;
  }

  run() {
    this.scene = this.createScene();
    this.assetsManager = new BABYLON.AssetsManager(this.scene);
    const envTexture = new BABYLON.CubeTexture("assets/textures/sky35/city", this.scene);
    this.scene.createDefaultSkybox(envTexture, true, 1000);

    const _this = this;

    const textTask = this.assetsManager.addMeshTask("text", "", "assets/models/", "text.babylon");

    textTask.onSuccess = task => {
      _this.assets[task.name] = {
        meshes: task.loadedMeshes[0]
      };
      task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
      task.loadedMeshes[0].position = new BABYLON.Vector3(-25, 20, 100);
    };

    this.assetsManager.onFinish = () => _this.engine.runRenderLoop(() => _this.scene.render());

    this.assetsManager.load();
  }

}

exports.default = WebGLScene;
let canvas;
if (canvas = document.getElementById('canvas')) new WebGLScene(canvas);

},{}],2:[function(require,module,exports){
"use strict";

var _Game = _interopRequireDefault(require("./Game"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./Game":1}]},{},[2]);
