import React from 'react';
import classnames from 'classnames';

import Label from '../Label';
import Helper from '../Helper';

import './styles.scss';

const Field = ({ id, label, className, error, help, children }) => {
  const classes = classnames(
    'minimalist-field',
    { 'animated shake error': error },
    className
  );

  return (
    <div className={classes}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
      {error && <Helper help={error} />}
    </div>
  );
};

export default Field;
