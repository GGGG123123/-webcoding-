import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, MicOff, Radio, Sparkles } from 'lucide-react'

const positionMap = [
  { id: 'frontLeft', label: '左前', patterns: ['左前', '主驾', '驾驶位', '司机'] },
  { id: 'frontRight', label: '右前', patterns: ['右前', '副驾', '副驾驶'] },
  { id: 'rearLeft', label: '左后', patterns: ['左后'] },
  { id: 'rearRight', label: '右后', patterns: ['右后'] },
]

const examples = [
  '打开车灯',
  '关闭所有车窗',
  '打开左前车门',
  '关闭右前车窗',
]

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

function normalizeCommand(text) {
  return text
    .replaceAll(/\s+/g, '')
    .replaceAll('把', '')
    .replaceAll('请', '')
    .replaceAll('一下', '')
}

function getAction(command) {
  if (/(打开|开启|升起|开)/.test(command)) {
    return true
  }

  if (/(关闭|关上|关掉|降下|关)/.test(command)) {
    return false
  }

  return null
}

function getPosition(command) {
  if (/(全部|所有|全车)/.test(command)) {
    return 'all'
  }

  return positionMap.find(({ patterns }) =>
    patterns.some((pattern) => command.includes(pattern)),
  )?.id
}

function describePosition(positionId) {
  if (positionId === 'all') {
    return '所有'
  }

  return positionMap.find(({ id }) => id === positionId)?.label ?? ''
}

function parseVoiceCommand(text) {
  const command = normalizeCommand(text)
  const action = getAction(command)

  if (action === null) {
    return {
      error: '没有识别到打开或关闭动作',
    }
  }

  if (/(灯|大灯|车灯|灯光)/.test(command)) {
    return {
      action,
      label: `${action ? '打开' : '关闭'}车灯`,
      target: 'lights',
    }
  }

  if (/(车窗|窗户|窗)/.test(command)) {
    const position = getPosition(command) ?? 'all'
    return {
      action,
      label: `${action ? '打开' : '关闭'}${describePosition(position)}车窗`,
      position,
      target: 'window',
    }
  }

  if (/(车门|门)/.test(command)) {
    const position = getPosition(command) ?? 'all'
    return {
      action,
      label: `${action ? '打开' : '关闭'}${describePosition(position)}车门`,
      position,
      target: 'door',
    }
  }

  return {
    error: '暂时只支持车灯、车窗、车门控制',
  }
}

function executeCommand(command, handlers) {
  if (command.error) {
    return command.error
  }

  if (command.target === 'lights') {
    handlers.onLightsSet(command.action)
    return `已执行：${command.label}`
  }

  if (command.target === 'door') {
    if (command.position === 'all') {
      handlers.onAllDoorsSet(command.action)
    } else {
      handlers.onDoorSet(command.position, command.action)
    }
    return `已执行：${command.label}`
  }

  if (command.target === 'window') {
    if (command.position === 'all') {
      handlers.onAllWindowsSet(command.action)
    } else {
      handlers.onWindowSet(command.position, command.action)
    }
    return `已执行：${command.label}`
  }

  return '命令未执行'
}

export function VoiceControlPanel({
  carState,
  onAllDoorsSet,
  onAllWindowsSet,
  onDoorSet,
  onLightsSet,
  onWindowSet,
}) {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [liveText, setLiveText] = useState('点击麦克风后说出车控指令')
  const [lastResult, setLastResult] = useState('等待语音输入')

  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return Boolean(getSpeechRecognition())
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  function handleRecognizedText(text) {
    const parsedCommand = parseVoiceCommand(text)
    const result = executeCommand(parsedCommand, {
      onAllDoorsSet,
      onAllWindowsSet,
      onDoorSet,
      onLightsSet,
      onWindowSet,
    })

    setLiveText(text)
    setLastResult(result)
  }

  function toggleListening() {
    if (!isSupported) {
      setLastResult('当前浏览器不支持语音识别，可以换 Chrome 测试')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = getSpeechRecognition()
    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsListening(true)
      setLastResult('正在聆听...')
    }

    recognition.onresult = (event) => {
      let interimText = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const transcript = result[0].transcript.trim()

        if (result.isFinal) {
          handleRecognizedText(transcript)
        } else {
          interimText += transcript
        }
      }

      if (interimText) {
        setLiveText(interimText)
      }
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      setLastResult(
        event.error === 'not-allowed'
          ? '麦克风权限未开启'
          : '语音识别暂时不可用',
      )
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <aside className="glass-panel voice-control-panel" aria-label="语音控制面板">
      <div className="panel-title-row">
        <div>
          <p className="panel-kicker">Voice Control</p>
          <h2>语音控制</h2>
        </div>
        <Radio size={21} />
      </div>

      <button
        className={`voice-mic-button ${isListening ? 'is-listening' : ''}`}
        type="button"
        onClick={toggleListening}
      >
        {isListening ? <MicOff size={26} /> : <Mic size={26} />}
        <span>{isListening ? '停止聆听' : '开始语音控制'}</span>
      </button>

      <div className="voice-live-card" aria-live="polite">
        <span>识别内容</span>
        <strong>{liveText}</strong>
      </div>

      <div className="voice-result-card">
        <Sparkles size={15} />
        <span>{lastResult}</span>
      </div>

      <div className="voice-state-grid">
        <div>
          <span>车灯</span>
          <strong>{carState.lightsOn ? '开启' : '关闭'}</strong>
        </div>
        <div>
          <span>车门</span>
          <strong>{Object.values(carState.doors).filter(Boolean).length}/4</strong>
        </div>
        <div>
          <span>车窗</span>
          <strong>{Object.values(carState.windows).filter(Boolean).length}/4</strong>
        </div>
      </div>

      <div className="voice-examples">
        <span>可说</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => handleRecognizedText(example)}
          >
            {example}
          </button>
        ))}
      </div>
    </aside>
  )
}
