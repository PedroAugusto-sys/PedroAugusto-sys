import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { preserveMaterials } from '../../utils/modelUtils'

const Achievements3D = () => {
  const groupRef = useRef<THREE.Group>(null)
  const innerGroupRef = useRef<THREE.Group>(null)
  const initialYRef = useRef<number>(0)
  const { scene: rubiksCubeScene } = useGLTF('/models/achievements/rubiks_cube.glb')

  const rubiksCube = useMemo(() => {
    const cloned = rubiksCubeScene.clone(true)
    preserveMaterials(cloned)
    
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true
        if (child.geometry) {
          child.geometry.computeBoundingSphere()
        }
      }
    })
    
    return cloned
  }, [rubiksCubeScene])

  const centerOffset = useMemo(() => {
    try {
      const box = new THREE.Box3().setFromObject(rubiksCube)
      const center = box.getCenter(new THREE.Vector3())
      const offset = new THREE.Vector3(-center.x, -center.y, -center.z)
      initialYRef.current = offset.y
      return offset
    } catch (error) {
      console.warn('Erro ao calcular bounding box:', error)
      return new THREE.Vector3(0, 0, 0)
    }
  }, [rubiksCube])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
    
    if (innerGroupRef.current) {
      const floatY = Math.sin(state.clock.elapsedTime) * 0.3
      innerGroupRef.current.position.y = centerOffset.y + floatY
    }
  })

  const BASE_SCALE = 0.8

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group 
        ref={innerGroupRef}
        position={[centerOffset.x, centerOffset.y, centerOffset.z]}
        scale={[BASE_SCALE * 2.7, BASE_SCALE * 2.7, BASE_SCALE * 2.7]}
      >
        <primitive object={rubiksCube} />
      </group>
    </group>
  )
}

export default Achievements3D

