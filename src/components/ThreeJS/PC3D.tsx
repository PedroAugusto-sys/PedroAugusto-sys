import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { track3DInteraction } from '../../utils/analytics'
import { preserveMaterials } from '../../utils/modelUtils'

const PC3D = () => {
  const groupRef = useRef<THREE.Group>(null)
  const pcRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { scene: pcScene } = useGLTF('/models/hero/a_pc_playing_btf4.glb')

  useFrame((state) => {
    if (groupRef.current && pcRef.current) {
      if (!hovered) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
      }
      
      if (hovered) {
        pcRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
      } else {
        pcRef.current.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1)
      }
    }
  })

  const handleClick = () => {
    track3DInteraction('click', 'hero_pc')
  }

  const handlePointerOver = () => {
    setHovered(true)
    track3DInteraction('hover', 'hero_pc')
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  const handlePointerDown = () => {
    setHovered(true)
    track3DInteraction('touch', 'hero_pc')
  }

  const handlePointerUp = () => {
    setHovered(false)
  }

  const pc = useMemo(() => {
    const cloned = pcScene.clone(true)
    preserveMaterials(cloned)
    return cloned
  }, [pcScene])

  const BASE_SCALE = 0.8

  return (
    <group ref={groupRef}>
      <group 
        ref={pcRef}
        position={[0, 0, 0]} 
        rotation={[0, -Math.PI / 4, 0]} 
        scale={[BASE_SCALE * 0.75, BASE_SCALE * 0.75, BASE_SCALE * 0.75]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <primitive object={pc} />
      </group>
    </group>
  )
}

export default PC3D

