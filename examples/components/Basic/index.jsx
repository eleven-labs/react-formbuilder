import React, { Component, Fragment } from 'react';

import LoginFormBuilder from '../../formBuilder/login';
import Code from '../Code';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class BasicExample extends Component {

    static defaultProps = {
        initialValues: {}
    };

    state = {
        data: {}
    };

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
        sleep(1000).then(() => {
            this.validateCredentials(payload, setErrors);
            setSubmitting(false);
        });
    };

    render() {
        const
            Form = LoginFormBuilder.Formik,
            { data } = this.state;

        return (
            <Fragment>
                <main>
                    <h1>Login form</h1>
                    <Form
                        onSubmit={this.onSubmit}
                        initialValues={this.props.initialValues}
                    />
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

export default BasicExample;
