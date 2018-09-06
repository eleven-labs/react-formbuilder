import React, { Component } from 'react';

import Button from './Button';
import { Field as BaseField, TextField } from './Field';

class Field extends Component {

  shouldComponentUpdate({ value: nextValue, error: nextError, form: { submitCount: nextSubmitCount } }) {
    const { value: currentValue, error: currentError, form: { submitCount: currentSubmitCount } } = this.props;
    if (currentValue !== nextValue || currentError !== nextError || currentSubmitCount !== nextSubmitCount) {
      return true;
    }
    return false;
  }

  render() {
    const { dirty, touched, error, children, ...props } = this.props;

    props.state = null;
    if (touched && error) {
      props.state = 'error';
      if (typeof error === 'string') {
        props.help = error;
      }
    } else if (dirty) {
      props.state = 'success';
    }

    return (
      <BaseField {...props}>
        {children}
      </BaseField>
    );
  }
}

const theme = {
  Button: ({ label, type = 'button', ...props }) => (
    <Button type={type} {...props}>
      {label}
    </Button>
  ),
  TextField: props => (
    <Field {...props}>
      <TextField {...props} />
    </Field>
  ),
};

export default theme;