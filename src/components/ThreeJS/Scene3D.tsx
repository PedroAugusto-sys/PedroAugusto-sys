import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useThreeScene } from '../../hooks/useThreeScene'
import { useMobile } from '../../hooks/useMobile'

interface Scene3DProps {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
  enableControls?: boolean
  enableZoom?: boolean
  className?: string
}

const WebGLContextManager = () => {
  const { gl } = useThree()
  
  useEffect(() => {
    const canvas = gl.domElement
    
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      console.warn('⚠️ WebGL Context Lost - tentando recuperar...')
    }
    
    const handleContextRestored = () => {
      console.log('✅ WebGL Context Restored - recarregando página...')
      setTimeout(() => window.location.reload(), 100)
    }
    
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [gl])
  
  return null
}

const SceneContent = ({
  children,
  enableControls = true,
  enableZoom = true,
  cameraPosition = [0, 0, 5],
}: Omit<Scene3DProps, 'className'>) => {
  useThreeScene()
  const isMobile = useMobile()

  return (
    <>
      <WebGLContextManager />
      <PerspectiveCamera makeDefault position={cameraPosition} fov={80} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      {enableControls && (
        <OrbitControls
          enableZoom={enableZoom && !isMobile}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
        />
      )}
      {children}
    </>
  )
}

const Scene3D = ({
  children,
  cameraPosition = [0, 0, 5],
  enableControls = true,
  enableZoom = true,
  className = '',
}: Scene3DProps) => {
  const isMobile = useMobile()

  return (
    <div 
      className={`w-full h-full ${className}`} 
      style={{ 
        background: 'transparent', 
        touchAction: enableControls && isMobile ? 'none' : (isMobile ? 'pan-y' : 'auto'),
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      <Canvas
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          precision: 'highp',
          premultipliedAlpha: false,
        }}
        dpr={isMobile ? [0.8, 1.2] : [1, 2]}
        camera={{ position: cameraPosition }}
        performance={{ min: isMobile ? 0.3 : 0.5, max: 1, debounce: isMobile ? 300 : 200 }}
        style={{ 
          display: 'block',
          background: 'transparent', 
          touchAction: enableControls && isMobile ? 'none' : (isMobile ? 'pan-y' : 'auto'),
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: enableControls && isMobile ? 'auto' : 'auto',
          zIndex: 1
        }}
        frameloop="always"
        onCreated={({ gl, scene }) => {
          try {
            gl.setClearColor('#000000', 0)
            gl.shadowMap.enabled = false
            gl.setPixelRatio(1)
            gl.outputColorSpace = 'srgb'
            gl.sortObjects = false
            scene.frustumCulled = true
          } catch (error) {
            console.error('Erro ao configurar WebGL:', error)
          }
        }}
        onError={(error) => {
          console.error('❌ Erro no Canvas:', error)
        }}
      >
        <Suspense fallback={null}>
          <SceneContent 
            enableControls={enableControls}
            enableZoom={enableZoom}
            cameraPosition={cameraPosition}
          >
            {children}
          </SceneContent>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene3D
