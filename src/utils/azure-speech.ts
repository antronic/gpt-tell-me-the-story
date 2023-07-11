import { SpeechConfig, SpeechSynthesizer, AudioConfig, SpeakerAudioDestination, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk'
const subscriptionKey = import.meta.env.VITE_AZ_SPEECH_KEY || ''
const serviceRegion = 'southeastasia'

export const getRecognizer = () => {
  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion)
  speechConfig.speechRecognitionLanguage = 'th-TH'

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
  console.log('audioConfig', audioConfig)
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig)

  return recognizer
}

const audio = new Audio()
export async function speak(message: string) {
  // speak out to speaker
  const speechConfig = SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion,
  )
  speechConfig.speechSynthesisLanguage = 'th-TH'
  // speechConfig.speechSynthesisVoiceName = 'th-TH-AcharaNeural'

  const player = new SpeakerAudioDestination()
  // const audioConfig = AudioConfig.fromDefaultSpeakerOutput(player)
  const audioConfig = AudioConfig.fromSpeakerOutput(player)

  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig)
  synthesizer.speakTextAsync(
    message,
    onSpeechSynthesized
  )

  player.resume()

}

function onSpeechSynthesized(result: any) {
  audio.src = URL.createObjectURL(result.audioData)
  audio.volume = 1.0
  audio.play()
}

function stopSpeak() {
  audio.pause()
  audio.currentTime = 0
}

// export function useVoice () {
//   return {
//     speak,
//     stopSpeak,
//   }
// }