import React from 'react';
import { Formik, Field, FastField, connect as formikConnect } from 'formik';
import { merge, snakeCase, camelCase, capitalize } from 'lodash';
import spected from 'spected';
import { buildValidators, getErrorsFromValidationResult } from './helpers/validator';
import validations from './validations';

const pascalCase = (string) => capitalize(camelCase(string));

class FormBuilder {

  _fields = {};
  _fieldComponents = {};

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
      ...validations,
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

  _buildFieldComponent(name, notFastField) {
    const Row = this._theme['Row'];
    const { fieldType, ...fieldTypeProps } = this._fields[name];

    const components = {
      Label: (props) => this.Label(name, props),
      Field: (props) => this.Field(name, props, notFastField),
      Errors: (props) => this.Errors(name, props)
    };

    let FormikField = FastField;
    if (notFastField) {
      FormikField = Field;
    }

    this._fieldComponents[pascalCase(name)] = {
      Row: (props) => (<FormikField
        name={name}
        render={({ form }) => Row({
          ...components,
          fieldType,
          ...fieldTypeProps,
          errors: form.isSubmitting || form.touched[name] && form.errors[name] ? form.errors[name] : null,
          ...props
        })}
      />),
      ...components,
    };
  }

  Label(name, labelProps = {}) {
    const Label = this._theme['Label'];
    const { id, label, required } = this._fields[name];

    const props = {
      label,
      required,
      htmlFor: id,
      ...labelProps,
    };

    return <Label {...props} />;
  }

  Field(name, fieldProps = {}, notFastField) {
    const { fieldType, ...fieldTypeProps } = this._fields[name];

    const FieldType = this._theme[fieldType];
    if (!FieldType) throw new Error(`The \`${fieldType}\` component does not exist in the theme you have set up!`);

    let FormikField = FastField;
    if (notFastField) {
      FormikField = Field;
    }

    return <FormikField
      name={name}
      render={({ field, form }) => {
        const props = {
          ...field,
          ...fieldTypeProps,
          ...fieldProps,
          formik: form,
          dirty: form.initialValues[name] !== form.values[name] ? true : false,
          touched: form.touched[name] ? form.touched[name] : false,
          errors: form.errors[name] ? form.errors[name] : null,
        };

        return <FieldType {...props} />
      }}
    />;
  }

  Errors(name, errorsProps = {}) {
    const Errors = this._theme['Errors'];

    return formikConnect(({ formik, ...props }) => {
      const errors = formik.errors[name];
      const touch = formik.touched[name];

      return formik.isSubmitting || touch && errors ? <Errors errors={errors} {...props} /> : null;
    })(errorsProps);
  }

  Row(name, rowProps = {}) {
    const { Row } = this.Fields[pascalCase(name)];
    return <Row {...rowProps} />;
  }

  add(name, fieldType, { validators, ...props }, notFastField = false) {
    const keyArray = name.split('.');
    if (keyArray.length > 1) {
      name = keyArray.reduce((acc, key) => {
        if (!acc) acc += key;
        else acc += `[${key}]`;

        return acc;
      }, '');
    }

    this._fields = merge(
      this._fields,
      {
        [name]: {
          fieldType,
          name,
          id: camelCase(name),
          ...props
        }
      }
    );

    this._buildFieldComponent(name, notFastField);

    if (!(/Button$/).test(fieldType)) {
      this._initialValues = merge(
        this._initialValues,
        { [name]: props.initialValue ? props.initialValue : '' }
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
          const { label, placeholder } = this._fields[key];

          acc[key] = buildValidators({
            label: label || placeholder || null,
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

    return (
      <Form {...props}>
        {Object.keys(this.Fields).map((name, key) => {
          const { Row } = this.Fields[name];
          return <Row key={key} />;
        })}
      </Form>
    );
  }

  get Fields() {
    return this._fieldComponents;
  }

  Form = ({ handleSubmit, children, ...props }) => {
    const Form = this._theme['Form'];
    return (
      <Form onSubmit={handleSubmit} {...props}>
        {children}
      </Form>
    );
  };

  Formik = ({ formRef, onSubmit, initialValues = {}, render, hasErrors, ...props }) => {
    let formikRender = (formikProps) => this._render({ ...formikProps, ...props });
    if (render) formikRender = (formikProps) => render({ ...formikProps, ...props });

    let formikValidate = (values) => {
      const errors = this._validate(values);
      if (hasErrors) {
        hasErrors(Object.keys(errors).length > 0);
      };
      return errors;
    };

    return <Formik
      ref={formRef}
      onSubmit={onSubmit}
      initialValues={{ ...this._initialValues, ...initialValues }}
      validate={formikValidate}
      render={formikRender}
    />
  }
}

module.exports = FormBuilder;