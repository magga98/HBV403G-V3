import { NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import xss from 'xss';
/**
 * Checks to see if there are validation errors or returns next middlware if not.
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @param {function} next Next middleware
 * @returns Next middleware or validation errors.
 */

export function validationCheck(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const validation = validationResult(req);
    if (!validation.isEmpty()){
        const errors = validation.array();
        const notFoundError = errors.find((error) => error.msg === 'not found');
        const serverError = error.find((error) => error.msg === 'server error');

        let status = 400;

        if (serverError) {
            status = 500;
        } else if (notFoundError) {
            status = 404;
        }

        return res.status(status).json({ errors });
    }

    return next();
}

export function atLeastOneBodyValueValidator(fields: Array<string>) {
    return body().custom(async (value, { req }) => {
        const { body: reqBody } = req;

        let valid = false;

        for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];

        if (field in reqBody && reqBody[field] != null) {
            valid = true;
            break;
        }
        }

        if (!valid) {
        return Promise.reject(
            new Error(`require at least one value of: ${fields.join(', ')}`)
        );
        }
        return Promise.resolve();
    });
}
