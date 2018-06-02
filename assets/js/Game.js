import { DH_UNABLE_TO_CHECK_GENERATOR } from "constants"

export default class WebGLScene {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
    this.engine.enableOfflineSupport = false

    this.assets = []

    this.scene = null
    this.sphere = null
    this.camera = null
    this.groundMaterial = null
    this.terrain = null

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.run = this.run.bind(this)
    this.createScene = this.createScene.bind(this)
    this.initGame = this.initGame.bind(this)

    document.addEventListener("keydown", this.onKeyDown)
    document.addEventListener("keyup", this.onKeyUp)
    window.addEventListener('resize', this.engine.resize())

    var url = "http://jerome.bousquie.fr/BJS/Extensions/DynamicTerrain/dist/babylon.dynamicTerrain.min.js";
    this.s = document.createElement("script");
    this.s.src = url;
    document.head.appendChild(this.s);

    this.run()
  }

  createScene() {
    const scene = new BABYLON.Scene(this.engine)
    scene.enablePhysics()
    scene.collisionsEnabled = true

    this.camera = new BABYLON.ArcRotateCamera('camera', -(Math.PI / 2), 1.0, 30, this.scene)
    this.camera.lowerRadiusLimit = 10
    this.camera.upperRadiusLimit = 50
    this.camera.checkCollisions = true
    this.camera.applyGravity = true
    this.camera.attachControl(canvas, true)

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, -50), this.scene)
    light.intensity = 0.7
    this.s.onload = function() {
      var mapSubX = 100;
      var mapSubZ = 100;
      var terrainSub = 50;

      var mapData = new Float32Array(mapSubX * mapSubZ * 3);
      for (var l = 0; l < mapSubZ; l++) {
          for (var w = 0; w < mapSubX; w++) {
              mapData[3 *(l * mapSubX + w)] = (w - mapSubX * 0.5) * 2.0;
              mapData[3 * (l * mapSubX + w) + 1] = 0;
              mapData[3 * (l * mapSubX + w) + 2] = (l - mapSubZ * 0.5) * 2.0;
          }
      }

      var params = {
          mapData: mapData,
          mapSubX: mapSubX,
          mapSubZ: mapSubZ,
          terrainSub: terrainSub
      };
      var terrain = new BABYLON.DynamicTerrain("terrain", params, this.scene);
      terrain.mesh.position.y = -1.0;

      var mapMaterial = new BABYLON.StandardMaterial("materialGround", this.scene);
      mapMaterial.wireframe = true;
      terrain.mesh.material = mapMaterial;
    }


    return scene
  }

  run() {
    this.scene = this.createScene()
    this.assetsManager = new BABYLON.AssetsManager(this.scene)

    const envTexture = new BABYLON.CubeTexture("assets/textures/sky35/city", this.scene)
    this.scene.createDefaultSkybox(envTexture, true, 1000)

    const _this = this
    const textTask = this.assetsManager.addMeshTask("text", "", "assets/models/", "text.babylon")

    textTask.onSuccess = (task) => {
      _this.assets[task.name] = {meshes: task.loadedMeshes[0]}
      task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
      task.loadedMeshes[0].position = new BABYLON.Vector3(-25, 20, 100)
    }

    this.assetsManager.onFinish = () => {
      _this.initGame()
      _this.engine.runRenderLoop(() =>  _this.scene.render())
    }

    this.assetsManager.load()
  }

  initGame() {
    const sphereMat = new BABYLON.StandardMaterial('sphereMaterial', this.scene)
    sphereMat.diffuseColor = new BABYLON.Color3(1, 144, 244)

    this.sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 1, this.scene)
    this.sphere.position.y = 10
    this.sphere.material = sphereMat
    this.sphere.checkCollisions = true
    this.sphere.ellipsoid = new BABYLON.Vector3(1,1,1)

    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 0.3, restitution: 0 },
      this.scene
    )

    this.camera.setTarget(this.sphere)

    const groundMaterial = new BABYLON.GridMaterial('groundMat', this.scene)
    groundMaterial.majorUnitFrequency = 5
    groundMaterial.minorUnitVisibility = 0.45
    groundMaterial.gridRatio = 1
    groundMaterial.backFaceCulling = false
    groundMaterial.mainColor = new BABYLON.Color3(0, 0, 0)
    groundMaterial.lineColor = new BABYLON.Color3(255, 0, 144)
    groundMaterial.opacity = .9

    const ground = BABYLON.Mesh.CreateGround('ground1', window.innerWidth, window.innerHeight, 1, this.scene)
    ground.material = groundMaterial
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.3, restitution: 0.9 },
      this.scene
    )
    ground.checkCollisions = true
  }

  onKeyUp() {
    this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 0), this.sphere.position)
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 87:
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 1), this.sphere.position)
        break
      case 65:
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(-1, 0, 0), this.sphere.position)
        break
      case 83:
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, -1), this.sphere.position)
        break
      case 68:
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(1, 0, 0), this.sphere.position)
        break
      case 32:
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 10, 0), this.sphere.position)
        break
    }
  }
}

let canvas
if (canvas = document.getElementById('canvas'))
  new WebGLScene(canvas)
