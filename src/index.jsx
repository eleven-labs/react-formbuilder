import React from 'react';
import { Formik, FastField } from 'formik';
import { merge, snakeCase, camelCase, capitalize } from 'lodash';
import spected from 'spected';
import formDataToObject from 'form-data-to-object';
import { buildValidators, getErrorsFromValidationResult } from './helpers/validator';
import validations from './validations';

const pascalCase = (string) => capitalize(camelCase(string));

class FormBuilder {

    _fields = {};

    _translate = null;
    _theme = null;
    _initialValues = {};
    _validators = {};
    _validations = validations;
    _validatorsSpec = null;

    static set theme(theme) {
        FormBuilder._defaultTheme = theme;
    }

    static set translate(translate) {
        FormBuilder._defaultTranslate = translate;
    }

    static set validations(validations) {
        FormBuilder._defaultValidations = validations;
    }

    setTheme(theme) {
        this._theme = theme;
        return this;
    }

    setTranslate(translate) {
        this._translate = translate;
        return this;
    }

    setValidations(validations) {
        this._validations = {
            ...this._validations,
            ...validations, Email
        };
        return this;
    }

    createForm() {
        if (!this._theme) {
            if (FormBuilder._defaultTheme) {
                this._theme = FormBuilder._defaultTheme;
            } else {
                throw new Error('The theme is not defined!');
            }
        }

        if (!this._theme.Form) throw new Error('The `Form` component does not exist in the theme you have set up!');
        if (!this._theme.Row) throw new Error('The `Row` component does not exist in the theme you have set up!');
        if (!this._theme.Label) throw new Error('The `Label` component does not exist in the theme you have set up!');

        if (!this._translate) {
            if (FormBuilder._defaultTranslate) {
                this._translate = FormBuilder._defaultTranslate;
            } else {
                throw new Error('The translate is not defined!');
            }
        }

        this._initialValues = {};
        this._fields = {};

        return this;
    }

    _validationMessages() {
        const validationMessages = Object.keys(this._validations)
            .reduce((acc, validationKey) => {
                acc[validationKey] = `form.validators.${snakeCase(validationKey)}`;
                return acc;
            }, {});

        return validationMessages;
    }

    _buildFieldType(name, FieldType, props) {
        return <FastField
            name={name}
            render={({ field, form }) => {
                props = {
                    id: camelCase(name),
                    ...field,
                    ...props,
                    dirty: form.initialValues[name] !== form.values[name] ? true : false,
                    touched: form.touched[name] ? form.touched[name] : false,
                    errors: form.errors[name] ? form.errors[name] : null,
                };

                return <FieldType {...props} />
            }}
        />;
    }

    _buildErrors({ name, ...props }) {
        const Errors = this._theme['Errors'];
        return <FastField
            name={name}
            render={({ form }) => {
                const touched = form.touched[name] ? form.touched[name] : false;
                props = {
                    ...props,
                    errors: touched && form.errors[name] ? form.errors[name] : null,
                };

                return <Errors {...props} />
            }}
        />
    }

    add(name, fieldType, { validators, ...props }) {
        const FieldType = this._theme[fieldType];
        if (!FieldType) throw new Error(`The \`${fieldType}\` component does not exist in the theme you have set up!`);

        const keyArray = name.split('.');
        if (keyArray.length > 1) {
            name = keyArray.reduce((acc, key) => {
                if (!acc) acc += key;
                else acc += `[${key}]`;

                return acc;
            }, '');
        }

        let componentField = {
            Label: (labelProps) => this._theme['Label']({ name, ...props, ...labelProps }),
            FieldType: (fieldTypeProps) => this._buildFieldType(name, FieldType, { ...props, fieldTypeProps }),
            Errors: (errorsProps) => this._buildErrors({ name, ...props, ...errorsProps }),
        };

        componentField.Row = (rowProps) => this._theme['Row']({
            label: componentField.Label,
            fieldType: componentField.FieldType,
            errors: componentField.Errors,
            ...rowProps
        });

        this._fields = merge(
            this._fields,
            {
                [pascalCase(name)]: {
                    ...componentField,
                    props: {
                        name,
                        ...props
                    }
                }
            }
        );

        if (!(/Button$/).test(fieldType)) {
            this._initialValues = merge(
                this._initialValues,
                formDataToObject.toObj({ [name]: props.initialValue ? props.initialValue : '' })
            );

            if (validators) {
                this._validators = merge(
                    this._validators,
                    { [name]: validators }
                );
            }
        }

        return this;
    }

    _validate(values) {
        if (!this._validatorsSpec) {
            this._validatorsSpec = (values) => Object.keys(this._validators)
                .reduce((acc, key) => {
                    const validators = this._validators[key];
                    const { props } = this._fields[pascalCase(key)];

                    acc[key] = buildValidators({
                        label: props.label || props.placeholder || null,
                        validators,
                        translate: this._translate,
                        validations: this._validations,
                        messages: this._validationMessages(),
                        values,
                    });
                    return acc;
                }, {});
        }

        const spec = this._validatorsSpec(values);
        const validationResult = spected(spec, values);

        return getErrorsFromValidationResult(validationResult);
    }

    _render(props) {
        const Form = this.Form;
        const Fields = Object.keys(this.Fields).reduce((acc, name) => {
            const field = this.Fields[name];
            acc.push(field.Row);
            return acc;
        }, []);

        return (
            <Form {...props}>
                {Fields.map((Row, key) => <Row key={key} />)}
            </Form>
        );
    }

    get Fields() {
        return this._fields;
    }

    Form = ({ handleSubmit, children, ...props }) => {
        const Form = this._theme['Form'];
        return (
            <Form onSubmit={handleSubmit} {...props}>
                {children}
            </Form>
        );
    };

    Formik = ({ formRef, onSubmit, initialValues = {}, render, ...props }) => {
        let formikRender = (formikProps) => this._render({ ...formikProps, ...props });
        if (render) formikRender = (formikProps) => render({ ...formikProps, ...props });

        return <Formik
            ref={formRef}
            onSubmit={onSubmit}
            initialValues={{ ...this._initialValues, ...initialValues }}
            validate={(values) => this._validate(values)}
            render={formikRender}
        />
    }
}

module.exports = FormBuilder;