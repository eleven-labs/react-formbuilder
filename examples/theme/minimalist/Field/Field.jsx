import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Label from '../Label';
import Helper from '../Helper';

import './styles.scss';

const Field = ({ id, label, className, state = null, help, children }) => {
  const classes = classnames(
    'minimalist-field',
    { 'animated shake error': state === 'error', help },
    { 'success': state === 'success' },
    className
  );

  return (
    <div className={classes}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
      {help && <Helper help={help} />}
    </div>
  );
};

Field.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  state: PropTypes.oneOf(['success', 'warning', 'error']),
  help: PropTypes.string,
  children: PropTypes.any.isRequired,
};

export default Field;
