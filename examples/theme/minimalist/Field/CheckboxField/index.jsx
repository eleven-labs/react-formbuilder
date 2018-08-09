import React from 'react';

import './styles.scss';

const CheckboxField = ({
  id,
  value = '',
  onChange,
  onFocus,
  onBlur
}) => {
  return (
    <input
      id={id}
      className="minimalist-field__text-type"
      type="checkbox"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default CheckboxField;
