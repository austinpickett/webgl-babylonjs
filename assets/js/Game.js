import { DH_UNABLE_TO_CHECK_GENERATOR } from "constants"

export default class WebGLScene {
    constructor(canvas) {
        this.canvas = canvas
        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
        this.engine.enableOfflineSupport = false
        
        this.assets = []

        this.scene = null
        this.sphere = null

        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        this.run = this.run.bind(this)
        this.createScene = this.createScene.bind(this)
        this.initGame = this.initGame.bind(this)

        document.addEventListener("keydown", this.onKeyDown)
        document.addEventListener("keyup", this.onKeyUp)
        window.addEventListener('resize', this.engine.resize())

        this.run()
    }

    createScene() {
        let scene = new BABYLON.Scene(this.engine)
        scene.enablePhysics()

        let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 10, -60), this.scene)
        camera.attachControl(this.canvas, false)

        let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, -50), this.scene)
    
        return scene
    }

    run() {
        this.scene = this.createScene()

        this.assetsManager = new BABYLON.AssetsManager(this.scene)
        let _this = this

        let textTask = this.assetsManager.addMeshTask("text", "", "assets/models/", "text.babylon")

        textTask.onSuccess = function(task) {
            _this.assets[task.name] = {meshes: task.loadedMeshes[0]}

            let text = task.loadedMeshes[0]
            text.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
            text.position = new BABYLON.Vector3(-25, 20, 100)
        }

        this.assetsManager.onFinish = function (tasks) {
            _this.initGame()

            _this.engine.runRenderLoop(function () {
                _this.scene.render()
            })
        }
        
        this.assetsManager.load()
    }

    initGame() {
        let sphereMat = new BABYLON.StandardMaterial('sphereMaterial', this.scene)
        sphereMat.diffuseColor = new BABYLON.Color3(1, 144, 244)

        this.sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene)
        this.sphere.position.y = 10
        this.sphere.material = sphereMat
        this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(this.sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, this.scene)
        
        let groundMaterial = new BABYLON.GridMaterial('groundMat', this.scene)
        groundMaterial.majorUnitFrequency = 5
        groundMaterial.minorUnitVisibility = 0.45
        groundMaterial.gridRatio = 1
        groundMaterial.backFaceCulling = false
        groundMaterial.mainColor = new BABYLON.Color3(0, 0, 0)
        groundMaterial.lineColor = new BABYLON.Color3(255, 0, 144)
        groundMaterial.opacity = .9

        let ground = BABYLON.Mesh.CreateGround('ground1', window.innerWidth, window.innerHeight, 2, this.scene, false)
        ground.material = groundMaterial
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene)

        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene)
        skyboxMaterial.backFaceCulling = false
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/night", this.scene)
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)

        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene)
        skybox.material = skyboxMaterial
    }
    
    onKeyUp(event) {
        this.sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0))
    }

    onKeyDown(event) {
        let key = event.keyCode
        let ch = String.fromCharCode(key)
        switch (ch) {
            case "W":
                this.sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 10))
                break
            case "A":
                this.sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-10, 0, 0))
                break
            case "S":
                this.sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -10))
                break
            case "D":
                this.sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(10, 0, 0))
                break
        }
    }
}

let canvas
if (canvas = document.getElementById('canvas'))
    new WebGLScene(canvas)

