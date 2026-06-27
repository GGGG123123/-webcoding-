import { RoundedBox, Line } from '@react-three/drei'

const sideWindowConfig = [
  { id: 'frontLeft', x: -0.72, z: 1.13 },
  { id: 'rearLeft', x: 0.63, z: 1.13 },
  { id: 'frontRight', x: -0.72, z: -1.13 },
  { id: 'rearRight', x: 0.63, z: -1.13 },
]

function PaintMaterial() {
  return (
    <meshPhysicalMaterial
      color="#edf4f2"
      metalness={0.72}
      roughness={0.22}
      clearcoat={1}
      clearcoatRoughness={0.12}
    />
  )
}

function DarkTrimMaterial() {
  return <meshStandardMaterial color="#111820" roughness={0.64} />
}

function GlassMaterial({ opacity = 0.48, color = '#8fdcff' }) {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={opacity}
      roughness={0.04}
      metalness={0.04}
      transmission={0.28}
      thickness={0.15}
      depthWrite={false}
    />
  )
}

function SideWindow({ id, x, z, isOpen, onWindowToggle }) {
  const y = isOpen ? 1.15 : 1.46
  const opacity = isOpen ? 0.18 : 0.52

  function handleClick(event) {
    event.stopPropagation()
    onWindowToggle(id)
  }

  return (
    <RoundedBox
      args={[1.02, 0.4, 0.04]}
      castShadow
      onClick={handleClick}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      position={[x, y, z]}
      radius={0.035}
      receiveShadow
      smoothness={4}
    >
      <GlassMaterial opacity={opacity} />
    </RoundedBox>
  )
}

function DoorOutline({ side, startX, endX }) {
  const z = side * 1.071
  const points = [
    [startX, 0.75, z],
    [startX, 1.25, z],
    [startX + 0.18, 1.53, z],
    [endX, 1.53, z],
    [endX, 0.75, z],
    [startX, 0.75, z],
  ]

  return (
    <Line
      color="#1d2b33"
      lineWidth={1.35}
      opacity={0.72}
      points={points}
      transparent
    />
  )
}

function Wheel({ x, z }) {
  const side = z > 0 ? 1 : -1
  const spokeRotations = [0, Math.PI / 3, (Math.PI * 2) / 3]

  return (
    <group position={[x, 0.45, z]}>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.34, 72]} />
        <meshStandardMaterial color="#090b0d" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, side * 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.08, 48]} />
        <meshStandardMaterial color="#c9d4d6" metalness={0.7} roughness={0.25} />
      </mesh>
      {spokeRotations.map((rotation) => (
        <mesh
          key={rotation}
          position={[0, 0, side * 0.25]}
          rotation={[0, 0, rotation]}
        >
          <boxGeometry args={[0.055, 0.58, 0.045]} />
          <meshStandardMaterial color="#7f8d92" metalness={0.55} roughness={0.28} />
        </mesh>
      ))}
      <mesh position={[0, 0, side * 0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
        <meshStandardMaterial color="#0c1115" roughness={0.5} />
      </mesh>
    </group>
  )
}

function WheelArch({ x, side }) {
  return (
    <mesh position={[x, 0.46, side * 1.08]}>
      <torusGeometry args={[0.55, 0.026, 8, 48, Math.PI]} />
      <meshStandardMaterial color="#172027" roughness={0.56} />
    </mesh>
  )
}

function HeadLight({ side, lightsOn }) {
  return (
    <>
      <RoundedBox
        args={[0.07, 0.13, 0.56]}
        position={[-2.88, 0.9, side * 0.56]}
        radius={0.03}
        smoothness={4}
      >
        <meshStandardMaterial
          color={lightsOn ? '#ecfeff' : '#9fb6bd'}
          emissive={lightsOn ? '#d9fbff' : '#1f3136'}
          emissiveIntensity={lightsOn ? 3.2 : 0.18}
          roughness={0.22}
        />
      </RoundedBox>
      {lightsOn && (
        <pointLight
          color="#d9fbff"
          distance={4}
          intensity={1.4}
          position={[-3.1, 0.92, side * 0.58]}
        />
      )}
    </>
  )
}

function TailLight({ side, lightsOn }) {
  return (
    <RoundedBox
      args={[0.06, 0.14, 0.5]}
      position={[2.89, 0.9, side * 0.55]}
      radius={0.03}
      smoothness={4}
    >
      <meshStandardMaterial
        color={lightsOn ? '#fb7185' : '#7f1d1d'}
        emissive={lightsOn ? '#fb244d' : '#2a0808'}
        emissiveIntensity={lightsOn ? 2.3 : 0.25}
        roughness={0.28}
      />
    </RoundedBox>
  )
}

