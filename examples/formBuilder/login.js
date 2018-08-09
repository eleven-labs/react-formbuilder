import React from 'react';

import FormBuilder from '../../lib';
import theme from '../theme/minimalist';

const LoginFormBuilder = () => {
    const formBuilder = new FormBuilder({ theme });

    let form = formBuilder
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
                [
                    value => value.length >= 6,
                    `Password has to be longer than 6 characters!`,
                ]
            ],
        })
        .addButton({
            type: 'submit',
            label: 'Log in',
        });

    return form;
};

export default LoginFormBuilder();