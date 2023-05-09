import { useEffect, useState } from 'react'
import { createTale } from './utils/oai'

interface ITypingText {
  children: string
  cutAmount?: number
  typingSpeed?: number
}

function TypingText(props: ITypingText) {
  const [isTyping, setIsTyping] = useState(false)
  const [text, setText] = useState('')
  const [textArray, setTextArray] = useState<Array<string>>([])
  const cutAmount = props.cutAmount || 1
  const speed = props.typingSpeed || 50

  useEffect(() => {
    if (!isTyping && text === '') {
      setIsTyping(true)
      setTextArray(props.children.split(''))
    }
  }, [props.children])

  useEffect(() => {
    if (isTyping) {
      typingAnimation()
    }
  }, [textArray, isTyping, text])

  function typingAnimation() {
    const _textArray = textArray

    setTimeout(() => {
      if (textArray.length > 0) {
        const t = _textArray.splice(0, cutAmount).join('')

        setText(prevText =>  prevText.concat(t))
        setTextArray(_textArray)
      } else {
        setIsTyping(false)
      }
    }, speed)
  }

  return (
    <>{text}</>
  )
}

// App

function App() {
  const [request, setRequest] = useState('')
  const [tale, setTale] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMount, setIsMount] = useState(false)

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
    try {
      const responseTale = await createTale(request)
      setTale(responseTale)
    } catch (e: any) {
      console.log(e)
      setError(e)
      setTale('')
      setIsLoading(false)
    }
  }


  // หมี ไปสอบ IELTS

  return (
    <>
      <div className="flex flex-col justify-center h-full px-4">
        <div>
          <h1 className="text-center text-7xl font-bold">GPT! Tell me the story</h1>
        </div>

        <div className={`text-center delay-500 duration-1000 transition-all ${isMount ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-2xl"><TypingText>Ok my  dear, what kind of story do you want to hear?</TypingText></p>
        </div>

        <div className={`transition-all duration-1000 w-full ${isLoading ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className={`w-full text-center mt-12 transition-all duration-1000 delay-1000 ${isMount ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xl">I would like to hear the story about...</p>
            <div className="mt-2">
              <input type="text" className="px-2 py-2 rounded-l-md bg-black/20 text-xl" onChange={e => setRequest(e.target.value)} />
              <button className="px-2 py-2 bg-amber-800 rounded-r-md text-xl" onClick={submit}>Tell me!</button>
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
            <div className={`mt-8 text-center mx-auto lg:w-2/3 p-4 rounded-md ${error !== null ? 'bg-red-500/25' : 'bg-white/10'}`}>

              <p className="text-xl text-red-300 my-2">
                {error !== null && <TypingText typingSpeed={25} cutAmount={5}>{error}</TypingText>}
              </p>

              <p className="text-xl">
                <TypingText cutAmount={3}>{tale}</TypingText>
              </p>
            </div>
          )
        }
      </div>
    </>
  )
}

export default App
