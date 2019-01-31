import React from "react";
import Form from "../components/Form";
import Button from "../components/Button";

const theme = {
  Form: ({ children, onSubmit, className }) => <form onSubmit={onSubmit} className={className}>{children}</form>,
  Row: ({ Label, Field, Errors, fieldType, errors, required }) => (
    <Form.Row hasErrors={errors && errors.length > 0 ? true : false} required={required}>
      {!['Button', 'CheckboxField'].includes(fieldType) && Label && <Label />}
      <Field />
      <Errors />
    </Form.Row>
  ),
  Label: ({ label, ...props }) => <Form.Label {...props}>{label}</Form.Label>,
  Errors: ({ errors }) => <Form.Helper>{errors}</Form.Helper>,

  TextField: (props) => <Form.Fields.Text {...props} />,

  CheckboxField: (props) => <Form.Fields.Checkbox {...props} />,
  CheckboxGroupField: (props) => <Form.Fields.Checkbox.Group {...props} />,
  RadioField: (props) => <Form.Fields.Radio.Group {...props} />,

  SelectField: (props) => <Form.Fields.Select {...props} />,

  Button: (props) => <Button {...props} />
};

export default theme;
