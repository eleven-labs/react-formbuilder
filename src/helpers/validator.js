import merge from 'lodash/merge';

import defaultValidations from '../validations';
import ValidatorEn from '../locale/validator.en';
import validatorFr from '../locale/validator.fr';

const defaultMessages = {
    fr: validatorFr,
    en: ValidatorEn
};

export const buildValidators = ({ label, validators, locale = 'en', customValidators: { validations, messages } = {} }) => {
    validations = merge(defaultValidations, validations || {});
    messages = merge(defaultMessages[locale], messages || {});

    validators = validators.map((validator) => {
        if (typeof validator === 'string') {
            const
                validation = validations[validator],
                message = messages[validator];

            return [validation, typeof message === 'function' && label ? message(label) : message];
        }

        if (!Array.isArray(validator)) throw new Error(`The \`${JSON.stringify(validator)}\` validator is invalid!`);

        let [validation, message] = validator;
        if (typeof validation === 'string') validator[0] = validations[validation];
        if (typeof validation !== 'function') throw new Error(`The validation \`${JSON.stringify(validation)}\` must be a function!`);
        if (message && typeof message !== 'string') throw new Error(`The message \`${JSON.stringify(validation)}\` must be of type string!`);

        return validator;
    });

    return validators;
}

export const getErrorsFromValidationResult = (validationResult) => {
    const FIRST_ERROR = 0;
    return Object.keys(validationResult).reduce((errors, field) => {
        return validationResult[field] !== true
            ? { ...errors, [field]: validationResult[field][FIRST_ERROR] }
            : errors
    }, {})
}