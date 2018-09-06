import React from 'react';
import { Formik, Field } from 'formik';
import { merge, snakeCase } from 'lodash';
import spected from 'spected';
import formDataToObject from 'form-data-to-object';
import { pascalCase, pascalCaseFormData } from './helpers/string';
import { buildValidators, getErrorsFromValidationResult } from './helpers/validator';
import validations from './validations';

class FormBuilder {

    _translate = () => { };
    _theme = null;
    _initialValues = {};
    _fieldsInfo = {};
    _fields = {};
    _validators = {};
    _validations = validations;
    _validatorsSpec = null;

    setTranslate(translate) {
        this._translate = translate;
        return this;
    }

    setTheme(theme) {
        this._theme = theme;
        return this;
    }

    setValidations(validations) {
        this._validations = {
            ...this._validations,
            ...validations,
        };
        return this;
    }

    createForm() {
        if (!this._translate) throw new Error('The translate is not defined!');
        if (!this._theme) throw new Error('The theme is not defined!');

        this._initialValues = {};
        this._fieldsInfo = {};
        this._fields = {};

        return this;
    }

    get Fields() {
        return this._fields;
    }

    _validationMessages() {
        const validationMessages = Object.keys(this._validations)
            .reduce((acc, validationKey) => {
                acc[validationKey] = `formbuilder.validators.${snakeCase(validationKey)}`;
                return acc;
            }, {});

        return validationMessages;
    }

    _buildField(name, FieldType, fieldProps) {
        fieldProps = {
            ...fieldProps,
            id: pascalCase(name),
            name
        };

        return (props = {}) => (
            <Field
                name={name}
                render={({ field, form }) => {
                    fieldProps = {
                        ...fieldProps,
                        ...field,
                        ...props,
                        dirty: form.initialValues[name] !== form.values[name]  ? true : false,
                        touched: form.touched[name] ? form.touched[name] : false,
                        error: form.errors[name] ? form.errors[name] : null,
                        form
                    };

                    return <FieldType {...fieldProps} />
                }}
            />
        );
    }

    add(name, fieldType, { validators, ...props }) {
        const FieldType = this._theme[fieldType];
        if (!FieldType) throw new Error('This field does not exist in the theme you have set up!');

        const keyArray = name.split('.');
        if (keyArray.length > 1) {
            name = keyArray.reduce((acc, key) => {
                if (!acc) acc += key;
                else acc += `[${key}]`;

                return acc;
            }, '');
        }

        this._fieldsInfo = merge(
            this._fieldsInfo,
            formDataToObject.toObj({
                [name]: {
                    fieldType: FieldType,
                    props
                }
            })
        );

        if ((/Field$/).test(fieldType)) {
            this._initialValues = merge(
                this._initialValues,
                formDataToObject.toObj({
                    [name]: props.initialValue ? props.initialValue : ''
                })
            );

            if (validators) {
                this._validators = merge(
                    this._validators,
                    formDataToObject.toObj({
                        [name]: validators
                    })
                );
            }
        }

        this._fields = merge(
            this._fields,
            formDataToObject.toObj({
                [pascalCaseFormData(name)]: this._buildField(name, FieldType, {
                    ...props,
                }),
            })
        );

        return this;
    }

    _validate(values) {
        if (!this._validatorsSpec) {
            this._validatorsSpec = (values) => Object.keys(this._validators)
                .reduce((acc, key) => {
                    const validators = this._validators[key];
                    const { props } = this._fieldsInfo[key];

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

    _renderFields() {
        let fields = formDataToObject.fromObj(this._fields);

        return Object.values(fields).map((Field, key) =>
            Array.isArray(Field) ? Field : <Field key={key} />
        )
    }

    _render({ className, fields, handleSubmit }) {
        return (
            <form className={className} onSubmit={handleSubmit}>
                {fields}
            </form>
        );
    }

    Formik = ({ formRef, onSubmit, initialValues = {}, className, renderFields }) => {
        return <Formik
            ref={formRef}
            onSubmit={onSubmit}
            initialValues={{ ...this._initialValues, ...initialValues }}
            validate={(values) => this._validate(values)}
            render={(props) => this._render({
                className,
                fields: renderFields ? renderFields() : this._renderFields(),
                ...props
            })}
        />
    }
}

module.exports = FormBuilder;