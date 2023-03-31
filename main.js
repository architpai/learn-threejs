import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"
import './style.css'
//Scene
const scene = new THREE.Scene()

//Geometry is basically used to define the shape of the object
const geometry = new THREE.DodecahedronGeometry(3);

//Material is what you cover the geomtry with
const material = new THREE.MeshStandardMaterial({
  color: "#ff5583",
  roughness: 0.3
})

//Mesh is what you get when you combine the geometry and material
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//light
const lightRight = new THREE.PointLight(0xffffff, 1, 100)
const lightLeft = new THREE.PointLight(0xffffff, 1, 100)
lightRight.position.set(0, 10, 10)
lightLeft.position.set(-10, -10, -10)
lightRight.intensity = 0.75
lightLeft.intensity = 1.25
scene.add(lightRight)
scene.add(lightLeft)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(3)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //update camera
  camera.updateProjectionMatrix()
  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic
const tl = gsap.timeline({ defaults: { duration: 2 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
tl.fromTo(".setup", { opacity: 0 }, { opacity: 1 })
tl.fromTo(".punchline", { opacity: 0 }, { opacity: 1 })



//Mouse Animation Color
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => { mouseDown = true })
window.addEventListener('mouseup', () => { mouseDown = false })
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    // lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b })
  }
})