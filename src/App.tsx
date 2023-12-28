import { useEffect, useState } from 'react'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk'
import { Icon } from '@iconify/react'


import { createTale } from './utils/oai'
import { getSampleTaleRequest } from './utils/api'
import { getRecognizer, speak } from './utils/azure-speech'

import OpenAiLogo from './assets/OpenAI_Logo.svg'
import ConfigBox from './components/ConfigBox'
import TypingText from './components/TypingText'
import PermissionChecker from './components/PermissionChecker'

// App
function App() {
  const [request, setRequest] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [tale, setTale] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMount, setIsMount] = useState(false)
  const [isListenting, setIsListenting] = useState(false)

  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isPermissionCheckerOpen, setIsPermissionCheckerOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsMount(true)
    }, 10)
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [tale])

  async function submit() {
    setTale('')
    setError(null)
    setIsLoading(true)
    setCurrentPrompt(request)
    try {
      const responseTale = await createTale(request)
      setTale(responseTale)
      readStory(responseTale)
    } catch (e: any) {
      setError(e.message)
      setTale('')
      setIsLoading(false)
    }
  }

  async function getSample() {
    const sample = await getSampleTaleRequest()
    console.log(sample)
    setRequest(sample)
  }

  function onStartToSpeakClick() {
    // Speech to text from Azure Speech
    const recognizer = getRecognizer()
    setIsListenting(true)
    // setInput('Listening...')
    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === ResultReason.RecognizedSpeech) {
        // setListenText(result.text)
        setRequest(result.text)
      }

      setIsListenting(false)
    })
  }

  function readStory(output: string) {
    speak(output)
  }



  return (
    <>
      {isConfigOpen && <ConfigBox onClose={() => setIsConfigOpen(false)}/>}
      {isPermissionCheckerOpen && <PermissionChecker onClose={() => setIsPermissionCheckerOpen(false)}/>}

      <div className="flex flex-col justify-center h-full px-4">
        <div>
          <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-cyan-400">GPT!</span> Tell me the story
          </h1>
        </div>

        <div className={`text-center delay-500 duration-1000 transition-all ${isMount ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-lg md:text-2xl text-slate-400"><TypingText>Ok my  dear, what kind of story do you want to hear?</TypingText></p>
        </div>

        <div className={`transition-all duration-1000 w-full ${isLoading ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className={`w-full text-center mt-12 transition-all duration-1000 delay-1000 ${isMount ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-lg md:text-xl">I would like to hear the story about...</p>

            {/* Input */}
            <div className="mt-2 flex justify-center flex-wrap gap-y-2 gap-x-4 w-full">
              <div>
                <input type="text" className="px-2 py-2 rounded-l-md bg-black/20 text-xl" value={request} onChange={e => setRequest(e.target.value)} />
                <button className="px-2 py-2 bg-cyan-400 hover:bg-cyan-600 text-slate-900 rounded-r-md text-xl" onClick={submit}>Tell me!</button>
              </div>

              {/* Blue button - click to listen */}
              <button
                className={`
                  px-2 py-2 rounded-md text-xl
                  ${isListenting ? 'bg-slate-500' : 'bg-blue-600 hover:bg-blue-700'}
                `}
                onClick={onStartToSpeakClick}
              >
                {
                  isListenting ? 'Listening...' : 'Speak to me'
                }
              </button>

              {/* <button className="px-2 py-2 ml-2 bg-amber-700 hover:bg-amber-800 rounded-md text-xl" onClick={getSample}>Sample</button> */}
            </div>
          </div>
        </div>

        {
          isLoading && (
            <div className="text-center text-4xl font-bold animate-pulse my-4">
              <p>Ok, let me think...</p>
            </div>
          )
        }

        {
          !isLoading && (error !== null || tale !== '') && (
            <div className="mt-8 ">
              <p className="font-bold my-2">Your prompt: {currentPrompt}</p>

              <div className={`text-center mx-auto lg:w-2/3 p-4 rounded-md ${error !== null ? 'bg-red-500/25' : 'bg-white/10'}`}>

                <p className="text-xl text-red-300 my-2">
                  {error !== null && <TypingText typingSpeed={25} cutAmount={5}>{error}</TypingText>}
                </p>

                <p className="text-xl">
                  <TypingText cutAmount={3}>{tale}</TypingText>
                </p>
              </div>
            </div>
          )
        }

        <div className="mx-auto w-1/6 h-[0.25px] mt-8 border-dashed border border-slate-500"></div>

        <div className="flex justify-center my-4">
          <div className="bg-white/5 rounded-lg px-6 py-2">
            <ul className="flex gap-x-4">
              <li className="cursor-pointer underline" onClick={() => setIsConfigOpen(true)}>Configuration</li>
              <li className="cursor-pointer underline" onClick={() => setIsPermissionCheckerOpen(true)}>Requirements checker</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto w-1/6 h-[0.25px] my-4 border-dashed border border-slate-500"></div>

        {/* Credit */}
        <div className="mt-6 flex flex-col justify-center">
          <div className="inline-flex justify-center items-center">
            <p className="inline-block text-sm">Powered by</p>
            <a href="https://azure.microsoft.com/en-us/products/cognitive-services/openai-service">
              <img src={OpenAiLogo} className="h-6 ml-4 inline-block fill-white" alt="" />
            </a>
            <a href="https://language.cognitive.azure.com/" className="ml-2 font-semibold text-slate-100 inline-block hover:underline">
              <img src="./images/MS-Azure_logo_horiz_white_rgb.png" className="h-12 ml-0 inline-block" alt="" />
            </a>
          </div>

          <div className="mt-2 mx-auto text-center text-sm text-slate-400">
            <p className="">
              Code with ☕️ by <a target="_blank" href="https://www.github.com/antronic" className="hover:underline font-semibold">Jirachai C.</a>
            </p>
            <p className="text-xs">
              Built from <a href="https://vitejs.dev/" className="hover:underline">Vite</a> + <a href="https://reactjs.org/" className="hover:underline">React</a> + <a href="https://www.typescriptlang.org/" className="hover:underline">TS</a>
            </p>

            <a href="https://github.com/antronic/gpt-tell-me-the-story" target="_blank" className="mt-2 p-2 text-center inline-block rounded-full hover:bg-black/25 active:bg-white/25">
              <Icon icon="tabler:brand-github-filled" className="inline-block text-xl" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
