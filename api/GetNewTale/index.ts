import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'

async function requestForCompletion(userInput: string) {
    const OaiApiKey = process.env.OAI_API_KEY || 'NOT_FOUND'
    const MAX_TOKEN = 1000

    const url = 'https://jirachai-openai.openai.azure.com/openai/deployments/chatgpt-turbo-001/chat/completions?api-version=2023-03-15-preview'
    const prompts = [
        {
            role: 'system',
            content: 'You are a story teller and tales author. You write stories and tales for children. You write in a friendly yet professional tone but can tailor your writing style that best works for a user-specified audience. If you do not know the answer to a question, respond by saying "I do not know the answer to your question, I am just a story teller." in the input language. With total token not over than ' + MAX_TOKEN + ' tokens'
        }
    ]

    prompts.push({
        role: 'user',
        content: userInput,
    })

    const response = await axios.post(url, {
            messages: JSON.stringify(prompts),
            max_tokens: 1000,
            temperature: 1,
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
        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    console.log(error.config)
    })

    return response
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // const responseMessage = faker.name.fullName()
    const inputMessage = 'หมูน้อย'
    const responseMessage = await requestForCompletion(inputMessage)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

}

export default httpTrigger