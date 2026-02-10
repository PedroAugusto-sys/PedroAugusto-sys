import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loadingManager = new THREE.LoadingManager()

loadingManager.onError = (url) => {
  console.warn(`Erro ao carregar recurso: ${url}`)
}

const textureLoader = new THREE.TextureLoader(loadingManager)

textureLoader.setCrossOrigin('anonymous')

export const configureGLTFLoader = (): GLTFLoader => {
  const loader = new GLTFLoader(loadingManager)
  return loader
}

export { loadingManager, textureLoader }