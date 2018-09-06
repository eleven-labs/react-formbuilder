import './story.scss';

import React from 'react';
import { storiesOf } from '@storybook/react';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; 

import LoginExample from './../examples/components/Login';
import RegisterExample from './../examples/components/Register';

const I18nDecorator = (story) => (
    <I18nextProvider i18n={i18n}>
        <div className="story">
            {story()}
        </div>
    </I18nextProvider>
);

storiesOf('Example/CaseStudy', module)
    .addDecorator(I18nDecorator)
    .add('Login', () => <LoginExample />)
    .add('Register', () => <RegisterExample />);
