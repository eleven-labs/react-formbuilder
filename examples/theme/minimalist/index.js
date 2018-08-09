import React from 'react';

import Button from './Button';
import { Field, TextField, CheckboxField } from './Field';

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
  CheckboxField: props => (
    <Field {...props}>
      <CheckboxField {...props} />
    </Field>
  ),
  renderActions: ({ dirty, isSubmitting, handleReset }, formBuilder) => {
    const { layout } = formBuilder,
      { Button } = theme;

    return (
      <div>
        {formBuilder.buttons.map((buttonProps, key) => {
          if (buttonProps.type === 'submit') {
            if (isSubmitting) buttonProps.loading = true;
            else buttonProps.loading = false;
          } else if (buttonProps.type === 'reset') {
            buttonProps = {
              ...buttonProps,
              onClick: handleReset,
              disabled: !dirty || isSubmitting
            };
          }

          return <Button key={key} {...buttonProps} />;
        })}
      </div>
    );
  }
};

export default theme;