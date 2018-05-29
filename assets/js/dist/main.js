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
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    var scene = this.createScene();
    this.engine.runRenderLoop(function () {
      scene.render();
    });
    window.addEventListener('resize', function () {
      this.engine.resize();
    });
  }

  createScene() {
    var scene = new BABYLON.Scene(this.engine);
    scene.enablePhysics();
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -50), scene);
    camera.attachControl(canvas, true);
    var sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
    sphere.position.y = 1; // Create a basic light, aiming 0, 1, 0 - meaning, to the sky

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    var groundMaterial = new BABYLON.GridMaterial('groundMat', scene);
    groundMaterial.majorUnitFrequency = 5;
    groundMaterial.minorUnitVisibility = 0.45;
    groundMaterial.gridRatio = 1;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.lineColor = new BABYLON.Color3(255, 0, 144);
    groundMaterial.opacity = .9; // Skybox

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
      size: 1000.0
    }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/night", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial; // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable

    var ground = BABYLON.Mesh.CreateGround('ground1', window.innerWidth, window.innerHeight, 2, scene, false);
    ground.material = groundMaterial;
    BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "text.babylon", scene, function (newMeshes) {
      newMeshes[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
      newMeshes[0].position = new BABYLON.Vector3(-25, 20, 200);
      shadowGenerator.getShadowMap().renderList.push(newMeshes[0]);
    });
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
      mass: 1,
      restitution: 0.9
    }, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 0,
      restitution: 0.9
    }, scene);
    return scene;
  }

  onKeyUp(event) {
    sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
  }

  onKeyDown(event) {
    var key = event.keyCode;
    var ch = String.fromCharCode(key);

    switch (ch) {
      case "W":
        sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 10));
        break;

      case "A":
        sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-10, 0, 0));
        break;

      case "S":
        sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -10));
        break;

      case "D":
        sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(10, 0, 0));
        break;
    }
  }

}

exports.default = WebGLScene;
let canvas;
if (canvas = document.getElementById('canvas')) new WebGLScene(canvas);

},{}]},{},[1]);
