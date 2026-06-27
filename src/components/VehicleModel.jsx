import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { CarModel as GeometryCarModel } from './CarModel.jsx'

const NIO_ET7_MODEL_URL = `${import.meta.env.BASE_URL}models/nio-et7/scene.gltf`
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

    async function checkModel() {
      try {
        const response = await fetch(NIO_ET7_MODEL_URL, {
          cache: 'no-store',
        })
        const text = await response.text()
        const looksLikeGltf =
          text.trimStart().startsWith('{') &&
          text.includes('"asset"')

        if (!cancelled) {
          setStatus(response.ok && looksLikeGltf ? 'available' : 'missing')
        }
      } catch {
        if (!cancelled) {
          setStatus('missing')
        }
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