function FrontLightBeam({ lightsOn }) {
  if (!lightsOn) {
    return null
  }

  return (
    <mesh position={[-3.82, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
      <coneGeometry args={[0.84, 1.75, 32, 1, true]} />
      <meshBasicMaterial
        color="#d9fbff"
        opacity={0.13}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export function CarModel({ carState, onWindowToggle }) {
  return (
    <group rotation={[0, -0.22, 0]}>
      <RoundedBox
        args={[5.7, 0.76, 2.08]}
        castShadow
        position={[0, 0.72, 0]}
        radius={0.18}
        receiveShadow
        smoothness={8}
      >
        <PaintMaterial />
      </RoundedBox>

      <RoundedBox
        args={[4.65, 0.42, 2.02]}
        castShadow
        position={[-0.25, 1.05, 0]}
        radius={0.16}
        receiveShadow
        smoothness={8}
      >
        <PaintMaterial />
      </RoundedBox>

      <RoundedBox
        args={[1.68, 0.28, 1.92]}
        castShadow
        position={[-1.85, 1.23, 0]}
        radius={0.12}
        receiveShadow
        smoothness={6}
      >
        <PaintMaterial />
      </RoundedBox>

      <RoundedBox
        args={[1.25, 0.28, 1.9]}
        castShadow
        position={[1.88, 1.19, 0]}
        radius={0.12}
        receiveShadow
        smoothness={6}
      >
        <PaintMaterial />
      </RoundedBox>

      <RoundedBox
        args={[2.86, 0.72, 1.76]}
        castShadow
        position={[-0.18, 1.46, 0]}
        radius={0.18}
        receiveShadow
        smoothness={8}
      >
        <meshPhysicalMaterial
          color="#16242b"
          metalness={0.2}
          opacity={0.62}
          roughness={0.2}
          transparent
        />
      </RoundedBox>

      <RoundedBox
        args={[2.1, 0.07, 1.18]}
        position={[-0.18, 1.86, 0]}
        radius={0.06}
        smoothness={4}
      >
        <GlassMaterial color="#0f2028" opacity={0.62} />
      </RoundedBox>

      <RoundedBox
        args={[0.09, 0.58, 1.48]}
        position={[-1.74, 1.48, 0]}
        radius={0.045}
        rotation={[0, 0, -0.3]}
        smoothness={4}
      >
        <GlassMaterial opacity={0.5} />
      </RoundedBox>

      <RoundedBox
        args={[0.09, 0.56, 1.42]}
        position={[1.36, 1.45, 0]}
        radius={0.045}
        rotation={[0, 0, 0.28]}
        smoothness={4}
      >
        <GlassMaterial opacity={0.42} />
      </RoundedBox>

      {sideWindowConfig.map((windowConfig) => (
        <SideWindow
          key={windowConfig.id}
          id={windowConfig.id}
          isOpen={carState.windows[windowConfig.id]}
          onWindowToggle={onWindowToggle}
          x={windowConfig.x}
          z={windowConfig.z}
        />
      ))}

      {[1, -1].map((side) => (
        <group key={side}>
          <DoorOutline side={side} startX={-1.28} endX={0.1} />
          <DoorOutline side={side} startX={0.1} endX={1.45} />
          <WheelArch side={side} x={-1.98} />
          <WheelArch side={side} x={1.92} />
          <HeadLight lightsOn={carState.lightsOn} side={side} />
          <TailLight lightsOn={carState.lightsOn} side={side} />
          <RoundedBox
            args={[0.28, 0.12, 0.16]}
            position={[-1.28, 1.35, side * 1.18]}
            radius={0.04}
            smoothness={4}
          >
            <PaintMaterial />
          </RoundedBox>
          <RoundedBox
            args={[1.7, 0.08, 0.05]}
            position={[-0.18, 1.14, side * 1.09]}
            radius={0.025}
            smoothness={4}
          >
            <meshStandardMaterial color="#5eead4" emissive="#123b38" />
          </RoundedBox>
        </group>
      ))}

      <RoundedBox
        args={[0.18, 0.34, 1.72]}
        castShadow
        position={[-2.86, 0.66, 0]}
        radius={0.07}
        receiveShadow
        smoothness={5}
      >
        <DarkTrimMaterial />
      </RoundedBox>

      <RoundedBox
        args={[0.18, 0.34, 1.72]}
        castShadow
        position={[2.86, 0.66, 0]}
        radius={0.07}
        receiveShadow
        smoothness={5}
      >
        <DarkTrimMaterial />
      </RoundedBox>

      <RoundedBox
        args={[4.75, 0.14, 2.16]}
        castShadow
        position={[-0.08, 0.36, 0]}
        radius={0.08}
        receiveShadow
        smoothness={4}
      >
        <DarkTrimMaterial />
      </RoundedBox>

      <Wheel x={-1.98} z={1.16} />
      <Wheel x={1.92} z={1.16} />
      <Wheel x={-1.98} z={-1.16} />
      <Wheel x={1.92} z={-1.16} />

      <FrontLightBeam lightsOn={carState.lightsOn} />
    </group>
  )
}
