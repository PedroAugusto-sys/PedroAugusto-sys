import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export const useThreeScene = () => {
  const { camera, scene, gl } = useThree()

  useEffect(() => {
    scene.background = null
  }, [scene])

  return {
    camera,
    scene,
    gl,
  }
}
