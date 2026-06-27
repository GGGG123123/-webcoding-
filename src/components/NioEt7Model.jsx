import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import {
  AdditiveBlending,
  Box3,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix4,
  Object3D,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three'

const MODEL_TARGET_LENGTH = 6.2

const WINDOW_DROP_DISTANCE = 0.0135
const WINDOW_CLOSED_OPACITY = 0.78
const WINDOW_OPEN_OPACITY = 0.01
const FIXED_GLASS_OPACITY = 0.54

const doorGlassNames = {
  frontLeft: 'DoorGlass_LF_windows_0',
  frontRight: 'DoorGlass_RF_windows_0',
  rearLeft: 'DoorGlass_LB_windows_0',
  rearRight: 'DoorGlass_RB_windows_0',
}

const doorNodeNames = {
  frontLeft: 'Door_LF',
  frontRight: 'Door_RF',
  rearLeft: 'Door_LB',
  rearRight: 'Door_RB',
}

const doorOpenAngles = {
  frontLeft: -0.82,
  frontRight: 0.82,
  rearLeft: -0.72,
  rearRight: 0.72,
}

const doorRotationAxis = new Vector3(0, 1, 0)

const rightSideDoors = new Set(['frontRight', 'rearRight'])

const closedDoors = {
  frontLeft: false,
  frontRight: false,
  rearLeft: false,
  rearRight: false,
}

const closedWindows = {
  frontLeft: false,
  frontRight: false,
  rearLeft: false,
  rearRight: false,
}

const lightMaterialProfiles = {
  Light: {
    color: '#e8fbff',
    offIntensity: 0.04,
    onIntensity: 4.8,
    tintBaseColor: true,
  },
  Light_Emiss: {
    color: '#e8fbff',
    offIntensity: 0.1,
    onIntensity: 9.2,
    tintBaseColor: true,
  },
  Light_glass: {
    color: '#d9f8ff',
    forceTransparent: true,
    offIntensity: 0.02,
    onIntensity: 3,
    onOpacity: 0.42,
    tintBaseColor: true,
  },
  Light_CH: {
    color: '#7cf5ff',
    offIntensity: 0.06,
    onIntensity: 3.5,
    tintBaseColor: true,
  },
  Red_Metal: {
    color: '#ff2f22',
    offIntensity: 0.03,
    onIntensity: 2.8,
  },
  Red_Reflector: {
    color: '#ff2f22',
    offIntensity: 0.03,
    onIntensity: 3.4,
    tintBaseColor: true,
  },
  red_emiss: {
    color: '#ff3a2d',
    offIntensity: 0.08,
    onIntensity: 6.4,
    tintBaseColor: true,
  },
}

const glassMaterialNames = new Set(['windows', 'D_glass'])

const frontLightPositions = [
  [-0.82, 0.95, 2.7],
  [0.82, 0.95, 2.7],
]

const frontLightTargets = [
  [-0.62, 0.34, 5.35],
  [0.62, 0.34, 5.35],
]

const rearLightPositions = [
  [-0.78, 1.12, -2.98],
  [0.78, 1.12, -2.98],
]

function forEachMaterial(material, callback) {
  if (Array.isArray(material)) {
    material.forEach(callback)
    return
  }

  if (material) {
    callback(material)
  }
}

function improveTextureQuality(material) {
  const textureKeys = [
    'map',
    'emissiveMap',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
  ]

  textureKeys.forEach((textureKey) => {
    const texture = material[textureKey]

    if (!texture) {
      return
    }

    texture.anisotropy = 16
    texture.magFilter = LinearFilter
    texture.minFilter = LinearMipmapLinearFilter
    texture.needsUpdate = true

    if (textureKey === 'map' || textureKey === 'emissiveMap') {
      texture.colorSpace = SRGBColorSpace
    }
  })
}

function configureGlassMaterial(material, opacity = WINDOW_CLOSED_OPACITY) {
  material.transparent = true
  material.opacity = opacity
  material.depthWrite = false
  material.side = DoubleSide
  material.roughness = 0.02
  material.metalness = 0.12
  material.envMapIntensity = 1.9
  material.needsUpdate = true

  if (material.color) {
    material.color.set('#061115')
  }
}

function configureCarPaintMaterial(material) {
  material.vertexColors = false
  material.color.set('#8ec7e8')
  material.clearcoat = 0.72
  material.clearcoatRoughness = 0.14
  material.envMapIntensity = 0.92
  material.metalness = 0.12
  material.roughness = 0.3
  material.needsUpdate = true
}

function cleanCarPaintGeometry(geometry) {
  if (!geometry) {
    return geometry
  }

  if (geometry.hasAttribute('color')) {
    geometry.deleteAttribute('color')
  }

  geometry.computeVertexNormals()
  geometry.normalizeNormals()

  return geometry
}

function configureLightMaterial(material, materialName) {
  const profile = lightMaterialProfiles[materialName]

  if (!profile) {
    return false
  }

  material.userData.lightProfile = profile
  material.userData.lightBase = {
    color: material.color?.clone(),
    emissive: material.emissive?.clone(),
    emissiveIntensity: material.emissiveIntensity ?? 0,
    opacity: material.opacity ?? 1,
    transparent: material.transparent,
  }

  if (profile.forceTransparent) {
    material.transparent = true
    material.depthWrite = false
  }

  material.needsUpdate = true
  return true
}

function getObjectLocalBox(object) {
  object.updateWorldMatrix(true, true)

  const inverseWorldMatrix = new Matrix4().copy(object.matrixWorld).invert()
  const localBox = new Box3()
  const corner = new Vector3()

  object.traverse((child) => {
    if (!child.isMesh || !child.geometry) {
      return
    }

    child.geometry.computeBoundingBox()

    const { max, min } = child.geometry.boundingBox
    const corners = [
      [min.x, min.y, min.z],
      [min.x, min.y, max.z],
      [min.x, max.y, min.z],
      [min.x, max.y, max.z],
      [max.x, min.y, min.z],
      [max.x, min.y, max.z],
      [max.x, max.y, min.z],
      [max.x, max.y, max.z],
    ]

    corners.forEach(([x, y, z]) => {
      corner
        .set(x, y, z)
        .applyMatrix4(child.matrixWorld)
        .applyMatrix4(inverseWorldMatrix)
      localBox.expandByPoint(corner)
    })
  })

  return localBox
}

function getDoorHingeOffset(object, doorId) {
  const localBox = getObjectLocalBox(object)
  const center = new Vector3()

  if (localBox.isEmpty()) {
    return center
  }

  localBox.getCenter(center)
  center.x = rightSideDoors.has(doorId) ? localBox.max.x : localBox.min.x

  return center
}

function configureDoorNode(object, doorId) {
  const parent = object.parent

  if (!parent) {
    return
  }

  const hingeOffset = getDoorHingeOffset(object, doorId)
  const pivot = new Object3D()

  pivot.name = `${object.name}_HingePivot`
  pivot.position.copy(object.position)
  pivot.quaternion.copy(object.quaternion)
  pivot.scale.copy(object.scale)
  pivot.position.add(
    hingeOffset
      .clone()
      .multiply(object.scale)
      .applyQuaternion(object.quaternion),
  )

  parent.add(pivot)
  pivot.add(object)

  object.position.copy(hingeOffset).multiplyScalar(-1)
  object.quaternion.identity()
  object.scale.set(1, 1, 1)

  const openRotation = new Quaternion().setFromAxisAngle(
    doorRotationAxis,
    doorOpenAngles[doorId],
  )

  pivot.userData.doorId = doorId
  pivot.userData.closedQuaternion = pivot.quaternion.clone()
  pivot.userData.openQuaternion = pivot.quaternion.clone().multiply(openRotation)

  object.traverse((child) => {
    if (!child.userData.doorId) {
      child.userData.doorId = doorId
    }
  })
}

function prepareModelScene(scene) {
  const modelScene = scene.clone(true)

  Object.entries(doorNodeNames).forEach(([doorId, nodeName]) => {
    const doorNode = modelScene.getObjectByName(nodeName)

    if (doorNode) {
      configureDoorNode(doorNode, doorId)
    }
  })

  modelScene.traverse((object) => {
    if (!object.isMesh) {
      return
    }

    const materialName = object.material?.name || ''
    const isCarPaintObject = Array.isArray(object.material)
      ? object.material.some((material) => material?.name === 'CarPaint')
      : object.material?.name === 'CarPaint'

    object.castShadow = true
    object.receiveShadow = !isCarPaintObject

    if (object.material) {
      object.material = object.material.clone()
      forEachMaterial(object.material, (material) => {
        const currentMaterialName = material.name || materialName

        material.envMapIntensity = 1.18

        if (currentMaterialName === 'CarPaint') {
          configureCarPaintMaterial(material)
        }

        if (configureLightMaterial(material, currentMaterialName)) {
          object.userData.lightControlled = true
          object.renderOrder = Math.max(object.renderOrder || 0, 2)
        }

        improveTextureQuality(material)
        material.needsUpdate = true
      })
    }

    if (object.geometry) {
      object.geometry = object.geometry.clone()

      if (isCarPaintObject) {
        object.geometry = cleanCarPaintGeometry(object.geometry)
      }
    }

    const windowId = Object.entries(doorGlassNames).find(([, meshName]) =>
      object.name.includes(meshName),
    )?.[0]

    if (windowId) {
      object.userData.windowId = windowId
      object.userData.closedPosition = object.position.clone()
      object.renderOrder = 3

      forEachMaterial(object.material, (material) => {
        configureGlassMaterial(material)
      })
    } else if (glassMaterialNames.has(materialName) && object.material) {
      forEachMaterial(object.material, (material) => {
        configureGlassMaterial(material, FIXED_GLASS_OPACITY)
      })
    }
  })

  modelScene.updateWorldMatrix(true, true)

  const box = new Box3().setFromObject(modelScene)
  const size = new Vector3()
  const center = new Vector3()

  box.getSize(size)
  box.getCenter(center)

  const largestSide = Math.max(size.x, size.y, size.z)
  const modelScale = largestSide > 0 ? MODEL_TARGET_LENGTH / largestSide : 1

  modelScene.position.set(-center.x, -box.min.y, -center.z)

  return {
    modelScale,
    modelScene,
  }
}

function animateWindowState(modelScene, windows) {
  modelScene.traverse((object) => {
    const { closedPosition, windowId } = object.userData

    if (!windowId || !closedPosition) {
      return
    }

    const targetY = windows[windowId]
      ? closedPosition.y - WINDOW_DROP_DISTANCE
      : closedPosition.y
    const nextY = object.position.y + (targetY - object.position.y) * 0.18
    const targetOpacity = windows[windowId]
      ? WINDOW_OPEN_OPACITY
      : WINDOW_CLOSED_OPACITY

    object.position.x = closedPosition.x
    object.position.z = closedPosition.z
    object.position.y = Math.abs(nextY - targetY) < 0.00004 ? targetY : nextY

    forEachMaterial(object.material, (material) => {
      material.opacity += (targetOpacity - material.opacity) * 0.16

      if (Math.abs(material.opacity - targetOpacity) < 0.004) {
        material.opacity = targetOpacity
      }

      material.needsUpdate = true
    })
  })
}

function setWindowStateImmediately(modelScene, windows) {
  modelScene.traverse((object) => {
    const { closedPosition, windowId } = object.userData

    if (!windowId || !closedPosition) {
      return
    }

    object.position.copy(closedPosition)
    object.position.y = windows[windowId]
      ? closedPosition.y - WINDOW_DROP_DISTANCE
      : closedPosition.y

    forEachMaterial(object.material, (material) => {
      material.opacity = windows[windowId]
        ? WINDOW_OPEN_OPACITY
        : WINDOW_CLOSED_OPACITY
      material.needsUpdate = true
    })
  })
}

function applyLightState(modelScene, lightsOn) {
  modelScene.traverse((object) => {
    if (!object.userData.lightControlled || !object.material) {
      return
    }

    forEachMaterial(object.material, (material) => {
      const { lightBase, lightProfile } = material.userData

      if (!lightBase || !lightProfile) {
        return
      }

      if (material.emissive) {
        if (lightsOn) {
          material.emissive.set(lightProfile.color)
        } else if (lightBase.emissive) {
          material.emissive.copy(lightBase.emissive)
        }
      }

      if (material.color && lightProfile.tintBaseColor) {
        if (lightsOn) {
          material.color.set(lightProfile.color)
        } else if (lightBase.color) {
          material.color.copy(lightBase.color)
        }
      }

      material.emissiveIntensity = lightsOn
        ? lightProfile.onIntensity
        : lightProfile.offIntensity

      if (lightProfile.onOpacity !== undefined) {
        material.opacity = lightsOn ? lightProfile.onOpacity : lightBase.opacity
        material.transparent =
          lightsOn || lightBase.transparent || lightProfile.forceTransparent
        material.depthWrite = !material.transparent
      }

      material.needsUpdate = true
    })
  })
}

function animateDoorState(modelScene, doors) {
  modelScene.traverse((object) => {
    const { closedQuaternion, doorId, openQuaternion } = object.userData

    if (!doorId || !closedQuaternion || !openQuaternion) {
      return
    }

    const targetQuaternion = doors?.[doorId] ? openQuaternion : closedQuaternion
    object.quaternion.slerp(targetQuaternion, 0.16)
  })
}

function setDoorStateImmediately(modelScene, doors) {
  modelScene.traverse((object) => {
    const { closedQuaternion, doorId, openQuaternion } = object.userData

    if (!doorId || !closedQuaternion || !openQuaternion) {
      return
    }

    object.quaternion.copy(doors?.[doorId] ? openQuaternion : closedQuaternion)
  })
}

function HeadlightSpot({ position, target }) {
  const spotRef = useRef(null)
  const targetRef = useRef(null)

  useEffect(() => {
    if (!spotRef.current || !targetRef.current) {
      return
    }

    spotRef.current.target = targetRef.current
    targetRef.current.updateMatrixWorld()
  }, [])

  return (
    <>
      <spotLight
        castShadow
        ref={spotRef}
        position={position}
        angle={0.28}
        penumbra={0.86}
        intensity={12}
        distance={7.2}
        decay={1.3}
        color="#d7f8ff"
        shadow-mapSize={[1024, 1024]}
      />
      <object3D ref={targetRef} position={target} />
    </>
  )
}

function HeadlightFanBeam({ position }) {
  return (
    <group position={position}>
      <mesh
        renderOrder={1}
        position={[0, -0.04, 1.48]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1, 1, 0.22]}
      >
        <coneGeometry args={[0.78, 2.96, 40, 1, true]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#c9f5ff"
          depthWrite={false}
          opacity={0.18}
          side={DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh
        renderOrder={1}
        position={[0, -0.18, 1.9]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.38, 1, 0.1]}
      >
        <coneGeometry args={[0.92, 3.1, 40, 1, true]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#8fe8ff"
          depthWrite={false}
          opacity={0.1}
          side={DoubleSide}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  )
}

function CarLightEffects({ lightsOn }) {
  if (!lightsOn) {
    return null
  }

  return (
    <group>
      {frontLightPositions.map((position, index) => (
        <group key={position.join('-')}>
          <HeadlightSpot position={position} target={frontLightTargets[index]} />
          <pointLight
            position={position}
            color="#e9fbff"
            intensity={3.4}
            distance={3.7}
            decay={1.6}
          />
          <HeadlightFanBeam position={position} />
        </group>
      ))}

      {rearLightPositions.map((position) => (
        <group key={position.join('-')}>
          <pointLight
            position={position}
            color="#ff3a2d"
            intensity={2.8}
            distance={2.6}
            decay={1.4}
          />
        </group>
      ))}
    </group>
  )
}

export default function NioEt7Model({
  carState,
  modelUrl,
  onDoorToggle,
  onWindowToggle,
}) {
  const { scene } = useGLTF(modelUrl)
  const { modelScale, modelScene } = useMemo(
    () => prepareModelScene(scene),
    [scene],
  )

  useEffect(() => {
    setDoorStateImmediately(modelScene, closedDoors)
    setWindowStateImmediately(modelScene, closedWindows)
  }, [modelScene])

  useEffect(() => {
    applyLightState(modelScene, carState.lightsOn)
  }, [carState.lightsOn, modelScene])

  useFrame(() => {
    animateDoorState(modelScene, carState.doors)
    animateWindowState(modelScene, carState.windows)
  })

  const handleModelClick = useCallback(
    (event) => {
      const { doorId, windowId } = event.object.userData

      if (windowId && onWindowToggle) {
        event.stopPropagation()
        onWindowToggle(windowId)
        return
      }

      if (doorId && onDoorToggle) {
        event.stopPropagation()
        onDoorToggle(doorId)
      }
    },
    [onDoorToggle, onWindowToggle],
  )

  const handlePointerMove = useCallback((event) => {
    if (event.object.userData.doorId || event.object.userData.windowId) {
      event.stopPropagation()
      document.body.style.cursor = 'pointer'
    }
  }, [])

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = ''
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <group rotation={[0, -0.35, 0]}>
      <CarLightEffects lightsOn={carState.lightsOn} />
      <group scale={modelScale}>
        <primitive
          object={modelScene}
          onClick={handleModelClick}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
        />
      </group>
    </group>
  )
}
