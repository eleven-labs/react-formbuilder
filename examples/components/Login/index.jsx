import React, { Component, Fragment } from 'react';

import { translate, Trans } from 'react-i18next';

import LoginForm from '../../form/login';
import Code from '../Code';

class LoginExample extends Component {

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
                    <Form onSubmit={this.onSubmit} />
                    <p style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <span>Username: guest</span>
                        <span>Password: guest01</span>
                    </p>
                </main>
                <Code>{JSON.stringify(data, null, 2)}</Code>
            </Fragment>
        );
    }
}

export default translate(['formbuilder_validators'], { wait: true })(LoginExample);
