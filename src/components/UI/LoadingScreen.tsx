import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { configureGLTFLoader } from '../../utils/textureLoader'

const LoadingSphere = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#0ea5e9"
        wireframe
        emissive="#0ea5e9"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

interface LoadingScreenProps {
  onLoaded: () => void
}

const CRITICAL_MODELS = [
  '/models/hero/character.glb',
  '/models/hero/a_pc_playing_btf4.glb',
]

const LoadingScreen = ({ onLoaded }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [loadedModels, setLoadedModels] = useState(0)

  useEffect(() => {
    let isMounted = true
    const startTime = Date.now()
    const MIN_LOADING_TIME = 3000

    const loadModels = async () => {
      try {
        const loader = configureGLTFLoader()
        
        let totalLoaded = 0
        const loadPromises = CRITICAL_MODELS.map((modelPath) => {
          return new Promise<void>((resolve) => {
            loader.load(
              modelPath,
              () => {
                if (isMounted) {
                  totalLoaded++
                  const newProgress = Math.floor((totalLoaded / CRITICAL_MODELS.length) * 90)
                  setLoadedModels(totalLoaded)
                  setProgress(newProgress)
                }
                resolve()
              },
              undefined,
              (error) => {
                console.warn(`Erro ao carregar modelo ${modelPath}:`, error)
                if (isMounted) {
                  totalLoaded++
                  setLoadedModels(totalLoaded)
                }
                resolve()
              }
            )
          })
        })

        await Promise.all(loadPromises)

        if (isMounted) {
          setProgress(100)
          
          const elapsedTime = Date.now() - startTime
          const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime)
          const finalDelay = remainingTime + 2000
          
          setTimeout(() => {
            if (isMounted) {
              setTimeout(() => {
                if (isMounted) {
                  onLoaded()
                }
              }, 100)
            }
          }, finalDelay)
        }
      } catch (error) {
        console.error('Erro ao carregar modelos:', error)
        if (isMounted) {
          setProgress(100)
          const elapsedTime = Date.now() - startTime
          const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime)
          const finalDelay = remainingTime + 2000
          
          setTimeout(() => {
            if (isMounted) {
              setTimeout(() => {
                if (isMounted) {
                  onLoaded()
                }
              }, 100)
            }
          }, finalDelay)
        }
      }
    }

    loadModels()

    return () => {
      isMounted = false
    }
  }, [onLoaded])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center w-full">
        {/* Animação 3D centralizada */}
        <div className="w-[500px] h-[500px] mb-8 flex items-center justify-center">
          <Canvas 
            camera={{ position: [0, 0, 5] }}
            gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
            dpr={[1, 1]}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <LoadingSphere />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>
        
        {/* Texto centralizado */}
        <div className="text-white text-xl mb-4 text-center">Carregando...</div>
        
        {/* Barra de progresso centralizada */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Informações de progresso centralizadas */}
        <div className="text-gray-400 text-sm mt-2 text-center w-64">
          {progress}% ({loadedModels}/{CRITICAL_MODELS.length} modelos)
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
