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

    this.run = this.run.bind(this)
    this.createScene = this.createScene.bind(this)

    window.addEventListener('resize', this.engine.resize())

    this.run()
  }

  createScene() {
    const scene = new BABYLON.Scene(this.engine)
    scene.enablePhysics()
    scene.collisionsEnabled = true
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0)
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR
    scene.fogDensity = .001
    scene.fogColor = new BABYLON.Color3(0, 0, 0)

    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -30), scene)
    this.camera.checkCollisions = true
    this.camera.applyGravity = true
    this.camera.attachControl(this.canvas, true)

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, -50), scene)
    light.intensity = 0.7

    const groundMaterial = new BABYLON.GridMaterial('groundMat', scene)
    groundMaterial.majorUnitFrequency = 5
    groundMaterial.minorUnitVisibility = 0.45
    groundMaterial.gridRatio = 1
    groundMaterial.backFaceCulling = false
    groundMaterial.mainColor = new BABYLON.Color3(0, 0, 0)
    groundMaterial.lineColor = new BABYLON.Color3(255, 0, 144)
    groundMaterial.opacity = .9

    let mapSubX = 1000, mapSubZ = 800, terrain
    let createTerrain = (mapData, mapSubX, mapSubZ) => {
        var params = {
            mapData: mapData,
            mapSubX: mapSubX,
            mapSubZ: mapSubZ,
            terrainSub: 120
        }
        terrain = new BABYLON.DynamicTerrain("terrain", params, scene)
        terrain.createUVMap()
        terrain.mesh.material = groundMaterial
        terrain.mesh.checkCollisions = true
        terrain.update(true)
    }

    const hmURL = "assets/textures/heightmap.jpg"
    let mapWidth = 1000,
      mapHeight = 1000,
      nbPoints = 500,
      hmOptions = {
        width: mapWidth, height: mapHeight,
        subX: nbPoints, subZ: nbPoints,
        onReady: createTerrain
      }

    const mapData = new Float32Array(nbPoints * nbPoints * 3)
    BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(hmURL, hmOptions, mapData, scene)

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

    this.assetsManager.onFinish = () => _this.engine.runRenderLoop(() =>  _this.scene.render())
    this.assetsManager.load()
  }
}

let canvas
if (canvas = document.getElementById('canvas'))
  new WebGLScene(canvas)
