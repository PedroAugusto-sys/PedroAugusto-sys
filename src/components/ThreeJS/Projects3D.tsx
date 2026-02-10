import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const Projects3D = () => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: smartphoneScene } = useGLTF('/models/projects/smartphone.glb')
  const { scene: internetScene } = useGLTF('/models/projects/internet.glb')
  const { scene: rubiksCubeScene } = useGLTF('/models/projects/rubiks_cube.glb')

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  const { smartphone, internet, rubiksCube } = useMemo(() => {
    const optimizeGeometry = (scene: THREE.Object3D) => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.frustumCulled = true
          if (child.geometry) {
            child.geometry.computeBoundingSphere()
          }
        }
      })
    }
    
    const smart = smartphoneScene.clone()
    const inter = internetScene.clone()
    const cube = rubiksCubeScene.clone()
    
    optimizeGeometry(smart)
    optimizeGeometry(inter)
    optimizeGeometry(cube)
    
    return { smartphone: smart, internet: inter, rubiksCube: cube }
  }, [smartphoneScene, internetScene, rubiksCubeScene])

  const BASE_SCALE = 0.8

  return (
    <group ref={groupRef}>
      <group position={[0, 0, 0]} scale={[BASE_SCALE * 1.2, BASE_SCALE * 1.2, BASE_SCALE * 1.2]}>
        <primitive object={rubiksCube} />
      </group>

      <group
        position={[-4, 0, -1]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}
      >
        <primitive object={smartphone} />
      </group>

      <group
        position={[4, 0, -1]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}
      >
        <primitive object={internet} />
      </group>
    </group>
  )
}

export default Projects3D

