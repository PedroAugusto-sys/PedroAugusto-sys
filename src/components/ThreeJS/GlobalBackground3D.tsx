import Scene3D from './Scene3D'
import Background3D from './Background3D'

const GlobalBackground3D = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
      <Scene3D enableControls={false} className="w-full h-full">
        <Background3D />
      </Scene3D>
    </div>
  )
}

export default GlobalBackground3D
