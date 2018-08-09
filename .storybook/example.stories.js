import './story.scss';
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import Code from './../examples/components/Code';
import BasicExample from './../examples/components/Basic';

storiesOf('Example', module)
    .addDecorator(story => (
        <div className="story">
            {story()}
        </div>
    ))
    .add('Basic', () => <BasicExample />);
