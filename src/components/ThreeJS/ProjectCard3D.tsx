import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { track3DInteraction } from '../../utils/analytics'

interface ProjectCard3DProps {
  modelPath: string
  modelIndex: number
}

const ProjectCard3D = ({ modelPath, modelIndex }: ProjectCard3DProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { scene } = useGLTF(modelPath)

  useFrame((state) => {
    if (groupRef.current && modelRef.current) {
      groupRef.current.rotation.y += 0.01
      
      const floatOffset = Math.sin(state.clock.elapsedTime * 1.5 + modelIndex) * 0.3
      modelRef.current.position.y = floatOffset
      
      if (hovered) {
        modelRef.current.rotation.y += 0.05
        modelRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
      } else {
        modelRef.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1)
      }
    }
  })

  const handleClick = () => {
    track3DInteraction('click', `project_card_${modelIndex}`)
  }

  const handlePointerOver = () => {
    setHovered(true)
    track3DInteraction('hover', `project_card_${modelIndex}`)
  }

  const handlePointerOut = () => {
    setHovered(false)
  }

  const handlePointerDown = () => {
    setHovered(true)
    track3DInteraction('touch', `project_card_${modelIndex}`)
  }

  const handlePointerUp = () => {
    setHovered(false)
  }

  const clonedScene = scene.clone()

  const isSmartphone = modelPath.includes('smartphone')
  const isStar = modelPath.includes('star')
  const BASE_SCALE = isSmartphone ? 2.5 : isStar ? 1.2 : 0.5

  return (
    <group ref={groupRef}>
      <group
        ref={modelRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}
      >
        <primitive object={clonedScene} />
      </group>
    </group>
  )
}

export default ProjectCard3D

