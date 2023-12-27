import axios from 'axios'

export async function createTale(userInput: string) {
  const config = JSON.parse(localStorage.getItem('TELL_ME_STORY_CONFIG') || '{}')
  const OaiApiKey = config.OAI_API_KEY || ''
  const OaiApiURL = config.OAI_API_URL || ''
  const MAX_TOKEN = 1000

  const prompts = [
    {
      role: 'system',
      // content: 'You are a story teller and tales author. You write stories and tales for children. You write in a friendly yet professional tone but can tailor your writing style that best works for a user-specified audience. If you do not know the answer to a question, respond by saying "I do not know the answer to your question, I am just a story teller.". With total token not over than ' + MAX_TOKEN + ' tokens. And please answer in the input language'
      content: 'You are a story teller and tales author. You write stories and tales for adult and children. You write in a friendly yet professional tone but can tailor your writing style that best works for a user-specified audience and provide a smooth ending. If you do not know the answer to a question, respond by saying "I do not know the answer to your question, I am just a story teller.". With total token not over than ' + MAX_TOKEN + ' tokens. And please answer in the input language'
      // content: 'You are a consultant and you have to explain the technical term for general people who do not know about technical to understand easier. Please response in input language'
    }
  ]

  prompts.push({
    role: 'user',
    content: userInput,
  })

  const response = await axios.post(OaiApiURL, {
      messages: prompts,
      max_tokens: 1000,
      temperature: 1.8,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stop: null
    }, {
    headers: {
      'api-key': OaiApiKey,
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    throw error.response.data.error
  })

  return response.data.choices[0].message.content
}