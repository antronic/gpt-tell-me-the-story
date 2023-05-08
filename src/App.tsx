import { useEffect, useState } from 'react'
import { createTale } from './utils/oai'

function App() {
  const [greeting, setGreeting] = useState('')
  const [response, setResponse] = useState('')
  const [request, setRequest] = useState('')
  const [tale, setTale] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    typingAnimation('Ok my  dear, what kind of story do you want to hear?', setGreeting)
  }, [])

  useEffect(() => {
    if (response !== '') {
      typingAnimation(response, setTale, 100)
    }
  }, [response])

  useEffect(() => {
    setIsLoading(false)
  }, [tale])

  function typingAnimation(text: string, setText: React.Dispatch<React.SetStateAction<string>>, speed = 50) {
    const textArray = text.split('')

    const typing = setInterval(() => {
      if (textArray.length - 1 > 0) {
        setText((prevText) => {
          return prevText + '' + textArray.shift()
        })
      } else {
        clearInterval(typing)
      }
    }, speed)
  }

  async function submit() {
    setIsLoading(true)
    const responseTale = await createTale(request)
    // if (responseTale) {
    //   setResponse(responseTale)
    // }
    setTale(responseTale)
  }

  async function trySubmit() {
    setResponse(request)
  }

  return (
    <>
      <div className="flex flex-col justify-center h-full px-4">
        <div>
          <h1 className="text-center font-bold">GPT! Tell me the story</h1>
        </div>

        <div className="text-center">
          <p className="text-xl">{greeting}</p>
        </div>

        <div className="w-full text-center mt-4">
          <p className="">I would like to hear the story about...</p>
          <div className="mt-2">
            <input type="text" className="px-2 py-2 rounded-l-md" onChange={e => setRequest(e.target.value)} />
            <button className="px-2 py-2 bg-amber-800 rounded-r-md" onClick={submit}>Tell me!</button>
          </div>
          {/* <button className="px-2 py-2 bg-amber-800" onClick={trySubmit}>Try me!</button> */}
        </div>

        {
          isLoading && (
            <div className="text-center text-xl animate-pulse">
              <p>Ok, let me think...</p>
            </div>
          )
        }

        <div className="mt-4 text-center">
          <p className="text-xl">{tale}</p>
        </div>
      </div>
    </>
  )
}

export default App
