import { useEffect, useState } from 'react'
import { createTale } from './utils/oai'

interface ITypingText {
  children: string
  cutAmount?: number
}

function TypingText(props: ITypingText) {
  const [isTyping, setIsTyping] = useState(false)
  const [text, setText] = useState('')
  const [textArray, setTextArray] = useState<Array<string>>([])

  useEffect(() => {
    if (!isTyping || text === '') {
      setIsTyping(true)
      setTextArray(props.children.split(''))
    }
  }, [props.children])

  useEffect(() => {
    if (isTyping) {
      typingAnimation()
    }
  }, [textArray, isTyping, text])

  function typingAnimation(speed = 50, cutAmount = 1) {
    const _textArray = textArray

    setTimeout(() => {
      if (textArray.length > 0) {
        const t = _textArray.splice(0, cutAmount)

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

function App() {
  const [response, setResponse] = useState('')
  const [request, setRequest] = useState('')
  const [tale, setTale] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [tale])

  async function submit() {
    setIsLoading(true)
    try {
      const responseTale = await createTale(request)
      setTale(responseTale)
    } catch (e) {
      console.log(e)
      setError(e)
      setTale('')
      setIsLoading(false)
    }
  }

  async function trySubmit() {
    setTale('')
    setError(null)
    setResponse(request)
  }

  // หมี ไปสอบ IELTS

  return (
    <>
      <div className="flex flex-col justify-center h-full px-4">
        <div>
          <h1 className="text-center font-bold">GPT! Tell me the story</h1>
        </div>

        <div className="text-center">
          <p className="text-xl"><TypingText>Ok my  dear, what kind of story do you want to hear?</TypingText></p>
        </div>

        {
          !isLoading && (
            <div className="w-full text-center mt-4">
              <p className="">I would like to hear the story about...</p>
              <div className="mt-2">
                <input type="text" className="px-2 py-2 rounded-l-md bg-black/20" onChange={e => setRequest(e.target.value)} />
                <button className="px-2 py-2 bg-amber-800 rounded-r-md" onClick={submit}>Tell me!</button>
              </div>
            </div>
          )
        }

        {
          isLoading && (
            <div className="text-center text-xl font-bold animate-pulse my-4">
              <p>Ok, let me think...</p>
            </div>
          )
        }

        {
          !isLoading && (error !== null || tale !== '') && (
            <div className="mt-8 text-center mx-auto lg:w-2/3 bg-white/10 p-4 rounded-md">

              <p className="text-xl text-red-400">
                {error !== null && <TypingText>{error}</TypingText>}
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
