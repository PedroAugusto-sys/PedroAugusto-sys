import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Model3DProps {
  modelPath: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  autoRotate?: boolean
  rotationSpeed?: number
  float?: boolean
  floatSpeed?: number
  floatAmplitude?: number
}

const Model3D = ({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = true,
  rotationSpeed = 0.5,
  float = false,
  floatSpeed = 1,
  floatAmplitude = 0.3,
}: Model3DProps) => {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef<THREE.Group>(null)
  const initialY = position[1]

  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true
        if (child.geometry) {
          child.geometry.computeBoundingSphere()
        }
      }
    })
    
    return cloned
  }, [scene])

  useFrame((state) => {
    if (groupRef.current) {
      if (autoRotate) {
        groupRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
      }
      
      if (float) {
        groupRef.current.position.y =
          initialY + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude
      }
    }
  })

  const scaleValue: [number, number, number] = Array.isArray(scale) 
    ? [scale[0], scale[1], scale[2]]
    : [scale, scale, scale]

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scaleValue}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

export default Model3D
