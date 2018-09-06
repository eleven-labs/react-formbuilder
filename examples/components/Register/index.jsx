import React, { Component, Fragment } from 'react';

import { translate } from 'react-i18next';

import RegisterForm from '../../form/register';
import Code from '../Code';

class RegisterExample extends Component {

    state = {
        data: {}
    };

    constructor(props) {
        super(props);
        this.RegisterForm = RegisterForm({ translate: props.t });
    }

    onSubmit = (payload, { setSubmitting }) => {
        this.setState({ data: payload });
        setSubmitting(false);
    };

    renderFields = () => {
        const {
            Username,
            Email,
            Password,
            PasswordConfirmation,
            Submit
        } = this.RegisterForm.Fields;

        return (
            <Fragment>
                <div className="minimalist-field-group">
                    <Username />
                    <Email />
                </div>
                <div className="minimalist-field-group">
                    <Password />
                    <PasswordConfirmation />
                </div>
                <Submit />
            </Fragment>
        )
    }

    render() {
        const
            Form = this.RegisterForm.Formik,
            { data } = this.state;

        return (
            <Fragment>
                <main>
                    <h1>Register</h1>
                    <Form
                        onSubmit={this.onSubmit}
                        renderFields={this.renderFields}
                    />
                </main>
                <Code>{JSON.stringify(data, null, 2)}</Code>
            </Fragment>
        );
    }
}

export default translate(['formbuilder_validators'], { wait: true })(RegisterExample);