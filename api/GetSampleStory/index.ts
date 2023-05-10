import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { faker } from '@faker-js/faker'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const lang = req.query.lang || (req.body && req.body.lang) || 'th'
    // faker.setLocale(lang)

    const animalType = faker.animal.type()
    const adj = faker.word.adjective()
    const color = faker.color.human()

    let responseMessage = ''

    responseMessage = `${adj} ${color} ${animalType}`
    if (lang === 'th') {
        responseMessage += ' เป็นภาษาไทย'
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;