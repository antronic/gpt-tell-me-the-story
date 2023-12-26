import { useEffect, useState } from 'react'

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

export default TypingText