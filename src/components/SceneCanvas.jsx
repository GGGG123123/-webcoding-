import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { VehicleModel } from './VehicleModel.jsx'

export function SceneCanvas({
  carState,
  compact = false,
  onDoorToggle,
  onWindowToggle,
}) {
  const cameraSettings = compact
    ? { position: [6.4, 3.05, 5.8], fov: 36 }
    : { position: [5.25, 2.85, 4.75], fov: 33 }
  const vehicleScale = compact ? 1.08 : 1.28

  return (
    <div
      className="scene-shell"
      style={{
        '--scene-bg-image': `url("${import.meta.env.BASE_URL}images/misty-stage-bg.png")`,
      }}
    >
      <Canvas
        shadows="basic"
        dpr={[1.5, 2.5]}
        camera={cameraSettings}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 1.26
          gl.setClearAlpha(0)
        }}
      >
        <fog attach="fog" args={['#eef5fb', 7.5, 13.5]} />

        <ambientLight intensity={0.58} />
        <hemisphereLight args={['#ffffff', '#b9cadb', 0.74]} />
        <directionalLight
          castShadow
          position={[4.5, 7.2, 4]}
          intensity={1.18}
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          castShadow
          position={[-4, 5.8, 5]}
          angle={0.52}
          penumbra={0.7}
          intensity={10}
          color="#e7f5ff"
        />
        <Environment preset="city" environmentIntensity={0.52} />

        <group position={[0, -0.08, 0]} scale={vehicleScale}>
          <VehicleModel
            carState={carState}
            onDoorToggle={onDoorToggle}
            onWindowToggle={onWindowToggle}
          />
        </group>

        <ContactShadows
          color="#5f748a"
          far={2.4}
          blur={2.8}
          opacity={0.34}
          position={[0, -0.085, 0]}
          resolution={1024}
          scale={9}
        />

        <OrbitControls
          makeDefault
          enableDamping
          enablePan
          minDistance={3.25}
          maxDistance={10.5}
          maxPolarAngle={Math.PI * 0.48}
          target={[0, 0.78, 0]}
        />
      </Canvas>
    </div>
  )
}
