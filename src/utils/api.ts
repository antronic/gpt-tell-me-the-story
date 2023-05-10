import axios from 'axios'
export async function getSampleTaleRequest(lang = 'th') {
  // const url = '/api/GetSampleStory'
  const url = 'https://lively-mushroom-0a862b200.3.azurestaticapps.net/api/GetSampleStory'

  const response = await axios.post(url, {
        lang,
    }, {
    headers: {
        // 'api-key': OaiApiKey,
        'Content-Type': 'application/json',
    },
  }).catch((error) => {
    throw error.response.data.error.message
  })

  return response.data.body
}