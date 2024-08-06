import Joi from "joi";

const validationBody = {
    body: Joi.object({
        accounts: Joi.array().items(
            Joi.string().uri().required()
        ),
        symbol: Joi.string().required(),
        interval: Joi.number().integer().min(1).max(60).required()
    }).required(),
}

export default validationBody;