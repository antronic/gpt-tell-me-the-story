import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { faker } from '@faker-js/faker'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const lang = req.query.lang || (req.body && req.body.lang) || 'th'

    const animalType = faker.animal.type()
    const adj = faker.word.adjective()
    const color = faker.color.human()

    let responseMessage = ''

    responseMessage = `${adj} ${color} ${animalType}`
    if (lang === 'th') {
        responseMessage += ' เล่าเป็นภาษาไทย'
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: responseMessage })
    };

};

export default httpTrigger;