import { useEffect, useState } from 'react'
import Modal from './Modal'

interface IConfigSetProps {
  name: string
  title: string
  onChange: (name: string) => (value: string) => void
  value: string
}

const ConfigSet: React.FunctionComponent<IConfigSetProps> = (props) => {
  return (
    <div className="mb-4">
      <label htmlFor={props.name}>{props.title}:</label>
      <input name={props.name} className="w-full mt-2 rounded-sm px-2 py-1" value={props.value} onChange={(e) => props.onChange(props.name)(e.target.value)}/>
    </div>
  )
}

// Interface Props
interface IProps {
  onClose: () => void
}

// Config Box - Main
const ConfigBox: React.FC<IProps> = (props) => {
  const [isLoad, setIsLoad] = useState(false)

  const [config, _setConfig] = useState<{[key: string]: string}>({ OAI_API_URL: '', OAI_API_KEY: '', AZ_SPEECH_KEY: '' })
  const [manualConfig, setManualConfig] = useState<{[key: string]: string}>({ MIC_DEV_ID: '' })

  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    loadConfig()
    loadAudioDevices()
    setIsLoad(true)
  }, [])

  const setConfig = (name: string) => (value: string) => {
    _setConfig({
      ...config,
      [name]: value,
    })
  }

  const loadConfig = () => {
    const config = localStorage.getItem('TELL_ME_STORY_CONFIG')
    if (config) {
      _setConfig(JSON.parse(config))
    }

    const manualConfig = localStorage.getItem('TELL_ME_STORY_MAN_CONFIG')
    if (manualConfig) {
      setManualConfig(JSON.parse(manualConfig))
    }
  }

  const saveConfig = () => {
    localStorage.setItem('TELL_ME_STORY_CONFIG', JSON.stringify(config))
    localStorage.setItem('TELL_ME_STORY_MAN_CONFIG', JSON.stringify(manualConfig))
    props.onClose()
  }

  // Audio Devices
  const getAudioDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()

    return devices.filter((device) => device.kind === 'audioinput')
  }

  const loadAudioDevices = async () => {
    const devices = await getAudioDevices()
    setAudioDevices(devices)
  }

  return (
    <Modal title="Configuration" onClose={props.onClose}>
      <div>
          {
            Object.keys(config).map((key) => (
              <ConfigSet key={key} name={key} title={key} onChange={setConfig} value={config[key]} />
            ))
          }
        </div>

        <div>
          {/* Microphone selector */}
          <div className="mb-4">
            <label htmlFor="audio-id">Audio input:</label>
            <select
              name="audio-id"
              className="w-full px-2 py-1"
              value={manualConfig.MIC_DEV_ID}
              onChange={(e) => setManualConfig({ ...manualConfig, MIC_DEV_ID: e.target.value })}
            >
              {
                audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="my-2 text-right">
          <button className="rounded-md bg-slate-700 px-4 py-2 mr-2" onClick={props.onClose}>Cancel</button>
          <button className="rounded-md bg-slate-500 px-4 py-2" onClick={saveConfig}>Save</button>
        </div>
    </Modal>
  )
}

export default ConfigBox