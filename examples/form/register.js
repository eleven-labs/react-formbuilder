import FormBuilder from '../../src';
import theme from '../theme/minimalist';

const RegisterForm = ({ translate }) => {
    const form = new FormBuilder();

    form
        .setTranslate(translate)
        .setTheme(theme)
        .createForm()
        .add('username', 'TextField', {
            label: 'Username',
            required: true,
            validators: [
                'Required',
            ],
        })
        .add('email', 'TextField', {
            label: 'Email',
            required: true,
            validators: [
                'Required',
                'Email'
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
        .add('passwordConfirmation', 'TextField', {
            type: 'password',
            label: 'Password confirmation',
            required: true,
            validators: [
                'Required',
                ['RepeatValue', { key: 'password' }]
            ],
        })
        .add('submit', 'Button', {
            type: 'submit',
            label: 'Register',
        });

    return form;
};

export default RegisterForm;