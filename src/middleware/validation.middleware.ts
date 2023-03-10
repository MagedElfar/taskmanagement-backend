import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { setError } from "../utils/error-format";

export default function (schema: Joi.ObjectSchema, type = "body") {

    let reqType;

    return (req: Request, res: Response, next: NextFunction) => {

        switch (type) {
            case "query":
                reqType = req.query;
                break;

            case "param":
                reqType = req.params;
                break;

            case "body":
            default:
                reqType = req.body

        }

        const schemaErr = schema.validate(reqType, {
            abortEarly: false,
        })


        if (schemaErr.error) {
            return next(setError(400, schemaErr.error?.message.split(". ")))
        }

        next()
    }

}