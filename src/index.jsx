import React from 'react';
import { Formik, Field } from 'formik';
import merge from 'lodash/merge';
import spected from 'spected';
import formDataToObject from 'form-data-to-object';
import { pascalCase, pascalCaseFormData } from './helpers/string';
import { buildValidators, getErrorsFromValidationResult } from './helpers/validator';

class FormBuilder {

    layout = null;
    initialValues = {};
    fieldsInfo = {};
    customValidators = {};
    validators = {};
    fields = {};
    buttons = [];

    constructor({ theme, validators, locale = 'en' }) {
        if (!theme) throw new Error('The theme is not defined!');
        
        this.theme = theme;
        this.customValidators = validators;
        this.locale = locale;
    }

    setLayout(layout) {
        this.layout = layout;
        return this;
    }

    _buildField(name, FieldType, { hasValidators, ...props }) {
        let fieldProps = {
            ...props,
            id: pascalCase(name),
            name
        };

        return (props = {}) => (
            <Field
                name={name}
                render={({ field, form }) => {
                    const error = form.touched[name] && form.errors[name];

                    return <FieldType
                        form={form}
                        hasValidators={hasValidators}
                        {...field}
                        {...fieldProps}
                        {...props}
                        error={error}
                    />
                }}
            />
        );
    }

    _getDefaultValue(fieldType, props) {
        switch (fieldType) {
            case 'RateField':
                return 0;
            case 'DatePickerField':
            case 'SliderField':
                return null;
            case 'SwitchField':
                return false;
            case 'CheckboxField':
                return [];
            case 'SelectField':
                if (props.mode && props.mode === 'multiple') {
                    return [];
                }
                return '';
            default:
                return '';
        }
    }

    add(name, fieldType, { validators, ...props }) {
        const FieldType = this.theme[fieldType];
        if (!FieldType) throw new Error('This field does not exist in the theme you have set up!');

        const keyArray = name.split('.');
        if (keyArray.length > 1) {
            name = keyArray.reduce((acc, key) => {
                if (!acc) acc += key;
                else acc += `[${key}]`;

                return acc;
            }, '');
        }

        props = {
            layout: this.layout,
            ...props
        };

        this.fieldsInfo = merge(
            this.fieldsInfo,
            formDataToObject.toObj({
                [name]: {
                    fieldType: FieldType,
                    props
                }
            })
        );

        this.initialValues = merge(
            this.initialValues,
            formDataToObject.toObj({
                [name]: this._getDefaultValue(fieldType, props)
            })
        );

        if (validators) {
            this.validators = merge(
                this.validators,
                formDataToObject.toObj({
                    [name]: buildValidators({ label: props.label || props.placeholder || null, validators, locale: this.locale, customValidators: this.customValidators })
                })
            );
        }

        this.fields = merge(
            this.fields,
            formDataToObject.toObj({
                [pascalCaseFormData(name)]: this._buildField(name, FieldType, {
                    hasValidators: !!validators,
                    ...props,
                }),
            })
        );

        return this;
    }

    addButton(props) {
        this.buttons.push({
            layout: this.layout,
            ...props
        });
        return this;
    }

    validate(values) {
        if (!this.validators) return;

        const validationResult = spected(this.validators, values);

        return getErrorsFromValidationResult(validationResult);
    }

    renderActions(props) {
        const { renderActions } = this.theme;
        if (!renderActions) throw new Error('The render actions function is not configured in the theme!');

        return renderActions(props, this);
    }

    renderFields() {
        let fields = formDataToObject.fromObj(this.fields);

        return Object.values(fields).map((Field, key) =>
            Array.isArray(Field) ? Field : <Field key={key} />
        )
    }

    render({ className, ...props }) {
        return (
            <form className={className} onSubmit={props.handleSubmit}>
                {this.renderFields()}
                {this.renderActions(props)}
            </form>
        );
    }

    Formik = ({ formRef, onSubmit, initialValues = {}, className, render }) => {
        return <Formik
            ref={formRef}
            onSubmit={onSubmit}
            initialValues={{ ...this.initialValues, ...initialValues }}
            validate={(values) => this.validate(values)}
            render={render ? render : (props) => this.render({ className, ...props })}
        />
    }
}

module.exports = FormBuilder;