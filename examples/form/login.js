import FormBuilder from '../../src';
import theme from '../theme/minimalist';

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

export default LoginForm;