# React Form Builder

## Installation

React Form Builder requires **React 15 or later** and **react-i18next 7 or later**.

```bash
npm i @elevenlabs/react-formbuilder --save
```

## Demos

Here is a simple example of React Formbuilder being used in an app:

```jsx
import React, { Component, Fragment } from 'react';

import { translate } from 'react-i18next';

import FormBuilder from '@elevenlabs/react-formbuilder';
import theme from '@elevenlabs/react-formbuilder-theme/minimalist';

const LoginForm = ({ translate }) => {
    const form = new FormBuilder();

    form
        .setTranslate(translate)
        .setTheme(theme)
        .createForm()
        .add('username', 'TextField', {
            label: 'Username',
            required: true,
            validators: [
                'Required'
            ],
        })
        .add('password', 'TextField', {
            type: 'password',
            label: 'Password',
            required: true,
            validators: [
                'Required',
                ['IsGreaterThan', { length: 6 }]
            ],
        })
        .add('submit', 'Button', {
            type: 'submit',
            label: 'Log in',
        });

    return form;
};

class Login extends Component {

    static defaultProps = {
        initialValues: {}
    };

    state = {
        data: {}
    };

    constructor(props) {
        super(props);
        this.LoginForm = LoginForm({ translate: props.t });
    }

    validateCredentials(credentials, setErrors) {
        if (credentials.username !== 'guest') {
            setErrors({ username: 'The username does not exist!', password: true });
            return;
        } else if (credentials.password !== 'guest01') {
            setErrors({ password: 'The password is invalid!' });
            return;
        }

        this.setState({
            data: credentials
        });
    }

    onSubmit = (payload, { setSubmitting, setErrors }) => {
        this.setState({ data: {} });
        this.validateCredentials(payload, setErrors);
        setSubmitting(false);
    };

    render() {
        const
            Form = this.LoginForm.Formik,
            { data } = this.state;

        return (
            <Fragment>
                <main>
                    <h1>Login</h1>
                    <Form
                        onSubmit={this.onSubmit}
                        initialValues={this.props.initialValues}
                    />
                </main>
                <pre style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bottom: 12,
                    width: '50%',
                    border: '1px solid #eee',
                    borderRadius: 4,
                    overflowX: 'scroll',
                    fontSize: 11,
                    lineHeight: 1.4,
                    boxSizing: 'border-box',
                    padding: 12,
                    margin: 0,
                }}>
                        {JSON.stringify(data, null, 2)}
            </pre>
            </Fragment>
        );
    }
}

export default translate(['formbuilder_validators'], { wait: true })(Login);
```

## Table of Contents

* [API](#api)
  * [`FormBuilder`](#formbuilder)
    * [Methods](#formbuilder-methods)
        * [setTranslate: (translate: string) => this](#formbuilder-methods)
        * [setTheme: (theme: object) => this](#formbuilder-methods)
        * [setValidations: (validations: object) => this](#formbuilder-methods)
        * [createForm: () => this](#formbuilder-methods)
        * [add: (name: string, fieldType: String, props: object) => this](#formbuilder-methods)
        * [Formik: Formik](#formbuilder-methods)
        * [Fields: [Field]](#formbuilder-methods)

## API

### FormBuilder

#### Methods

##### `add: (name: string, fieldType: String, props: object) => this`

## Write validators

```
validators: [
    'Required',
],
```

or 

```
validators: [
    ['Required', 'validators.required_custom'],
],
```

or

```
validators: [
    [v => !empty(v), 'validators.required_custom']
],
```

### With arguments

```
validators: [
    ['IsGreaterThan', { length: 6 }]
],
```

or 

```
validators: [
    ['IsGreaterThan', { length: 6 }, 'validators.is_greater_than_custom'],
],
```

or

```
validators: [
    [(v, { length }) => v.length >= length, { length: 6 }, 'validators.is_greater_than_custom'],
],
```