
# React Form Builder

This package is built around [**Formik**](https://jaredpalmer.com/formik) and inspired by the [**Symfony**](https://symfony.com) FormBuilder.

## Summary
  
- [Requirements](#requirements)
- [Get Started](#get-started)
    - [Installation](#installation)
    - [Creating theme](#creating-theme)
    - [Creating translation function](#creating-translation-function)
    - [Creating a Simple Form](#creating-a-simple-form)
    - [Building and render the Form](#building-and-render-the-form)
    - [Custom render Formik](#custom-render-formik)
    - [Set initials values](#set-initials-values)
    - [Add validators and write custom](#add-validators-and-write-custom)
- [API Reference](#api-reference)

## Requirements

- [**React**](https://reactjs.org) 15 or greater.

## Get started

### Installation

```bash
npm i @elevenlabs/react-formbuilder --save
# or
yarn add @elevenlabs/react-formbuilder
```

Before you start, you need to create a theme and a translation function or use I18next.

### Creating theme

```jsx
import React from "react";

const allowedKeysInObject = (keys, props) => {
  const values = Object.keys(props).reduce((acc, k) => {
    if (keys.includes(k)) acc[k] = props[k];
    return acc;
  }, {});
  return values;
};

const Form = {
  Group: ({
    children,
    fieldType: FieldType,
    label,
    touched,
    error,
    ...props
  }) => {
    if (children) return <div style={{ marginTop: 10 }}>{children}</div>;
    let helper = touched && error ? error : null;
    return (
      <div style={{ marginTop: 10 }}>
        {label && (
          <label htmlFor={props.id} style={{ marginRight: 10 }}>
            {label}
          </label>
        )}
        <FieldType {...props} />
        {helper && <p>{helper}</p>}
      </div>
    );
  },
  Fields: {
    Text: props => {
      let allowedPropsTextField = allowedKeysInObject(
        [
          "id",
          "type",
          "name",
          "value",
          "onChange",
          "onBlur",
          "onFocus",
          "placeholder",
          "className"
        ],
        props
      );

      return <input {...allowedPropsTextField} />;
    }
  },
  Button: ({ label, ...props }) => {
    let allowedPropsButton = allowedKeysInObject(
      ["type", "className", "onClick"],
      props
    );
    return <button {...allowedPropsButton}>{label}</button>;
  }
};

const theme = {
  Form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,
  TextField: props => {
    return <Form.Group fieldType={Form.Fields.Text} {...props} />;
  },
  Button: props => (
    <Form.Group>
      <Form.Button {...props} />
    </Form.Group>
  )
};

export default theme;
```

### Creating translation function

```js
const translate = (key, args) => {
  const translations = {
    "formbuilder.validators.required": ({ label }) =>
      `Please input your ${label.toLowerCase()}!`,
    "formbuilder.validators.email": () => `Email is invalid!`,
    "formbuilder.validators.is_greater_than": ({ label, length }) =>
      `${label} has to be longer than ${length} characters!`
  };

  return translations[key] ? translations[key](args) : key;
};

export default translate;
```

### Creating a Simple Form

We will take as an example a login form.

```js
import FormBuilder from "@elevenlabs/react-formbuilder";
import theme from "../theme";
import translate from "../translate";

const LoginForm = () => {
  const form = new FormBuilder();

  form
    .setTranslate(translate)
    .setTheme(theme)
    .createForm()
    .add("email", "TextField", {
      label: "Email",
      required: true,
      validators: ["Required", "Email"]
    })
    .add("password", "TextField", {
      type: "password",
      label: "Password",
      required: true,
      validators: ["Required", ["IsGreaterThan", { length: 6 }]]
    })
    .add("submit", "Button", {
      type: "submit",
      label: "Login"
    });

  return form;
};

export default LoginForm;
```

### Building and render the Form

```jsx
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import LoginFormBuilder from "../formBuilder/login";

class LoginScreen extends Component {
  state = {
    LoginForm: null
  };

  componentWillMount() {
    const LoginForm = LoginFormBuilder();
    this.setState({ LoginForm });
  }

  onSubmit = (payload, formikProps) => {};

  render() {
    const { LoginForm } = this.state;

    return (
      <div className="screen-login">
        {LoginForm ? (
          <LoginForm.Formik
            className="screen-login__form"
            onSubmit={this.onSubmit}
          />
        ) : (
          <p>Loading ...</p>
        )}
      </div>
    );
  }
}

export default LoginScreen;
```

You can find the following code [here](https://codesandbox.io/s/vmknpnqq93).

### Custom render Formik

If you want to completely customize the form this is possible, here is an example:

```jsx
import React, { Component } from "react";

import LoginFormBuilder from "../formBuilder/login";

class LoginScreen extends Component {

  state = {
    LoginForm: null
  };

  componentWillMount() {
    const LoginForm = LoginFormBuilder();
    this.setState({ LoginForm });
  }

  onSubmit = (payload, formikProps) => {};

  formikRender = (formikProps) => {
    const { LoginForm } = this.state;
    const { Fields } = LoginForm;

    return (
      <LoginForm.Form formikProps={formikProps}>
        <Fields.Email.Errors />
        <Fields.Password.Errors />

        <Fields.Email.Label />
        <Fields.Email.FieldType />

        <Fields.Password.Label />
        <Fields.Password.FieldType />

        <Fields.Submit.FieldType />
      </LoginForm.Form>
    );
  };

  render() {
    const { LoginForm } = this.state;

    return (
      <div className="screen-login">
        {LoginForm ? (
          <LoginForm.Formik
            className="screen-login__form"
            onSubmit={this.onSubmit}
            render={this.formikRender}
          />
        ) : (
            <p>Loading ...</p>
          )}
      </div>
    );
  }
}

export default LoginScreen;
```

### Set initials values

To hydrate the form with data.

From the component:

```jsx
<LoginForm.Formik
    className="screen-login__form"
    onSubmit={this.onSubmit}
    initialValues={{username: 'john', password: 'doe'}}
    render={this.formikRender}
  />
```

From the formBuilder:

```jsx
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("email", "TextField", {
    label: "Email",
    required: true,
    initialValue: 'john',
    validators: ["Required", "Email"]
  })
  .add("password", "TextField", {
    type: "password",
    label: "Password",
    required: true,
    validators: ["Required", ["IsGreaterThan", { length: 6 }]]
  })
  .add("submit", "Button", {
    type: "submit",
    label: "Login"
  });
```

### Add validators and write custom

List of available validators:

- Required

Apply a validator with this default key. The translation key is created automatically generated in relation  to the validator name, it is always in snakeCase. Example for `Required` this will be `validators.required`.

```js
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("name", "TextField", {
    label: "Name",
    validators: ["Required"]
  });
```

If you want to change the default generate key:

```js
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("name", "TextField", {
    label: "Name",
    validators: [
      ['Required', 'validators.required_custom'],
    ]
  });
```

A completely custom validator:

```js
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("name", "TextField", {
    label: "Name",
    validators: [
      [v => !empty(v), 'validators.required_custom'],
    ]
  });
```

And examples with arguments:

```js
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("name", "TextField", {
    label: "Name",
    validators: [
      ['IsGreaterThan', { length: 6 }],
    ]
  });
```

```js
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("name", "TextField", {
    label: "Name",
    validators: [
      ['IsGreaterThan', { length: 6 }, 'validators.is_greater_than_custom'],
    ]
  });
```

```js
const form = new FormBuilder();

form
  .setTranslate(translate)
  .setTheme(theme)
  .createForm()
  .add("name", "TextField", {
    label: "Name",
    validators: [
      [(v, { length }) => v.length >= length, { length: 6 }, 'validators.is_greater_than_custom'],
    ]
  });
```

### API Reference

Global static

#### setTranslate: (translate: void) => this
#### setTheme: (theme: Theme) => this
#### setValidations: (validations: [Validation]) => this

Instance

#### setTranslate: (translate: void) => this
#### setTheme: (theme: Theme) => this
#### setValidations: (validations: [Validation]) => this 
#### createForm: () => this
#### add: (name: string, fieldType: String, props: Props) => this
#### Formik: ReactNode
#### Fields: Array[ReactNode]