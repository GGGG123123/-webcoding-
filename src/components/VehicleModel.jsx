import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { publicAssetUrl } from '../utils/publicAsset.js'
import { CarModel as GeometryCarModel } from './CarModel.jsx'

const NIO_ET7_MODEL_URL = publicAssetUrl('models/nio-et7/scene.gltf')
const NioEt7Model = lazy(() => import('./NioEt7Model.jsx'))

class ModelErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

function useModelAvailability() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false
    const wait = (duration) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, duration)
      })

    async function checkModel() {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch(NIO_ET7_MODEL_URL, {
            cache: 'no-store',
          })
          const text = await response.text()
          const looksLikeGltf =
            response.ok &&
            text.trimStart().startsWith('{') &&
            text.includes('"asset"')

          if (looksLikeGltf) {
            if (!cancelled) {
              setStatus('available')
            }
            return
          }
        } catch {
          // Retry once or twice before falling back to the geometric model.
        }

        if (!cancelled && attempt < 2) {
          await wait(800 * (attempt + 1))
        }
      }

      if (!cancelled) {
        setStatus('missing')
      }
    }

    checkModel()

    return () => {
      cancelled = true
    }
  }, [])

  return status
}

function ModelLoadingFallback({ carState, onDoorToggle, onWindowToggle }) {
  return (
    <>
      <GeometryCarModel
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
      <Html center position={[0, 2.45, 0]}>
        <div className="model-hint">正在加载 NIO ET7 模型</div>
      </Html>
    </>
  )
}

function MissingModelFallback({ carState, onDoorToggle, onWindowToggle }) {
  return (
    <>
      <GeometryCarModel
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
      <Html center position={[0, 2.45, 0]}>
        <div className="model-hint">未检测到 NIO ET7 本地模型，当前使用临时几何车</div>
      </Html>
    </>
  )
}

export function VehicleModel({ carState, onDoorToggle, onWindowToggle }) {
  const modelStatus = useModelAvailability()

  if (modelStatus === 'checking') {
    return (
      <ModelLoadingFallback
        carState={carState}
        onDoorToggle={onDoorToggle}
        onWindowToggle={onWindowToggle}
      />
    )
  }

  if (modelStatus === 'available') {
    return (
      <ModelErrorBoundary
        fallback={
          <MissingModelFallback
            carState={carState}
            onDoorToggle={onDoorToggle}
            onWindowToggle={onWindowToggle}
          />
        }
      >
        <Suspense
          fallback={
            <ModelLoadingFallback
              carState={carState}
              onDoorToggle={onDoorToggle}
              onWindowToggle={onWindowToggle}
            />
          }
          >
          <NioEt7Model
            carState={carState}
            modelUrl={NIO_ET7_MODEL_URL}
            onDoorToggle={onDoorToggle}
            onWindowToggle={onWindowToggle}
          />
        </Suspense>
      </ModelErrorBoundary>
    )
  }

  return (
    <MissingModelFallback
      carState={carState}
      onDoorToggle={onDoorToggle}
      onWindowToggle={onWindowToggle}
    />
  )
}
