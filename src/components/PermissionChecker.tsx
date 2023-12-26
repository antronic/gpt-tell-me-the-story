import { useCallback, useEffect, useState } from 'react'
import Modal from './Modal'

interface IProps {
  onClose: () => void
}

const PermissionChecker: React.FC<IProps> = (props) => {
  const [permissions, setPermissions] = useState({ microphone: false, speech_key: false, oai_api_key: false, oai_api_url: false })

  const checkMicrophonePermission = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      return ({ microphone: true })
    }

    return ({ microphone: false })
  }

  const checkApiRequirements = () => {
    const config = localStorage.getItem('TELL_ME_STORY_CONFIG')

    if (config) {
      const { OAI_API_URL, OAI_API_KEY, AZ_SPEECH_KEY } = JSON.parse(config)

      const isUrl = (url: string) => {
        try {
          new URL(url)
          return true
        } catch (e) {
          return false
        }
      }

      return {
        oai_api_key: OAI_API_KEY !== '',
        oai_api_url: OAI_API_URL !== '' && isUrl(OAI_API_URL),
        speech_key: AZ_SPEECH_KEY !== '',
      }
    }
  }

  const checkRequirements = useCallback(async () => {
    setPermissions({
      ...permissions,
      ...(await checkMicrophonePermission()),
      ...checkApiRequirements(),
    })
  }, [permissions])

  useEffect(() => {
    checkRequirements()
  }, [])

  const getValue = (value: boolean, resolver?: () => void) => {
    if (value) {
      return <span className="text-green-400">Granted</span>
    } else {
      return (
        <>
          <span className="text-red-400">Denied</span>
          {resolver && typeof resolver === 'function' && <button className="rounded-md bg-slate-700 px-4 py-2 ml-2" onClick={resolver}>Grant</button>}
        </>
      )
    }
  }

  const requestMicrophoneAccess = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <Modal title="Requirements Checker" onClose={props.onClose}>
      <div className="my-2">
        <p>Microphone Access: {getValue(permissions.microphone, requestMicrophoneAccess)}</p>

        <h2 className="text-lg font-bold mt-2">Azure Open AI</h2>
        <p>Azure Open AI API key: {getValue(permissions.oai_api_key)}</p>
        <p>Azure Open AI API Endpoint: {getValue(permissions.oai_api_url)}</p>
      </div>

      <div className="my-2 text-right">
          <button className="rounded-md bg-slate-700 px-4 py-2 mr-2" onClick={props.onClose}>Close</button>
        </div>
    </Modal>
  )
}

export default PermissionChecker