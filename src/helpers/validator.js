export const buildValidators = ({ label = null, validators, translate = () => { }, validations = {}, messages = {}, values = {} }) => {
    validators = validators.map((validator) => {
        if (typeof validator === 'string') {
            const
                validation = validations[validator],
                message = messages[validator];

            return [v => validation(v, { values }), translate(message, { label })];
        }

        if (!Array.isArray(validator)) throw new Error(`The \`${JSON.stringify(validator)}\` validator is invalid!`);

        let [validation, ...rest] = validator;

        let message = null;
        let args = {};

        if (typeof rest[0] !== 'string') {
            args = rest[0];
            message = rest[1] ? rest[1] : null;
        } else {
            message = rest[0];
        }

        if (typeof validation === 'string' && !message) message = messages[validation];
        if (typeof validation === 'string') validation = validations[validation];
        if (typeof validation !== 'function') throw new Error(`The validation \`${JSON.stringify(validation)}\` must be a function!`);
        if (message && typeof message !== 'string') throw new Error(`The message \`${JSON.stringify(validation)}\` must be of type string!`);

        return [(v) => validation(v, { values, ...args }), translate(message, { label, ...args })];
    });

    return validators;
}

export const getErrorsFromValidationResult = (validationResult) => {
    return Object.keys(validationResult).reduce((errors, field) => {
        return validationResult[field] !== true
            ? { ...errors, [field]: validationResult[field] }
            : errors
    }, {})
}